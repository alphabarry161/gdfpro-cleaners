/**
 * Script d'aide pour ajouter automatiquement les attributs data-i18n au HTML
 * À exécuter dans la console du navigateur sur la page
 */

// Fonction pour ajouter data-i18n à un élément
function addI18n() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach((link, i) => {
        const keys = ['nav.home', 'nav.about', 'nav.services', 'nav.process', 'nav.contact'];
        if (i < keys.length) link.setAttribute('data-i18n', keys[i]);
    });

    document.querySelector('.nav-cta')?.setAttribute('data-i18n', 'nav.cta');

    // Hero section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const spans = heroTitle.querySelectorAll('span');
        if (spans[0]) spans[0].setAttribute('data-i18n', 'hero.title.part1');
        if (spans[1]) spans[1].setAttribute('data-i18n', 'hero.title.part2');
    }

    document.querySelector('.hero-subtitle')?.setAttribute('data-i18n', 'hero.subtitle');

    const heroButtons = document.querySelectorAll('.hero-buttons a');
    if (heroButtons[0]) heroButtons[0].setAttribute('data-i18n', 'hero.btn.primary');
    if (heroButtons[1]) heroButtons[1].setAttribute('data-i18n', 'hero.btn.secondary');

    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, i) => {
        const number = stat.querySelector('.stat-number');
        const label = stat.querySelector('.stat-label');
        if (number) number.setAttribute('data-i18n', `hero.stat${i + 1}.number`);
        if (label) label.setAttribute('data-i18n', `hero.stat${i + 1}.label`);
    });

    // About section
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        aboutSection.querySelector('.section-label')?.setAttribute('data-i18n', 'about.label');
        aboutSection.querySelector('.section-title')?.setAttribute('data-i18n', 'about.title');
        aboutSection.querySelector('.section-description')?.setAttribute('data-i18n', 'about.description');
        aboutSection.querySelector('.about-intro')?.setAttribute('data-i18n', 'about.intro');

        const features = aboutSection.querySelectorAll('.feature-item');
        features.forEach((feature, i) => {
            const h3 = feature.querySelector('h3');
            const p = feature.querySelector('p');
            if (h3) h3.setAttribute('data-i18n', `about.feature${i + 1}.title`);
            if (p) p.setAttribute('data-i18n', `about.feature${i + 1}.desc`);
        });

        aboutSection.querySelector('.placeholder-content p')?.setAttribute('data-i18n', 'about.image.placeholder');
    }

    // Services section
    const servicesSection = document.querySelector('#services');
    if (servicesSection) {
        servicesSection.querySelector('.section-label')?.setAttribute('data-i18n', 'services.label');
        servicesSection.querySelector('.section-title')?.setAttribute('data-i18n', 'services.title');
        servicesSection.querySelector('.section-description')?.setAttribute('data-i18n', 'services.description');

        servicesSection.querySelector('.service-badge')?.setAttribute('data-i18n', 'services.badge.popular');

        const serviceCards = servicesSection.querySelectorAll('.service-card');
        serviceCards.forEach((card, i) => {
            card.querySelector('.service-title')?.setAttribute('data-i18n', `service${i + 1}.title`);
            card.querySelector('.service-description')?.setAttribute('data-i18n', `service${i + 1}.desc`);
            card.querySelector('.service-link')?.setAttribute('data-i18n', 'services.link');

            const items = card.querySelectorAll('.service-list li');
            items.forEach((item, j) => {
                item.setAttribute('data-i18n', `service${i + 1}.item${j + 1}`);
            });
        });
    }

    // Process section
    const processSection = document.querySelector('#process');
    if (processSection) {
        processSection.querySelector('.section-label')?.setAttribute('data-i18n', 'process.label');
        processSection.querySelector('.section-title')?.setAttribute('data-i18n', 'process.title');
        processSection.querySelector('.section-description')?.setAttribute('data-i18n', 'process.description');

        const steps = processSection.querySelectorAll('.step-item');
        steps.forEach((step, i) => {
            step.querySelector('.step-title')?.setAttribute('data-i18n', `process.step${i + 1}.title`);
            step.querySelector('.step-description')?.setAttribute('data-i18n', `process.step${i + 1}.desc`);

            const meta = step.querySelectorAll('.meta-item');
            meta.forEach((m, j) => {
                m.setAttribute('data-i18n', `process.step${i + 1}.meta${j + 1}`);
            });
        });
    }

    // Contact section
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        contactSection.querySelector('.section-label')?.setAttribute('data-i18n', 'contact.label');
        contactSection.querySelector('.section-title')?.setAttribute('data-i18n', 'contact.title');
        contactSection.querySelector('.section-description')?.setAttribute('data-i18n', 'contact.description');

        // Form labels and placeholders
        const formElements = {
            'serviceType': { label: 'form.serviceType.label', placeholder: 'form.serviceType.placeholder' },
            'frequency': { label: 'form.frequency.label', placeholder: 'form.frequency.placeholder' },
            'fullName': { label: 'form.fullName.label', placeholder: 'form.fullName.placeholder' },
            'email': { label: 'form.email.label', placeholder: 'form.email.placeholder' },
            'phone': { label: 'form.phone.label', placeholder: 'form.phone.placeholder' },
            'address': { label: 'form.address.label', placeholder: 'form.address.placeholder' },
            'message': { label: 'form.message.label', placeholder: 'form.message.placeholder' }
        };

        Object.entries(formElements).forEach(([id, keys]) => {
            const label = document.querySelector(`label[for="${id}"]`);
            const input = document.getElementById(id);
            if (label) label.setAttribute('data-i18n', keys.label);
            if (input) input.setAttribute('data-i18n-placeholder', keys.placeholder);
        });

        // Form submit button
        document.querySelector('button[type="submit"]')?.setAttribute('data-i18n', 'form.submit');

        // Info cards
        const infoCards = contactSection.querySelectorAll('.info-card');
        infoCards.forEach((card, i) => {
            card.querySelector('h4')?.setAttribute('data-i18n', `contact.info${i + 1}.title`);
            const metas = card.querySelectorAll('.info-meta');
            metas.forEach(m => m.setAttribute('data-i18n', `contact.info${i + 1}.meta`));
        });

        const locationP = infoCards[2]?.querySelectorAll('p')[0];
        if (locationP && !locationP.classList.contains('info-meta')) {
            locationP.setAttribute('data-i18n', 'contact.info3.location');
        }

        const hoursP = infoCards[3]?.querySelectorAll('p')[0];
        if (hoursP && !hoursP.classList.contains('info-meta')) {
            hoursP.setAttribute('data-i18n', 'contact.info4.hours');
        }
    }

    // Footer
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.querySelector('.footer-description')?.setAttribute('data-i18n', 'footer.description');

        const footerHeadings = footer.querySelectorAll('.footer-heading');
        if (footerHeadings[0]) footerHeadings[0].setAttribute('data-i18n', 'footer.services.title');
        if (footerHeadings[1]) footerHeadings[1].setAttribute('data-i18n', 'footer.company.title');
        if (footerHeadings[2]) footerHeadings[2].setAttribute('data-i18n', 'footer.contact.title');

        footer.querySelector('.copyright')?.setAttribute('data-i18n', 'footer.copyright');

        const legalLinks = footer.querySelectorAll('.legal-link');
        if (legalLinks[0]) legalLinks[0].setAttribute('data-i18n', 'footer.privacy');
        if (legalLinks[1]) legalLinks[1].setAttribute('data-i18n', 'footer.terms');
    }

    console.log('Attributs data-i18n ajoutés! Copiez le HTML mis à jour.');
    console.log('Utilisez: document.documentElement.outerHTML');
}

// Exécuter
addI18n();
