const nodemailer = require('nodemailer');

const SERVICE_TYPE_LABELS = {
    fr: {
        residential: 'Nettoyage résidentiel',
        commercial: 'Nettoyage commercial',
        airbnb: 'Conciergerie & Airbnb',
        carpet: 'Carpet Cleaning'
    },
    en: {
        residential: 'Residential cleaning',
        commercial: 'Commercial cleaning',
        airbnb: 'Concierge & Airbnb',
        carpet: 'Carpet Cleaning'
    }
};

const FREQUENCY_LABELS = {
    fr: {
        'one-time': 'Nettoyage ponctuel',
        weekly: 'Hebdomadaire',
        biweekly: 'Bi-hebdomadaire',
        monthly: 'Mensuel'
    },
    en: {
        'one-time': 'One-time',
        weekly: 'Weekly',
        biweekly: 'Bi-weekly',
        monthly: 'Monthly'
    }
};

function asTrimmedString(value) {
    if (typeof value !== 'string') return '';
    return value.trim();
}

function getEnv(name, fallbackName) {
    return process.env[name] || (fallbackName ? process.env[fallbackName] : undefined);
}

function parseBody(req) {
    if (!req || typeof req.body === 'undefined') return {};
    if (typeof req.body === 'string') {
        try {
            return JSON.parse(req.body);
        } catch {
            return {};
        }
    }
    return req.body;
}

function validatePayload(payload) {
    const errors = [];

    const fullName = asTrimmedString(payload.fullName);
    const email = asTrimmedString(payload.email);
    const phone = asTrimmedString(payload.phone);
    const serviceType = asTrimmedString(payload.serviceType);
    const frequency = asTrimmedString(payload.frequency);
    const country = asTrimmedString(payload.country);
    const city = asTrimmedString(payload.city);
    const postalCode = asTrimmedString(payload.postalCode);

    if (fullName.length < 2) errors.push('Nom invalide');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push('Email invalide');

    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    if (!phoneRegex.test(phone)) errors.push('Téléphone invalide');

    if (!serviceType) errors.push('Type de service requis');
    if (!frequency) errors.push('Fréquence requise');
    if (!country) errors.push('Pays requis');
    if (!city) errors.push('Ville requise');
    if (!postalCode) errors.push('Code postal requis');

    return errors;
}

function safeLabel(map, lang, key) {
    const normalizedLang = lang === 'en' ? 'en' : 'fr';
    return (map[normalizedLang] && map[normalizedLang][key]) || key || '';
}

function labelFrEn(map, key) {
    const fr = (map.fr && map.fr[key]) || key || '';
    const en = (map.en && map.en[key]) || key || '';
    return { fr, en };
}

function toSafeNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

function sanitizeMessage(message) {
    const raw = asTrimmedString(message);
    if (!raw) return '';
    return raw
        .split(/\r?\n/)
        .filter(line => {
            const trimmed = line.trim();
            if (!trimmed) return true;
            return !/^\-?\s*(Temps estim[ée]|Estimated time)\s*:/i.test(trimmed);
        })
        .join('\n')
        .trim();
}

function buildCalculatorQuoteBlock(payload) {
    const quote = payload && typeof payload.calculatorQuote === 'object' ? payload.calculatorQuote : null;
    if (!quote) return [];

    const lines = [];

    const service = asTrimmedString(quote.service);
    const estimatedPrice = asTrimmedString(quote.estimatedPrice);
    const details = quote && typeof quote.details === 'object' ? quote.details : {};
    const addons = Array.isArray(quote.addons) ? quote.addons : [];

    lines.push('');
    lines.push('---');
    lines.push('Détails du calculateur / Calculator details');

    if (service) lines.push(`Service (calculator): ${service}`);
    if (estimatedPrice) lines.push(`Prix estimé / Estimated price: $${estimatedPrice} CAD`);

    const detailLines = [];
    const bedrooms = asTrimmedString(details.bedrooms);
    const bathrooms = asTrimmedString(details.bathrooms);
    const kitchen = asTrimmedString(details.kitchen);
    const basement = asTrimmedString(details.basement);
    const rooms = asTrimmedString(details.rooms);
    const carpetSqft = asTrimmedString(details.carpetSqft);
    const commercialSqft = asTrimmedString(details.commercialSqft);
    const commercialFrequency = asTrimmedString(details.commercialFrequency);

    if (bedrooms) detailLines.push(`- Chambres / Bedrooms: ${bedrooms}`);
    if (bathrooms) detailLines.push(`- Salles de bain / Bathrooms: ${bathrooms}`);
    if (kitchen) detailLines.push(`- Cuisine / Kitchen: ${kitchen}`);
    if (basement) detailLines.push(`- Sous-sol / Basement: ${basement}`);
    if (rooms) detailLines.push(`- Pièces / Rooms: ${rooms}`);
    if (carpetSqft) detailLines.push(`- Tapis (pi²) / Carpet (sqft): ${carpetSqft}`);
    if (commercialSqft) detailLines.push(`- Superficie (pi²) / Square feet: ${commercialSqft}`);
    if (commercialFrequency) detailLines.push(`- Fréquence / Frequency: ${commercialFrequency}`);

    if (detailLines.length) {
        lines.push('');
        lines.push('Détails du service / Service details:');
        lines.push(...detailLines);
    }

    const addonLines = [];
    addons.forEach(a => {
        if (!a || typeof a !== 'object') return;
        const label = asTrimmedString(a.label) || asTrimmedString(a.id);
        const qty = toSafeNumber(a.qty);
        if (!label || !qty || qty <= 0) return;
        addonLines.push(`- ${label}: ${Math.floor(qty)}`);
    });

    if (addonLines.length) {
        lines.push('');
        lines.push('Prestations / Add-ons:');
        lines.push(...addonLines);
    }

    return lines;
}

function buildCustomerEmailText(payload) {
    const fullName = asTrimmedString(payload.fullName);

    const greetingFr = fullName ? `Bonjour ${fullName},` : 'Bonjour,';
    const greetingEn = fullName ? `Hello ${fullName},` : 'Hello,';

    return [
        greetingFr,
        '',
        'Nous avons bien reçu votre demande et nous vous répondrons dans les 24 heures.',
        '',
        '---',
        '',
        greetingEn,
        '',
        'We have received your request and will get back to you within 24 hours.',
        '',
        '---',
        '',
        'G.D.F Pro-Cleaners',
        'gdfprocleaners@gmail.com',
        '819 527-9171'
    ].join('\n');
}

function buildInternalEmailText(payload) {
    const countryDisplay = asTrimmedString(payload.countryLabel) || asTrimmedString(payload.country);

    const lines = [];
    lines.push('Nouvelle demande via le formulaire du site / New request from website form');
    lines.push('');
    lines.push(`Nom / Name: ${asTrimmedString(payload.fullName)}`);
    lines.push(`Email: ${asTrimmedString(payload.email)}`);
    lines.push(`Téléphone / Phone: ${asTrimmedString(payload.phone)}`);

    const serviceKey = asTrimmedString(payload.serviceType);
    const frequencyKey = asTrimmedString(payload.frequency);
    const service = labelFrEn(SERVICE_TYPE_LABELS, serviceKey);
    const frequency = labelFrEn(FREQUENCY_LABELS, frequencyKey);

    lines.push(`Service: ${service.fr} / ${service.en}`);
    lines.push(`Fréquence / Frequency: ${frequency.fr} / ${frequency.en}`);
    lines.push(`Pays: ${countryDisplay}`);
    lines.push(`Ville: ${asTrimmedString(payload.city)}`);
    lines.push(`Code postal: ${asTrimmedString(payload.postalCode)}`);

    const quoteBlock = buildCalculatorQuoteBlock(payload);
    if (quoteBlock.length) {
        lines.push(...quoteBlock);
    }

    const message = sanitizeMessage(payload.message);
    if (message) {
        lines.push('');
        lines.push('Message / Détails:');
        lines.push(message);
    }

    lines.push('');
    lines.push('---');
    lines.push('G.D.F Pro-Cleaners');
    lines.push('gdfprocleaners@gmail.com');

    return lines.join('\n');
}

module.exports = async function handler(req, res) {
    if (req.method === 'GET') {
        const gmailUser = getEnv('GDF_GMAIL_USER', 'GMAIL_USER');
        const gmailAppPassword = getEnv('GDF_GMAIL_APP_PASSWORD', 'GMAIL_APP_PASSWORD');

        return res.status(200).json({
            ok: true,
            service: 'contact-email',
            configured: Boolean(gmailUser && gmailAppPassword),
            hasUser: Boolean(gmailUser),
            hasAppPassword: Boolean(gmailAppPassword)
        });
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'GET, POST');
        return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const payload = parseBody(req);

    const errors = validatePayload(payload);
    if (errors.length) {
        return res.status(400).json({ ok: false, error: 'Validation error', details: errors });
    }

    const gmailUser = getEnv('GDF_GMAIL_USER', 'GMAIL_USER');
    const gmailAppPassword = getEnv('GDF_GMAIL_APP_PASSWORD', 'GMAIL_APP_PASSWORD');

    if (!gmailUser || !gmailAppPassword) {
        return res.status(500).json({
            ok: false,
            error: 'Missing email configuration',
            details: ['Set GDF_GMAIL_USER and GDF_GMAIL_APP_PASSWORD (or GMAIL_USER / GMAIL_APP_PASSWORD)']
        });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailAppPassword
        }
    });

    const customerEmail = asTrimmedString(payload.email);
    const customerName = asTrimmedString(payload.fullName);

    const customerSubject = 'Accusé de réception / Receipt confirmation - G.D.F Pro-Cleaners';

    const internalService = labelFrEn(SERVICE_TYPE_LABELS, asTrimmedString(payload.serviceType));
    const internalSubject = `Nouvelle demande / New request - ${customerName || 'Client'} - ${internalService.fr} / ${internalService.en}`;

    try {
        await transporter.sendMail({
            from: `G.D.F Pro-Cleaners <${gmailUser}>`,
            to: customerEmail,
            replyTo: gmailUser,
            subject: customerSubject,
            text: buildCustomerEmailText(payload)
        });

        await transporter.sendMail({
            from: `G.D.F Pro-Cleaners <${gmailUser}>`,
            to: gmailUser,
            replyTo: customerEmail,
            subject: internalSubject,
            text: buildInternalEmailText(payload)
        });

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Email send error:', err);

        const errorMessage = typeof err?.message === 'string' ? err.message.replace(/\s+/g, ' ').trim() : '';
        const safeMessage = errorMessage ? errorMessage.slice(0, 220) : '';

        return res.status(502).json({
            ok: false,
            error: 'Email send failed',
            details: {
                code: err?.code || null,
                responseCode: err?.responseCode || null,
                message: safeMessage || null
            }
        });
    }
};
