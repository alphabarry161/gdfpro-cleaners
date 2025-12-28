/**
 * ================================================================
 * SCRIPT PRINCIPAL - G.D.F Pro-Cleaners Website
 * ================================================================
 * 
 * Ce fichier contient toute la logique JavaScript du site.
 * Organisation du code :
 * 
 * 0. Système de traduction (i18n)
 * 1. Configuration et variables globales
 * 2. Navigation et menu mobile
 * 3. Effets de scroll (navbar, bouton retour en haut)
 * 4. Navigation smooth scroll
 * 5. Formulaire de contact
 * 6. Animations au scroll (intersection observer)
 * 7. Initialisation au chargement de la page
 * 
 * ================================================================
 */


// ================================================================
// 0. SYSTÈME DE TRADUCTION (i18n)
// ================================================================

// Langue par défaut et langue courante
let currentLanguage = localStorage.getItem('preferredLanguage') || 'fr';

/**
 * Change la langue du site
 * @param {string} lang - Code de la langue ('fr' ou 'en')
 */
function changeLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Langue non supportée: ${lang}`);
        return;
    }

    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);

    // Met à jour l'attribut lang du HTML
    document.documentElement.lang = lang;

    // Met à jour tous les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[lang][key];

        if (translation) {
            // Si l'élément est un input/textarea, met à jour le placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            }
            // Si c'est une option de select
            else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            }
            // Sinon, met à jour le contenu textuel
            else {
                element.textContent = translation;
            }
        }
    });

    // Met à jour les horaires d'ouverture selon la langue
    const businessHours = document.getElementById('business-hours');
    if (businessHours) {
        if (lang === 'fr') {
            businessHours.innerHTML = `
                <p style="margin: 0.25rem 0;"><strong>Lun - Ven:</strong> 8h - 20h</p>
                <p style="margin: 0.25rem 0;"><strong>Samedi:</strong> 8h - 16h</p>
                <p style="margin: 0.25rem 0;"><strong>Dimanche:</strong> 8h - 15h</p>
            `;
        } else if (lang === 'en') {
            businessHours.innerHTML = `
                <p style="margin: 0.25rem 0;"><strong>Mon - Fri:</strong> 8am - 8pm</p>
                <p style="margin: 0.25rem 0;"><strong>Saturday:</strong> 8am - 4pm</p>
                <p style="margin: 0.25rem 0;"><strong>Sunday:</strong> 8am - 3pm</p>
            `;
        }
    }

    // Met à jour les meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && translations[lang]['meta.description']) {
        metaDescription.setAttribute('content', translations[lang]['meta.description']);
    }

    const pageTitle = document.querySelector('title');
    if (pageTitle && translations[lang]['meta.title']) {
        pageTitle.textContent = translations[lang]['meta.title'];
    }

    // Met à jour les boutons de langue
    updateLanguageButtons(lang);
}

/**
 * Met à jour l'état actif des boutons de langue
 * @param {string} activeLang - La langue active
 */
function updateLanguageButtons(activeLang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === activeLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Initialise le système de traduction
 */
function initLanguageSystem() {
    // Ajoute les écouteurs sur les boutons de langue
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeLanguage(btn.dataset.lang);
        });
    });

    // Applique la langue sauvegardée ou par défaut
    changeLanguage(currentLanguage);
}


// ================================================================
// 1. CONFIGURATION ET VARIABLES GLOBALES
// ================================================================

// Sélection des éléments DOM principaux
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollToTopBtn = document.getElementById('scrollToTop');
const contactForm = document.getElementById('contactForm');


// ================================================================
// 2. NAVIGATION ET MENU MOBILE
// ================================================================

/**
 * Gestion du menu hamburger (mobile)
 * Toggle l'affichage du menu et l'animation du bouton hamburger
 */
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');

    // Désactive le scroll du body quand le menu est ouvert
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * Ferme le menu mobile
 * Utilisé lors du clic sur un lien de navigation
 */
function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listener pour le bouton hamburger
if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
}

/**
 * Gestion de la navigation active
 * Met en surbrillance le lien correspondant à la section visible
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            // Retire la classe active de tous les liens
            navLinks.forEach(link => link.classList.remove('active'));
            // Ajoute la classe active au lien courant
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}


// ================================================================
// 3. EFFETS DE SCROLL (NAVBAR, BOUTON RETOUR EN HAUT)
// ================================================================

/**
 * Gestion de l'apparence de la navbar au scroll
 * Ajoute une ombre et change le style quand on scrolle
 */
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

/**
 * Gestion du bouton "Retour en haut"
 * Affiche le bouton quand on scrolle vers le bas
 */
function handleScrollToTopButton() {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

/**
 * Fonction de scroll optimisée avec throttle
 * Limite le nombre d'exécutions pour améliorer les performances
 */
let scrollTimeout;
function handleScroll() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            handleNavbarScroll();
            handleScrollToTopButton();
            updateActiveNavLink();
            scrollTimeout = null;
        }, 10);
    }
}

// Event listener pour le scroll
window.addEventListener('scroll', handleScroll);

// Event listener pour le bouton retour en haut
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// ================================================================
// 4. NAVIGATION SMOOTH SCROLL
// ================================================================

/**
 * Smooth scroll vers les sections au clic sur les liens de navigation
 * Gère également la fermeture du menu mobile après le clic
 */
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Vérifie si c'est un lien interne (commence par #)
        if (href && href.startsWith('#')) {
            e.preventDefault();

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Calcul de la position avec offset pour la navbar fixe
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                // Scroll smooth vers la section
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Ferme le menu mobile si ouvert
                closeMobileMenu();
            }
        }
    });
});


// ================================================================
// 5. FORMULAIRE DE CONTACT
// ================================================================

/**
 * Validation basique des champs du formulaire
 * @param {Object} formData - Données du formulaire
 * @returns {Object} - {isValid: boolean, errors: array}
 */
function validateForm(formData) {
    const errors = [];

    // Validation du nom
    if (!formData.fullName || formData.fullName.trim().length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Veuillez entrer une adresse email valide');
    }

    // Validation du téléphone (format flexible)
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
        errors.push('Veuillez entrer un numéro de téléphone valide');
    }

    // Validation des champs obligatoires
    if (!formData.serviceType) {
        errors.push('Veuillez sélectionner un type de service');
    }

    if (!formData.frequency) {
        errors.push('Veuillez sélectionner une fréquence');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Affiche un message dans le formulaire
 * @param {string} message - Le message à afficher
 * @param {string} type - Type du message ('success' ou 'error')
 */
function showFormMessage(message, type = 'success') {
    const formMessage = document.getElementById('formMessage');

    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;

        // Scroll vers le message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Cache automatiquement le message après 5 secondes (succès seulement)
        if (type === 'success') {
            setTimeout(() => {
                formMessage.className = 'form-message';
            }, 5000);
        }
    }
}

/**
 * Gestion de la soumission du formulaire de contact
 */
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Récupération des données du formulaire
        const formData = {
            serviceType: document.getElementById('serviceType').value,
            frequency: document.getElementById('frequency').value,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            message: document.getElementById('message').value
        };

        // Validation du formulaire
        const validation = validateForm(formData);

        if (!validation.isValid) {
            // Affiche les erreurs de validation
            const errorMessage = validation.errors.join('. ');
            showFormMessage(errorMessage, 'error');
            return;
        }

        // Désactive le bouton de soumission pendant l'envoi
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';

        try {
            // Simulation d'envoi de formulaire (à remplacer par un vrai appel API)
            // Dans un environnement de production, vous devriez envoyer les données
            // à un serveur backend ou utiliser un service comme Formspree, EmailJS, etc.

            await simulateFormSubmission(formData);

            // Affiche le message de succès
            showFormMessage(
                'Merci pour votre demande ! Nous vous contactons dans les 24 heures.',
                'success'
            );

            // Réinitialise le formulaire
            contactForm.reset();

        } catch (error) {
            // Gestion des erreurs
            console.error('Erreur lors de l\'envoi du formulaire:', error);
            showFormMessage(
                'Une erreur est survenue. Veuillez réessayer ou nous contacter directement par téléphone.',
                'error'
            );
        } finally {
            // Réactive le bouton de soumission
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

/**
 * Simule l'envoi du formulaire (à remplacer par une vraie API)
 * @param {Object} data - Données du formulaire
 * @returns {Promise}
 */
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        // Log les données pour le développement
        console.log('Données du formulaire:', data);

        // Simule un délai réseau
        setTimeout(() => {
            resolve({ success: true });
        }, 1500);

        // Dans un environnement de production, remplacer par :
        /*
        return fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json());
        */
    });
}


// ================================================================
// 6. ANIMATIONS AU SCROLL (INTERSECTION OBSERVER)
// ================================================================

/**
 * Observe les éléments et ajoute des animations quand ils entrent dans le viewport
 * Améliore l'expérience utilisateur avec des animations subtiles
 */
function initScrollAnimations() {
    // Configuration de l'Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Callback exécuté quand un élément entre/sort du viewport
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajoute une classe pour déclencher l'animation CSS
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Arrête d'observer l'élément après l'animation
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Sélectionne les éléments à animer
    const animatedElements = document.querySelectorAll(
        '.service-card, .step-item, .info-card, .feature-item'
    );

    // Applique un style initial et observe chaque élément
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;

        observer.observe(element);
    });
}


// ================================================================
// 7. INITIALISATION AU CHARGEMENT DE LA PAGE
// ================================================================

/**
 * Fonction d'initialisation principale
 * Exécutée quand le DOM est complètement chargé
 */
function init() {
    // Initialise le système de traduction en premier
    initLanguageSystem();

    // Initialise l'état de la navbar au chargement
    handleNavbarScroll();
    handleScrollToTopButton();

    // Initialise les animations au scroll
    initScrollAnimations();

    // Met à jour le lien de navigation actif
    updateActiveNavLink();

    // Log pour le développement (peut être retiré en production)
    console.log('Site G.D.F Pro-Cleaners initialisé avec succès');
    console.log(`Langue active: ${currentLanguage}`);
}// Event listener pour le chargement complet du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // Le DOM est déjà chargé
    init();
}


// ================================================================
// GESTION DES CLICS EN DEHORS DU MENU MOBILE
// ================================================================

/**
 * Ferme le menu mobile si on clique en dehors
 */
document.addEventListener('click', (e) => {
    const isClickInsideNav = navMenu.contains(e.target) || navToggle.contains(e.target);
    const isMenuOpen = navMenu.classList.contains('active');

    if (!isClickInsideNav && isMenuOpen) {
        closeMobileMenu();
    }
});


// ================================================================
// GESTION DE LA TOUCHE ESCAPE POUR FERMER LE MENU
// ================================================================

/**
 * Ferme le menu mobile avec la touche Escape
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});


// ================================================================
// GESTION DES BOUTONS "DEMANDER UN DEVIS"
// ================================================================

/**
 * Redirige vers le calculateur de devis au lieu du formulaire
 */
document.addEventListener('DOMContentLoaded', function () {
    // Intercepter tous les liens vers le calculateur de devis
    const quoteButtons = document.querySelectorAll('a[href="#contact"], .nav-cta, .hero-btn-primary, .service-link');

    quoteButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Si c'est un bouton de devis (pas le lien Contact dans nav)
            if (this.classList.contains('nav-cta') ||
                this.classList.contains('hero-btn-primary') ||
                this.classList.contains('service-link') ||
                this.textContent.toLowerCase().includes('devis') ||
                this.textContent.toLowerCase().includes('quote')) {
                e.preventDefault();
                window.location.href = 'quote-calculator.html';
            }
        });
    });
});

// Vérifier si l'URL contient des paramètres de devis
if (window.location.search.includes('quote=true')) {
    const params = new URLSearchParams(window.location.search);

    // Pré-remplir le formulaire avec les données du calculateur
    document.addEventListener('DOMContentLoaded', function () {
        const service = params.get('service');
        const price = params.get('price');
        const time = params.get('time');
        const bedrooms = params.get('bedrooms');
        const bathrooms = params.get('bathrooms');
        const kitchen = params.get('kitchen');
        const basement = params.get('basement');

        // Pré-remplir le formulaire
        if (service) {
            const serviceSelect = document.getElementById('serviceType');
            if (serviceSelect) {
                serviceSelect.value = service === 'deep' ? 'residential' :
                    service === 'moving' ? 'residential' :
                        service === 'airbnb' ? 'airbnb' :
                            service === 'regular' ? 'residential' :
                                service === 'carpet' ? 'carpet' : 'residential';
            }
        }

        // Pré-remplir le message avec les détails
        const messageField = document.getElementById('message');
        if (messageField) {
            const lang = localStorage.getItem('preferredLanguage') || 'fr';
            let message = '';

            if (lang === 'fr') {
                message = `Estimation du calculateur:\n`;
                message += `- Chambres: ${bedrooms}\n`;
                message += `- Salles de bain: ${bathrooms}\n`;
                message += `- Cuisine: ${kitchen}\n`;
                message += `- Sous-sol: ${basement}\n`;
                message += `- Service: ${service}\n`;
                message += `- Prix estimé: $${price} CAD\n`;
                message += `- Temps estimé: ${time} heures\n\n`;
                message += `Veuillez me contacter pour confirmer cette estimation.`;
            } else {
                message = `Calculator Estimate:\n`;
                message += `- Bedrooms: ${bedrooms}\n`;
                message += `- Bathrooms: ${bathrooms}\n`;
                message += `- Kitchen: ${kitchen}\n`;
                message += `- Basement: ${basement}\n`;
                message += `- Service: ${service}\n`;
                message += `- Estimated price: $${price} CAD\n`;
                message += `- Estimated time: ${time} hours\n\n`;
                message += `Please contact me to confirm this estimate.`;
            }

            messageField.value = message;
        }
    });
}


// ================================================================
// DÉTECTION DU REDIMENSIONNEMENT DE LA FENÊTRE
// ================================================================

/**
 * Gère le comportement responsive lors du redimensionnement
 */
let resizeTimeout;
window.addEventListener('resize', () => {
    // Débounce la fonction pour améliorer les performances
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Ferme le menu mobile si on agrandit la fenêtre
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }, 250);
});


// ================================================================
// EXPORT POUR LES TESTS (optionnel)
// ================================================================

// Si vous utilisez des modules ES6 ou des tests unitaires :
/*
export {
    toggleMobileMenu,
    closeMobileMenu,
    validateForm,
    showFormMessage
};
*/
