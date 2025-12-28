# Instructions pour ajouter vos images

## 📸 Images nécessaires pour le site

Placez vos images dans le dossier `assets/images/` avec les noms suivants :

### 1. Logo et favicon
- `logo.png` - Logo principal (recommandé : 300x100px, fond transparent)
- `favicon.png` - Icône du site (32x32px ou 64x64px)

### 2. Section À propos
- `team.jpg` - Photo de l'équipe ou du personnel (recommandé : 800x600px)
- OU `about-hero.jpg` - Image représentant votre entreprise

### 3. Section Services (optionnel mais recommandé)
- `service-residential.jpg` - Nettoyage résidentiel
- `service-commercial.jpg` - Nettoyage commercial
- `service-airbnb.jpg` - Service conciergerie

### 4. Hero background (optionnel)
- `hero-background.jpg` - Grande image de fond (1920x1080px)

## 🔧 Comment ajouter les images

### Méthode 1 : Ajout manuel
1. Copiez vos images dans le dossier `assets/images/`
2. Renommez-les selon les noms ci-dessus
3. Les images seront automatiquement utilisées

### Méthode 2 : Modification du code
Si vous voulez utiliser vos propres noms de fichiers :

1. **Pour le logo dans la navbar**, modifiez `index.html` ligne ~36 :
```html
<!-- Remplacez -->
<span class="logo-text">G.D.F</span>

<!-- Par -->
<img src="assets/images/votre-logo.png" alt="G.D.F Pro-Cleaners">
```

2. **Pour l'image "À propos"**, modifiez `styles.css` ligne ~629 :
```css
.image-placeholder {
    background: url('../assets/images/team.jpg');
    background-size: cover;
    background-position: center;
}
```

3. **Pour le background du hero**, modifiez `styles.css` ligne ~489 :
```css
.hero {
    background-image: 
        linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(79, 70, 229, 0.9) 100%),
        url('../assets/images/hero-background.jpg');
}
```

## 🎨 Recommandations pour les images

### Format
- **Photos** : JPEG (.jpg) - Bon compromis qualité/poids
- **Logo** : PNG (.png) - Fond transparent
- **Icônes** : SVG (.svg) - Meilleure qualité, léger

### Optimisation
Avant d'ajouter vos images, optimisez-les :
- Utilisez [TinyPNG](https://tinypng.com/) pour compresser
- Redimensionnez aux dimensions recommandées
- Cible : < 200KB par image pour de bonnes performances

### Tailles recommandées
- **Logo** : 300x100px (ratio 3:1)
- **Favicon** : 32x32px ou 64x64px
- **Photos de services** : 800x600px (ratio 4:3)
- **Photo d'équipe** : 1200x800px (ratio 3:2)
- **Hero background** : 1920x1080px (ratio 16:9)

## 🖼️ Images temporaires

Actuellement, le site utilise :
- Dégradés CSS pour les backgrounds
- Placeholders SVG pour les icônes de services
- Texte stylisé pour le logo

Cela fonctionne parfaitement, mais ajouter vos vraies images rendra le site plus personnel et professionnel.

## 📌 Exemples de sources d'images gratuites

Si vous n'avez pas encore de photos professionnelles :
- [Unsplash](https://unsplash.com/) - Photos gratuites haute qualité
- [Pexels](https://www.pexels.com/) - Banque d'images gratuites
- [Pixabay](https://pixabay.com/) - Images et illustrations gratuites

Recherchez : "cleaning service", "professional cleaning", "office cleaning", etc.

---

**Note** : Le site fonctionne parfaitement sans images. Ajoutez-les quand vous êtes prêt !
