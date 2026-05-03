/**
 * ================================================================
 * CALCULATEUR DE DEVIS - G.D.F Pro-Cleaners
 * ================================================================
 */

// Prix basés sur le fichier Excel
const PRICING = {
    // Prix de base pour chaque service (inclut toute la maison SAUF chambres, salles de bain, basement)
    basePrice: {
        deep: 250,        // Deep cleaning: 250$ de base
        moving: 300,      // Moving/Out: 300$ de base
        airbnb: 100,      // AirBNB: 100$ de base
        regular: 120      // Regular: 120$ de base
    },
    // Prix additionnels par pièce (chambres, salles de bain, basement seulement)
    bedrooms: {
        deep: 20,
        moving: 25,
        airbnb: 10,
        regular: 15
    },
    bathrooms: {
        deep: 25,
        moving: 30,
        airbnb: 15,
        regular: 20
    },
    basement: {
        deep: 30,
        moving: 35,
        airbnb: 20,
        regular: 25
    },
    // Prix pour les tapis (en $/pi²)
    carpet: {
        deep: 0.25,       // 0.25$ par pi²
        moving: 0.25,     // 0.25$ par pi²
        airbnb: 0.20,     // 0.20$ par pi²
        regular: 0.20     // 0.20$ par pi²
    },
    // Prestations ajustables (Deep cleaning seulement)
    deepAddons: {
        'deep-addon-fridge': 40,
        'deep-addon-stove': 45,
        'deep-addon-microwave': 20,
        'deep-addon-windows': 120,
        'deep-addon-living': 80,
        'deep-addon-garage': 100,
        'deep-addon-closets': 75,
        'deep-addon-drawers': 20,
        'deep-addon-toilets': 150
    }
};

const DEEP_ADDON_ITEMS = [
    { id: 'deep-addon-fridge', labelKey: 'calc.deepQuote.item.fridge', qtyElId: 'deep-quote-fridge-qty', amountElId: 'deep-quote-fridge-amount' },
    { id: 'deep-addon-stove', labelKey: 'calc.deepQuote.item.stove', qtyElId: 'deep-quote-stove-qty', amountElId: 'deep-quote-stove-amount' },
    { id: 'deep-addon-microwave', labelKey: 'calc.deepQuote.item.microwave', qtyElId: 'deep-quote-microwave-qty', amountElId: 'deep-quote-microwave-amount' },
    { id: 'deep-addon-windows', labelKey: 'calc.deepQuote.item.windows', qtyElId: 'deep-quote-windows-qty', amountElId: 'deep-quote-windows-amount' },
    { id: 'deep-addon-living', labelKey: 'calc.deepQuote.item.living', qtyElId: 'deep-quote-living-qty', amountElId: 'deep-quote-living-amount' },
    { id: 'deep-addon-garage', labelKey: 'calc.deepQuote.item.garage', qtyElId: 'deep-quote-garage-qty', amountElId: 'deep-quote-garage-amount' },
    { id: 'deep-addon-closets', labelKey: 'calc.deepQuote.item.closets', qtyElId: 'deep-quote-closets-qty', amountElId: 'deep-quote-closets-amount' },
    { id: 'deep-addon-drawers', labelKey: 'calc.deepQuote.item.drawers', qtyElId: 'deep-quote-drawers-qty', amountElId: 'deep-quote-drawers-amount' },
    { id: 'deep-addon-toilets', labelKey: 'calc.deepQuote.item.toilets', qtyElId: 'deep-quote-toilets-qty', amountElId: 'deep-quote-toilets-amount' }
];

// Temps estimés (en heures) - basés sur le fichier Excel
const TIME_ESTIMATES = {
    deep: 6,
    moving: 6,
    airbnb: 3,
    regular: 4
};

// Temps additionnel par pièce (en minutes)
const TIME_PER_ROOM = {
    bedroom: 30,      // 30 minutes par chambre
    bathroom: 20,     // 20 minutes par salle de bain
    basement: 45      // 45 minutes pour le sous-sol
};

// État global
let state = {
    'carpet-sqft-carpet': 0,
    bedrooms: 0,
    bathrooms: 0,
    basement: 0,
    'deep-addon-fridge': 0,
    'deep-addon-stove': 0,
    'deep-addon-microwave': 0,
    'deep-addon-windows': 0,
    'deep-addon-living': 0,
    'deep-addon-garage': 0,
    'deep-addon-closets': 0,
    'deep-addon-drawers': 0,
    'deep-addon-toilets': 0,
    'airbnb-bedrooms': 0,
    'airbnb-bathrooms': 0,
    'airbnb-basement': 0,
    'airbnb-carpet-sqft': 0,
    'carpet-sqft': 0,
    'square-feet': 0,
    frequency: 'one-time',
    service: 'deep'
};

// Initialisation
document.addEventListener('DOMContentLoaded', function () {
    // Charger la langue en premier
    initializeLanguageSwitcher();
    // Puis initialiser le reste
    initializeCalculator();
    showFieldsForService('deep'); // Afficher les champs résidentiels par défaut
    updateCalculation();
});

function showFieldsForService(service) {
    // Cacher tous les groupes de champs
    document.querySelectorAll('.service-fields').forEach(group => {
        group.style.display = 'none';
    });

    // Réinitialiser tous les champs à 0
    document.querySelectorAll('.service-fields input[type="number"]').forEach(input => {
        input.value = 0;
    });

    // Réinitialiser l'état pour tous les champs
    state.bedrooms = 0;
    state.bathrooms = 0;
    state.basement = 0;
    state['airbnb-bedrooms'] = 0;
    state['airbnb-bathrooms'] = 0;
    state['carpet-sqft'] = 0;
    state['square-feet'] = 0;

    // Réinitialiser les prestations ajustables (deep)
    DEEP_ADDON_ITEMS.forEach(item => {
        state[item.id] = 0;
    });

    // Afficher le groupe approprié
    if (service === 'deep' || service === 'moving' || service === 'regular') {
        document.getElementById('residential-fields').style.display = 'block';
    } else if (service === 'airbnb') {
        document.getElementById('airbnb-fields').style.display = 'block';
    } else if (service === 'carpet') {
        document.getElementById('carpet-fields').style.display = 'block';
    } else if (service === 'commercial') {
        document.getElementById('commercial-fields').style.display = 'block';
    }

    updateDeepAddonsVisibility();
}

function updateDeepAddonsVisibility() {
    const block = document.getElementById('deep-addons');
    if (!block) return;

    const shouldShow = state.service === 'deep';
    block.style.display = shouldShow ? 'block' : 'none';
}

function getDeepAddonsTotal() {
    if (state.service !== 'deep') return 0;

    return DEEP_ADDON_ITEMS.reduce((sum, item) => {
        const qty = state[item.id] || 0;
        const unit = PRICING.deepAddons[item.id] || 0;
        return sum + (qty * unit);
    }, 0);
}

function initializeCalculator() {
    console.log('Initializing calculator...');

    // Boutons +/-
    const buttons = document.querySelectorAll('.plus, .minus');
    console.log('Found buttons:', buttons.length);

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.dataset.target;
            const input = document.getElementById(target);

            if (!input) {
                console.error('Input not found for target:', target);
                return;
            }

            const currentValue = parseFloat(input.value) || 0;
            const max = parseFloat(input.max) || Infinity;
            const min = parseFloat(input.min) || 0;
            const step = parseFloat(this.dataset.step) || 1;

            console.log('Button clicked:', this.classList.contains('plus') ? 'plus' : 'minus', 'target:', target, 'current:', currentValue);

            if (this.classList.contains('plus') && currentValue < max) {
                const newValue = Math.round((currentValue + step) * 10) / 10; // Round to 1 decimal
                input.value = newValue;
                state[target] = newValue;
                console.log('Updated state[' + target + '] to', state[target]);
            } else if (this.classList.contains('minus') && currentValue > min) {
                const newValue = Math.round((currentValue - step) * 10) / 10; // Round to 1 decimal
                input.value = newValue;
                state[target] = newValue;
                console.log('Updated state[' + target + '] to', state[target]);
            }

            updateCalculation();
        });
    });

    // Écouter les changements manuels dans tous les champs input number
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function () {
            const value = parseFloat(this.value) || 0;
            state[this.id] = value;
            updateCalculation();
        });
    });

    // Select fréquence commerciale
    const frequencySelect = document.getElementById('frequency');
    if (frequencySelect) {
        frequencySelect.addEventListener('change', function () {
            state.frequency = this.value;
            updateCalculation();
        });
    }

    // Boutons radio des services
    document.querySelectorAll('input[name="service"]').forEach(radio => {
        radio.addEventListener('change', function () {
            state.service = this.value;
            showFieldsForService(this.value);
            updateCalculation();
        });
    });

    // Bouton Continuer
    document.getElementById('continue-btn').addEventListener('click', function () {
        const { price, time } = calculateTotal();

        // Préparer les données selon le type de service
        let params = new URLSearchParams({
            service: state.service,
            price: price,
            time: time
        });

        if (state.service === 'deep' || state.service === 'moving' || state.service === 'regular') {
            params.append('bedrooms', state.bedrooms);
            params.append('bathrooms', state.bathrooms);
            params.append('kitchen', state.kitchen);
            params.append('basement', state.basement);
        } else if (state.service === 'airbnb') {
            params.append('bedrooms', state['airbnb-bedrooms']);
            params.append('bathrooms', state['airbnb-bathrooms']);
            params.append('kitchen', state['airbnb-kitchen']);
        } else if (state.service === 'carpet') {
            params.append('rooms', state['carpet-rooms']);
            params.append('basement', state['carpet-basement']);
        } else if (state.service === 'commercial') {
            params.append('sqft', state['square-feet']);
            params.append('frequency', state.frequency);
        }

        window.location.href = `index.html?quote=true&${params.toString()}#contact`;
    });

    // Bouton Reset
    document.getElementById('reset-btn').addEventListener('click', function () {
        // Réinitialiser tout l'état
        state = {
            bedrooms: 0,
            bathrooms: 0,
            kitchen: 0,
            basement: 0,
            'deep-addon-fridge': 0,
            'deep-addon-stove': 0,
            'deep-addon-microwave': 0,
            'deep-addon-windows': 0,
            'deep-addon-living': 0,
            'deep-addon-garage': 0,
            'deep-addon-closets': 0,
            'deep-addon-drawers': 0,
            'deep-addon-toilets': 0,
            'airbnb-bedrooms': 0,
            'airbnb-bathrooms': 0,
            'airbnb-kitchen': 0,
            'carpet-rooms': 0,
            'carpet-basement': 0,
            'square-feet': 0,
            frequency: 'one-time',
            service: 'deep'
        };

        // Réinitialiser tous les champs visibles
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = 0;
        });

        if (document.getElementById('frequency')) {
            document.getElementById('frequency').value = 'one-time';
        }

        document.querySelector('input[value="deep"]').checked = true;
        showFieldsForService('deep');
        updateCalculation();
    });
}

function calculateTotal() {
    const service = state.service;
    let totalPrice = 0;
    let totalTime = 0;

    if (service === 'deep' || service === 'moving' || service === 'regular') {
        // Services résidentiels - Prix de base TOUJOURS affiché (inclut la maison sauf chambres, salles de bain, basement)
        totalPrice = PRICING.basePrice[service];
        totalTime = TIME_ESTIMATES[service];

        // Ajouter les coûts additionnels seulement pour chambres, salles de bain et basement
        totalPrice += state.bedrooms * PRICING.bedrooms[service];
        totalPrice += state.bathrooms * PRICING.bathrooms[service];
        totalPrice += state.basement * PRICING.basement[service];

        // Temps additionnel par pièce
        let additionalTime = 0;
        additionalTime += state.bedrooms * TIME_PER_ROOM.bedroom;
        additionalTime += state.bathrooms * TIME_PER_ROOM.bathroom;
        if (state.basement > 0) additionalTime += TIME_PER_ROOM.basement;

        totalTime += (additionalTime / 60); // Convertir minutes en heures

        // Ajouter le coût des tapis si applicable
        if (state['carpet-sqft'] > 0) {
            totalPrice += state['carpet-sqft'] * PRICING.carpet[service];
        }

        // Ajouter les prestations ajustables (Deep cleaning seulement)
        if (service === 'deep') {
            totalPrice += getDeepAddonsTotal();
        }

    } else if (service === 'airbnb') {
        // AirBNB - Prix de base TOUJOURS affiché
        totalPrice = PRICING.basePrice.airbnb;
        totalTime = TIME_ESTIMATES.airbnb;

        // Ajouter les coûts additionnels
        totalPrice += (state['airbnb-bedrooms'] || 0) * PRICING.bedrooms.airbnb;
        totalPrice += (state['airbnb-bathrooms'] || 0) * PRICING.bathrooms.airbnb;
        totalPrice += (state['airbnb-basement'] || 0) * PRICING.basement.airbnb;

        // Temps additionnel
        let additionalTime = 0;
        additionalTime += (state['airbnb-bedrooms'] || 0) * TIME_PER_ROOM.bedroom;
        additionalTime += (state['airbnb-bathrooms'] || 0) * TIME_PER_ROOM.bathroom;
        if ((state['airbnb-basement'] || 0) > 0) additionalTime += TIME_PER_ROOM.basement;

        totalTime += (additionalTime / 60);

        // Ajouter le coût des tapis si applicable
        if ((state['airbnb-carpet-sqft'] || 0) > 0) {
            totalPrice += (state['airbnb-carpet-sqft'] || 0) * PRICING.carpet.airbnb;
        }

    } else if (service === 'carpet') {
        // Nettoyage de tapis SEULEMENT - basé sur pieds carrés
        const carpetSqft = state['carpet-sqft-carpet'] || 0;
        if (carpetSqft === 0) {
            totalPrice = 0;
            totalTime = 0;
        } else {
            // Utiliser le prix de deep cleaning comme base pour tapis seul
            totalPrice = carpetSqft * 0.25;
            totalTime = 2 + (carpetSqft / 200) * 0.5; // Temps basé sur superficie
        }

    } else if (service === 'commercial') {
        // Commercial - basé sur pieds carrés
        const sqft = state['square-feet'];
        if (sqft === 0) {
            totalPrice = 0;
            totalTime = 0;
        } else {
            // Tarification par palier
            if (sqft <= 1000) {
                totalPrice = sqft * 0.15;
                totalTime = 2;
            } else if (sqft <= 5000) {
                totalPrice = sqft * 0.12;
                totalTime = 4 + ((sqft - 1000) / 1000) * 0.75;
            } else {
                totalPrice = sqft * 0.10;
                totalTime = 7 + ((sqft - 5000) / 1000) * 0.5;
            }

            // Multiplicateur de fréquence
            const frequencyMultipliers = {
                'one-time': 1.0,
                'weekly': 0.8,
                'biweekly': 0.85,
                'monthly': 0.9
            };
            totalPrice *= frequencyMultipliers[state.frequency] || 1.0;
        }
    }

    return {
        price: Math.round(totalPrice),
        time: Math.round(totalTime * 10) / 10
    };
}

function updateCalculation() {
    console.log('updateCalculation called, state:', state);
    const { price, time } = calculateTotal();
    console.log('Calculated price:', price, 'time:', time);
    const service = state.service;

    // Construire le résumé des pièces selon le type de service
    let summaryHTML = '';
    const currentLang = localStorage.getItem('preferredLanguage') || 'fr';

    if (service === 'deep' || service === 'moving' || service === 'regular') {
        summaryHTML = `
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Prix de base (transport et matériel inclus)' : 'Base Price (transport and equipment included)'}:</span>
                <span>$${PRICING.basePrice[service]}</span>
            </div>
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Chambres' : 'Bedrooms'}:</span>
                <span>${state.bedrooms}</span>
            </div>
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Salles de bain' : 'Bathrooms'}:</span>
                <span>${state.bathrooms}</span>
            </div>
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Sous-sol' : 'Basement'}:</span>
                <span>${state.basement}</span>
            </div>
        `;

        if (service === 'deep') {
            DEEP_ADDON_ITEMS.forEach(item => {
                const qty = state[item.id] || 0;
                if (!qty) return;

                const unit = PRICING.deepAddons[item.id] || 0;
                const lineTotal = qty * unit;
                const label = (translations && translations[currentLang] && translations[currentLang][item.labelKey])
                    ? translations[currentLang][item.labelKey]
                    : item.id;

                summaryHTML += `
                    <div class="detail-row">
                        <span>${label} × ${qty}</span>
                        <span>$${lineTotal}</span>
                    </div>
                `;
            });
        }

        if (state['carpet-sqft'] > 0) {
            summaryHTML += `
                <div class="detail-row">
                    <span>${currentLang === 'fr' ? 'Tapis' : 'Carpet'}:</span>
                    <span>${state['carpet-sqft']} pi²</span>
                </div>
            `;
        }
    } else if (service === 'airbnb') {
        summaryHTML = `
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Prix de base (transport et matériel inclus)' : 'Base Price (transport and equipment included)'}:</span>
                <span>$${PRICING.basePrice.airbnb}</span>
            </div>
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Chambres' : 'Bedrooms'}:</span>
                <span>${state['airbnb-bedrooms']}</span>
            </div>
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Salles de bain' : 'Bathrooms'}:</span>
                <span>${state['airbnb-bathrooms']}</span>
            </div>
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Sous-sol' : 'Basement'}:</span>
                <span>${state['airbnb-basement'] || 0}</span>
            </div>
        `;

        if ((state['airbnb-carpet-sqft'] || 0) > 0) {
            summaryHTML += `
                <div class="detail-row">
                    <span>${currentLang === 'fr' ? 'Tapis' : 'Carpet'}:</span>
                    <span>${state['airbnb-carpet-sqft']} pi²</span>
                </div>
            `;
        }
    } else if (service === 'carpet') {
        summaryHTML = `
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Tapis (pieds carrés)' : 'Carpet (sq ft)'}:</span>
                <span>${state['carpet-sqft-carpet'] || 0} pi²</span>
            </div>
        `;
    } else if (service === 'commercial') {
        const freqNames = {
            'one-time': { fr: 'Ponctuel', en: 'One-time' },
            'weekly': { fr: 'Hebdomadaire', en: 'Weekly' },
            'biweekly': { fr: '2x/semaine', en: 'Biweekly' },
            'monthly': { fr: 'Mensuel', en: 'Monthly' }
        };
        summaryHTML = `
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Superficie' : 'Square Feet'}:</span>
                <span>${state['square-feet']} pi²</span>
            </div>
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Fréquence' : 'Frequency'}:</span>
                <span>${freqNames[state.frequency][currentLang]}</span>
            </div>
        `;
    }

    document.getElementById('summary-rooms').innerHTML = summaryHTML;

    // Mise à jour du type de service
    const serviceName = getServiceName(state.service);
    document.getElementById('summary-service').textContent = serviceName;

    // Mise à jour du temps
    const timeText = formatTime(time);
    document.getElementById('total-time').textContent = timeText;

    // Mise à jour du prix
    document.getElementById('total-price').textContent = `$${price} CAD`;

    // Animation du changement de prix
    document.getElementById('total-price').style.transform = 'scale(1.1)';
    setTimeout(() => {
        document.getElementById('total-price').style.transform = 'scale(1)';
    }, 200);

    updateDeepQuoteVisibility();
    updateDeepQuoteValues(price);
    updateDeepQuoteAddons();
}

function updateDeepQuoteAddons() {
    const details = document.getElementById('deep-quote-details');
    if (!details) return;

    DEEP_ADDON_ITEMS.forEach(item => {
        const row = details.querySelector(`.deep-quote-item[data-addon-target="${item.id}"]`);
        if (!row) return;

        const qty = state.service === 'deep' ? (state[item.id] || 0) : 0;
        const unit = PRICING.deepAddons[item.id] || 0;
        const lineTotal = qty * unit;

        row.style.display = qty > 0 ? 'flex' : 'none';

        const qtyEl = document.getElementById(item.qtyElId);
        if (qtyEl) qtyEl.textContent = `×${qty}`;

        const amountEl = document.getElementById(item.amountElId);
        if (amountEl) amountEl.textContent = `${lineTotal} $`;
    });
}

function updateDeepQuoteVisibility() {
    const details = document.getElementById('deep-quote-details');
    if (!details) return;

    const shouldShow = state.service === 'deep';
    details.style.display = shouldShow ? 'block' : 'none';
    if (!shouldShow) details.open = false;
}

function updateDeepQuoteValues(price) {
    const totalEl = document.getElementById('deep-quote-total');
    if (!totalEl) return;

    if (state.service !== 'deep') {
        totalEl.textContent = '$0 CAD';
        return;
    }

    totalEl.textContent = `$${price} CAD`;
}

function getServiceName(serviceCode) {
    const currentLang = localStorage.getItem('preferredLanguage') || 'fr';
    const names = {
        deep: { fr: 'Nettoyage en Profondeur', en: 'Deep Cleaning' },
        moving: { fr: 'Nettoyage Déménagement', en: 'Moving/Out Cleaning' },
        airbnb: { fr: 'Nettoyage AirBNB', en: 'AirBNB Cleaning' },
        regular: { fr: 'Nettoyage Régulier', en: 'Regular Cleaning' },
        carpet: { fr: 'Nettoyage de Tapis', en: 'Carpet Cleaning' },
        commercial: { fr: 'Commercial', en: 'Commercial' }
    };
    return names[serviceCode][currentLang];
}

function formatTime(hours) {
    const currentLang = localStorage.getItem('preferredLanguage') || 'fr';

    // Si 0 heures, afficher "0 heures/hours"
    if (hours === 0) {
        return currentLang === 'fr' ? '0 heure' : '0 hours';
    }

    if (hours === 1) {
        return currentLang === 'fr' ? '1 heure' : '1 hour';
    }
    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return currentLang === 'fr' ? `${minutes} minutes` : `${minutes} minutes`;
    }
    if (hours % 1 === 0) {
        return currentLang === 'fr' ? `${hours} heures` : `${hours} hours`;
    }
    const fullHours = Math.floor(hours);
    const minutes = Math.round((hours % 1) * 60);
    if (currentLang === 'fr') {
        return `${fullHours}h ${minutes}min`;
    }
    return `${fullHours}h ${minutes}min`;
}

function initializeLanguageSwitcher() {
    const currentLang = localStorage.getItem('preferredLanguage') || 'fr';

    // Mettre à jour les boutons de langue
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
    });

    // Appliquer la langue
    changeLanguage(currentLang);

    // Événements de clic
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const lang = this.dataset.lang;
            // Sauvegarder AVANT de changer la langue
            localStorage.setItem('preferredLanguage', lang);

            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Appliquer la langue après avoir sauvegardé
            changeLanguage(lang);
        });
    });
}

function changeLanguage(lang) {
    if (!translations || !translations[lang]) return;

    // Mettre à jour l'attribut lang du document
    document.documentElement.lang = lang;

    // Traduire tous les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            // Pour les options de select
            if (element.tagName === 'OPTION') {
                element.textContent = translations[lang][key];
            }
            // Pour les inputs et textareas
            else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.placeholder !== undefined) {
                    element.placeholder = translations[lang][key];
                }
            }
            // Pour tous les autres éléments
            else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Mettre à jour le titre de la page
    if (lang === 'fr') {
        document.title = 'Calculateur de Devis - G.D.F Pro-Cleaners';
    } else {
        document.title = 'Quote Calculator - G.D.F Pro-Cleaners';
    }

    // Mettre à jour le résumé et le nom du service
    updateCalculation();
}

// Ajouter les traductions pour le calculateur
if (typeof translations !== 'undefined') {
    // Français
    translations.fr['calc.selectRooms'] = 'Sélectionnez vos pièces';
    translations.fr['calc.bedrooms'] = 'Chambres';
    translations.fr['calc.bathrooms'] = 'Salles de bain';
    translations.fr['calc.kitchen'] = 'Cuisine';
    translations.fr['calc.basement'] = 'Sous-sol';
    translations.fr['calc.selectService'] = 'Choisissez le service';
    translations.fr['calc.deepCleaning'] = 'Deep Cleaning';
    translations.fr['calc.movingCleaning'] = 'Moving/Out Cleaning';
    translations.fr['calc.airbnbCleaning'] = 'AirBNB Cleaning';
    translations.fr['calc.regularCleaning'] = 'Regular Cleaning';
    translations.fr['calc.carpetCleaning'] = 'Carpet Cleaning';
    translations.fr['calc.estimate'] = 'Estimation';
    translations.fr['calc.serviceType'] = 'Type de service';
    translations.fr['calc.estimatedTime'] = 'Temps estimé';
    translations.fr['calc.estimatedPrice'] = 'Prix estimé avant taxes';
    translations.fr['calc.disclaimer'] = 'Prix et durée approximatifs. Une évaluation précise sera fournie après inspection.';
    translations.fr['calc.continueBtn'] = 'Continuer avec G.D.F Pro-Cleaners →';
    translations.fr['calc.reset'] = 'Réinitialiser';

    // Devis détaillé (Deep Cleaning)
    translations.fr['calc.deepQuote.summary'] = 'Devis détaillé (nettoyage en profondeur)';
    translations.fr['calc.deepQuote.title'] = 'DEVIS – NETTOYAGE EN PROFONDEUR';
    translations.fr['calc.deepQuote.client'] = 'Client';
    translations.fr['calc.deepQuote.address'] = 'Adresse';
    translations.fr['calc.deepQuote.date'] = 'Date';
    translations.fr['calc.deepQuote.services'] = 'Détail des prestations';
    translations.fr['calc.deepQuote.item.fridge'] = 'Réfrigérateur (nettoyage en profondeur)';
    translations.fr['calc.deepQuote.item.stove'] = 'Cuisinière (nettoyage en profondeur)';
    translations.fr['calc.deepQuote.item.microwave'] = 'Micro-ondes (nettoyage en profondeur)';
    translations.fr['calc.deepQuote.item.windows'] = 'Fenêtres – intérieur (indicatif)';
    translations.fr['calc.deepQuote.item.living'] = 'Salon (nettoyage en profondeur)';
    translations.fr['calc.deepQuote.item.garage'] = 'Garage (nettoyage en profondeur)';
    translations.fr['calc.deepQuote.item.closets'] = 'Garde-robes (nettoyage en profondeur)';
    translations.fr['calc.deepQuote.item.drawers'] = 'Tiroirs (nettoyage)';
    translations.fr['calc.deepQuote.item.toilets'] = 'Toilettes (nettoyage complet intérieur/extérieur)';
    translations.fr['calc.deepQuote.total'] = 'Total estimé';
    translations.fr['calc.deepQuote.conditions'] = 'Conditions';
    translations.fr['calc.deepQuote.conditionsValue'] = 'Produits de nettoyage inclus';
    translations.fr['calc.deepQuote.windowRates'] = 'Tarifs vitres (indicatif)';
    translations.fr['calc.deepQuote.windowRatesValue'] = 'petite fenêtre 10 $, double fenêtre 15 $, porte vitrée 20 $';
    translations.fr['calc.deepQuote.duration'] = 'Durée estimée';
    translations.fr['calc.deepQuote.durationValue'] = '6 à 8 heures (selon l’état)';
    translations.fr['calc.deepQuote.payment'] = 'Paiement';
    translations.fr['calc.deepQuote.paymentValue'] = 'comptant, virement ou transfert';
    translations.fr['calc.deepQuote.signature'] = 'Signature';
    translations.fr['calc.deepQuote.adviceTitle'] = 'Notes sur la tarification';
    translations.fr['calc.deepQuote.adviceLine1'] = 'Les montants peuvent varier selon l’état des lieux. En cas d’encrassement important, un ajustement à la hausse peut s’appliquer (jusqu’à 750–800 $).';
    translations.fr['calc.deepQuote.adviceLine2'] = 'Pour un client régulier, un tarif préférentiel peut être proposé (environ 550–600 $).';

    translations.fr['calc.deepAddons.title'] = 'Détail des prestations';
    translations.fr['calc.deepAddons.note'] = 'Ajustez les quantités ci-dessous. L\'estimation se met à jour automatiquement.';
    translations.fr['calc.deepAddons.pricingTitle'] = 'Prestations ajustables (prix unitaire)';

    // Anglais
    translations.en['calc.selectRooms'] = 'Select Your Rooms';
    translations.en['calc.bedrooms'] = 'Bedrooms';
    translations.en['calc.bathrooms'] = 'Bathrooms';
    translations.en['calc.kitchen'] = 'Kitchen';
    translations.en['calc.basement'] = 'Basement';
    translations.en['calc.selectService'] = 'Choose Service';
    translations.en['calc.deepCleaning'] = 'Deep Cleaning';
    translations.en['calc.movingCleaning'] = 'Moving/Out Cleaning';
    translations.en['calc.airbnbCleaning'] = 'AirBNB Cleaning';
    translations.en['calc.regularCleaning'] = 'Regular Cleaning';
    translations.en['calc.carpetCleaning'] = 'Carpet Cleaning';
    translations.en['calc.estimate'] = 'Estimate';
    translations.en['calc.serviceType'] = 'Service Type';
    translations.en['calc.estimatedTime'] = 'Estimated Time';
    translations.en['calc.estimatedPrice'] = 'Estimated Price before taxes';
    translations.en['calc.disclaimer'] = 'Approximate pricing and duration. Accurate quote will be provided after inspection.';
    translations.en['calc.continueBtn'] = 'Continue with G.D.F Pro-Cleaners →';
    translations.en['calc.reset'] = 'Reset';

    // Detailed quote (Deep Cleaning)
    translations.en['calc.deepQuote.summary'] = 'Detailed quote (deep cleaning)';
    translations.en['calc.deepQuote.title'] = 'QUOTE – DEEP CLEANING';
    translations.en['calc.deepQuote.client'] = 'Client';
    translations.en['calc.deepQuote.address'] = 'Address';
    translations.en['calc.deepQuote.date'] = 'Date';
    translations.en['calc.deepQuote.services'] = 'Service breakdown';
    translations.en['calc.deepQuote.item.fridge'] = 'Refrigerator (deep clean)';
    translations.en['calc.deepQuote.item.stove'] = 'Stove (deep clean)';
    translations.en['calc.deepQuote.item.microwave'] = 'Microwave (deep clean)';
    translations.en['calc.deepQuote.item.windows'] = 'Windows – interior (guide)';
    translations.en['calc.deepQuote.item.living'] = 'Living room (deep clean)';
    translations.en['calc.deepQuote.item.garage'] = 'Garage (deep clean)';
    translations.en['calc.deepQuote.item.closets'] = 'Closets (deep clean)';
    translations.en['calc.deepQuote.item.drawers'] = 'Drawers (cleaning)';
    translations.en['calc.deepQuote.item.toilets'] = 'Toilets (full clean inside/outside)';
    translations.en['calc.deepQuote.total'] = 'Estimated total';
    translations.en['calc.deepQuote.conditions'] = 'Conditions';
    translations.en['calc.deepQuote.conditionsValue'] = 'Cleaning products included';
    translations.en['calc.deepQuote.windowRates'] = 'Glass rates (guide)';
    translations.en['calc.deepQuote.windowRatesValue'] = 'small window $10, double window $15, glass door $20';
    translations.en['calc.deepQuote.duration'] = 'Estimated duration';
    translations.en['calc.deepQuote.durationValue'] = '6 to 8 hours (depending on condition)';
    translations.en['calc.deepQuote.payment'] = 'Payment';
    translations.en['calc.deepQuote.paymentValue'] = 'cash, e-transfer, or bank transfer';
    translations.en['calc.deepQuote.signature'] = 'Signature';
    translations.en['calc.deepQuote.adviceTitle'] = 'Pricing notes';
    translations.en['calc.deepQuote.adviceLine1'] = 'Amounts may vary depending on the condition of the property. In case of heavy soiling, an upward adjustment may apply (up to $750–$800).';
    translations.en['calc.deepQuote.adviceLine2'] = 'For recurring clients, a preferred rate may be offered (approximately $550–$600).';

    translations.en['calc.deepAddons.title'] = 'Service details';
    translations.en['calc.deepAddons.note'] = 'Adjust quantities below. The estimate updates automatically.';
    translations.en['calc.deepAddons.pricingTitle'] = 'Adjustable services (unit price)';
}
