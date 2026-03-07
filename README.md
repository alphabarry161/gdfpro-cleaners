# G.D.F Pro-Cleaners - Site Web

Site web professionnel pour G.D.F Pro-Cleaners Inc., une entreprise de nettoyage résidentiel et commercial basée à Gatineau et Ottawa.

## 📋 Description

Site web moderne et responsive présentant les services de nettoyage professionnel de G.D.F Pro-Cleaners. Le site comprend :

- **Page d'accueil** avec bannière hero et statistiques
- **Section À propos** présentant l'entreprise et ses avantages
- **Services détaillés** : Résidentiel, Commercial, Conciergerie & Airbnb
- **Processus de travail** en 4 étapes
- **Formulaire de contact** pour demandes de devis
- **Design responsive** optimisé pour mobile, tablette et desktop

## 🚀 Technologies utilisées

- **HTML5** - Structure sémantique et accessible
- **CSS3** - Styles modernes avec variables CSS et Flexbox/Grid
- **JavaScript vanilla** - Interactions sans framework
- **Google Fonts** - Police Inter pour un rendu professionnel

## 📁 Structure du projet

```
website/
│
├── index.html              # Page principale du site
│
├── css/
│   └── styles.css         # Feuille de styles complète
│
├── js/
│   └── script.js          # JavaScript pour interactions
│
├── assets/
│   └── images/            # Dossier pour les images
│       └── (à ajouter)
│
└── README.md              # Ce fichier
```

## 🎨 Palette de couleurs

- **Primaire** : #2563eb (Bleu professionnel)
- **Secondaire** : #10b981 (Vert écologique)
- **Accent** : #f59e0b (Orange pour highlights)
- **Texte** : #1f2937 (Gris foncé)
- **Fond** : #ffffff et #f9fafb

## 📱 Responsive Design

Le site est entièrement responsive avec 3 points de rupture principaux :

- **Desktop** : > 1024px
- **Tablette** : 768px - 1024px
- **Mobile** : < 768px

## ✨ Fonctionnalités

### Navigation
- Menu fixe avec effet de scroll
- Menu hamburger pour mobile
- Navigation smooth scroll vers les sections
- Mise en surbrillance de la section active

### Formulaire de contact
- Validation des champs côté client
- Messages d'erreur et de succès
- Design moderne et accessible
- Prêt pour intégration backend

### Animations
- Animations au scroll (Intersection Observer)
- Transitions fluides sur les boutons et cartes
- Effets hover sur les éléments interactifs
- Bouton "retour en haut" animé

### Performance
- Code optimisé avec throttling/debouncing
- Animations GPU-accélérées
- Chargement lazy des fonctionnalités
- Respect des préférences de mouvement réduit

## 🔧 Installation et utilisation

### Option 1 : Ouverture directe
1. Ouvrez le fichier `index.html` dans votre navigateur

### Option 2 : Serveur local (recommandé)
1. Avec Python :
   ```bash
   cd website
   python3 -m http.server 8000
   ```
   Puis ouvrez : http://localhost:8000

2. Avec Node.js (http-server) :
   ```bash
   cd website
   npx http-server -p 8000
   ```

3. Avec l'extension VS Code "Live Server" :
   - Clic droit sur `index.html`
   - Sélectionner "Open with Live Server"

## 🎯 Prochaines étapes

### Images à ajouter
- [ ] Logo de l'entreprise (format PNG ou SVG)
- [ ] Photo de l'équipe pour la section "À propos"
- [ ] Photos des services (nettoyage résidentiel, commercial, etc.)
- [ ] Favicon (16x16, 32x32, 180x180)
- [ ] Photos avant/après des projets

### Intégrations recommandées
- [ ] Backend pour le formulaire de contact (EmailJS, Formspree, ou API personnalisée)
- [ ] Google Analytics pour le suivi des visiteurs
- [ ] Google Maps pour afficher la zone de service
- [ ] Système de réservation en ligne (optionnel)
- [ ] Témoignages clients avec photos
- [ ] Galerie de projets réalisés

### Optimisations
- [ ] Compression des images
- [ ] Minification CSS/JS pour la production
- [ ] Ajout de métadonnées Open Graph pour les réseaux sociaux
- [ ] Schéma JSON-LD pour le SEO local
- [ ] Tests de performance (Lighthouse)
- [ ] Tests d'accessibilité (WAVE, axe)

## 📞 Informations de contact

Les informations suivantes sont configurées dans le site :

- **Téléphone** : (613) 501-5274
- **Email** : contact@gdfprocleaners.com
- **Zone de service** : Gatineau, Ottawa et environs
- **Heures** : Lun-Dim 8h-20h

> ⚠️ **Note** : Vérifiez et mettez à jour ces informations selon vos coordonnées réelles.

## 🔐 Configuration du formulaire de contact

Le formulaire est maintenant connecté à une API Vercel `/api/contact` qui :

- envoie un **accusé de réception** au client
- envoie la **demande complète** à `gdfprocleaners@gmail.com`

### Variables d'environnement (Vercel)

Sur Vercel, ajoutez ces variables d'environnement (Project Settings → Environment Variables) :

- `GDF_GMAIL_USER` : `gdfprocleaners@gmail.com`
- `GDF_GMAIL_APP_PASSWORD` : mot de passe d'application Gmail

> Gmail nécessite généralement un **mot de passe d'application** (pas votre mot de passe normal), et l'adresse d'envoi doit correspondre à l'utilisateur SMTP.

### Alternative (sans backend)

### Option 1 : EmailJS (gratuit, facile)
1. Créez un compte sur [EmailJS](https://www.emailjs.com/)
2. Configurez un service email
3. Modifiez `js/script.js` ligne ~330 pour utiliser EmailJS

### Option 2 : Formspree (gratuit, simple)
1. Créez un compte sur [Formspree](https://formspree.io/)
2. Ajoutez `action="https://formspree.io/f/YOUR_ID"` au formulaire
3. Le formulaire fonctionnera sans JavaScript

### Option 3 : Backend personnalisé
1. Créez une API (Node.js, PHP, Python, etc.)
2. Remplacez la fonction `simulateFormSubmission()` par un vrai fetch()
3. Gérez la sécurité (CORS, validation serveur, anti-spam)

## 🌐 Déploiement

### Hébergement gratuit recommandé :
- **Netlify** - Déploiement automatique depuis Git
- **Vercel** - Optimisé pour les sites statiques
- **GitHub Pages** - Gratuit avec domaine personnalisé
- **Cloudflare Pages** - CDN global inclus

### Étapes de déploiement (Netlify) :
1. Créez un compte sur Netlify
2. Connectez votre dépôt GitHub (ou glissez-déposez le dossier)
3. Configurez le domaine personnalisé
4. Le site sera déployé automatiquement

## 🧪 Tests

### Checklist de test :
- [ ] Navigation entre toutes les sections
- [ ] Menu mobile (hamburger)
- [ ] Formulaire de contact (validation)
- [ ] Bouton retour en haut
- [ ] Liens de réseaux sociaux
- [ ] Responsive sur mobile (iPhone, Android)
- [ ] Responsive sur tablette (iPad)
- [ ] Compatibilité navigateurs (Chrome, Firefox, Safari, Edge)
- [ ] Accessibilité clavier (Tab, Enter, Escape)
- [ ] Vitesse de chargement

## 📝 Maintenance

### Mises à jour régulières :
- Contenu des services
- Témoignages clients
- Photos de projets
- Informations de contact
- Heures d'ouverture
- Tarifs (si affichés)

## 🤝 Support

Pour toute question ou problème :
1. Vérifiez la console du navigateur (F12)
2. Consultez ce README
3. Contactez le développeur

## 📄 Licence

© 2025 G.D.F Pro-Cleaners Inc. Tous droits réservés.

---

**Développé avec ❤️ pour G.D.F Pro-Cleaners**
