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
    }
};

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
    bedrooms: 0,
    bathrooms: 0,
    basement: 0,
    'airbnb-bedrooms': 0,
    'airbnb-bathrooms': 0,
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
            const max = parseFloat(input.max);
            const min = parseFloat(input.min);
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

    } else if (service === 'airbnb') {
        // AirBNB - Prix de base TOUJOURS affiché
        totalPrice = PRICING.basePrice.airbnb;
        totalTime = TIME_ESTIMATES.airbnb;

        // Ajouter les coûts additionnels
        totalPrice += state['airbnb-bedrooms'] * PRICING.bedrooms.airbnb;
        totalPrice += state['airbnb-bathrooms'] * PRICING.bathrooms.airbnb;

        // Temps additionnel
        let additionalTime = 0;
        additionalTime += state['airbnb-bedrooms'] * TIME_PER_ROOM.bedroom;
        additionalTime += state['airbnb-bathrooms'] * TIME_PER_ROOM.bathroom;

        totalTime += (additionalTime / 60);

        // Ajouter le coût des tapis si applicable
        if (state['carpet-sqft'] > 0) {
            totalPrice += state['carpet-sqft'] * PRICING.carpet.airbnb;
        }

    } else if (service === 'carpet') {
        // Nettoyage de tapis SEULEMENT - basé sur pieds carrés
        if (state['carpet-sqft'] === 0) {
            totalPrice = 0;
            totalTime = 0;
        } else {
            // Utiliser le prix de deep cleaning comme base pour tapis seul
            totalPrice = state['carpet-sqft'] * 0.25;
            totalTime = 2 + (state['carpet-sqft'] / 200) * 0.5; // Temps basé sur superficie
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
                <span>${currentLang === 'fr' ? 'Prix de base' : 'Base Price'}:</span>
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
                <span>${currentLang === 'fr' ? 'Prix de base' : 'Base Price'}:</span>
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
        `;

        if (state['carpet-sqft'] > 0) {
            summaryHTML += `
                <div class="detail-row">
                    <span>${currentLang === 'fr' ? 'Tapis' : 'Carpet'}:</span>
                    <span>${state['carpet-sqft']} pi²</span>
                </div>
            `;
        }
    } else if (service === 'carpet') {
        summaryHTML = `
            <div class="detail-row">
                <span>${currentLang === 'fr' ? 'Tapis (pieds carrés)' : 'Carpet (sq ft)'}:</span>
                <span>${state['carpet-sqft']} pi²</span>
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
}
