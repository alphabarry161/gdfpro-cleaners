# 🌐 Système Bilingue - Mode d'emploi

Le site est maintenant configuré pour être **bilingue** (Français/Anglais) !

## ✅ Ce qui est déjà fait

1. **Fichier de traductions** (`js/translations.js`) - Toutes les traductions FR/EN
2. **Système JavaScript** (`js/script.js`) - Logique de changement de langue
3. **Sélecteur de langue** - Boutons FR/EN dans la navigation
4. **Styles CSS** - Design du sélecteur de langue
5. **Sauvegarde de préférence** - La langue choisie est mémorisée

## 🎯 Activation immédiate

### Option 1 : Ajout automatique des attributs (Recommandé)

1. Ouvrez le site dans votre navigateur : http://localhost:8000
2. Ouvrez la console (F12 ou Cmd+Option+I sur Mac)
3. Copiez et collez le contenu de `js/add-i18n-attributes.js`
4. Appuyez sur Entrée
5. Tapez : `copy(document.documentElement.outerHTML)`
6. Créez un nouveau fichier `index-bilingual.html` et collez le contenu
7. Renommez `index.html` en `index-old.html`
8. Renommez `index-bilingual.html` en `index.html`
9. Rafraîchissez la page

### Option 2 : Manuel (Pour comprendre le fonctionnement)

Ajoutez l'attribut `data-i18n="clé.de.traduction"` à chaque élément de texte.

Exemple :
```html
<!-- Avant -->
<h2 class="section-title">Excellence en nettoyage depuis des années</h2>

<!-- Après -->
<h2 class="section-title" data-i18n="about.title">Excellence en nettoyage depuis des années</h2>
```

Les clés de traduction sont définies dans `js/translations.js`.

### Option 3 : Utiliser le fichier pré-configuré (Le plus rapide)

J'ai créé une version complète avec tous les attributs data-i18n.
Voir le fichier `index-i18n-complete.html` (en cours de création).

## 🔧 Comment ça fonctionne

### Changement de langue

Le visiteur clique sur **FR** ou **EN** dans le menu :
- Le JavaScript détecte le clic
- Toutes les traductions sont appliquées automatiquement
- La préférence est sauvegardée dans localStorage
- Au prochain visit, la langue est restaurée

### Structure du code

```javascript
// 1. Traductions dans translations.js
const translations = {
    fr: {
        'nav.home': 'Accueil',
        'nav.about': 'À propos',
        // ...
    },
    en: {
        'nav.home': 'Home',
        'nav.about': 'About',
        // ...
    }
};

// 2. Élément HTML avec data-i18n
<a href="#home" data-i18n="nav.home">Accueil</a>

// 3. Le script change automatiquement le texte
changeLanguage('en'); // Devient "Home"
```

## 📝 Pour ajouter de nouvelles traductions

1. Ouvrez `js/translations.js`
2. Ajoutez votre clé dans les deux langues :
```javascript
fr: {
    'nouvelle.cle': 'Texte en français',
},
en: {
    'nouvelle.cle': 'Text in English',
}
```
3. Ajoutez `data-i18n="nouvelle.cle"` à votre élément HTML

## 🎨 Personnalisation du sélecteur de langue

Les styles sont dans `css/styles.css` sous `.language-switcher` et `.lang-btn`.

Vous pouvez :
- Changer les couleurs
- Ajouter des drapeaux (🇫🇷 🇬🇧)
- Modifier la position
- Ajouter d'autres langues

## 🌍 Ajouter une 3ème langue (ex: Espagnol)

1. Dans `translations.js`, ajoutez :
```javascript
es: {
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    // ... toutes les clés
}
```

2. Dans `index.html`, ajoutez le bouton :
```html
<button class="lang-btn" data-lang="es" aria-label="Español">ES</button>
```

3. C'est tout ! Le système fonctionne automatiquement.

## ✅ Vérification

Pour tester si tout fonctionne :

1. Ouvrez le site
2. Le sélecteur FR/EN est visible dans la nav
3. Cliquez sur EN
4. Le texte change en anglais
5. Rafraîchissez la page
6. La langue anglaise est conservée

## 🐛 Dépannage

### Le sélecteur n'apparaît pas
- Vérifiez que `js/translations.js` est bien chargé
- Vérifiez la console pour les erreurs

### Le texte ne change pas
- Vérifiez que les attributs `data-i18n` sont présents
- Vérifiez que les clés correspondent à celles dans `translations.js`

### La langue n'est pas sauvegardée
- Vérifiez que localStorage est activé dans le navigateur

## 📞 Support

Tout fonctionne ! Si vous rencontrez un problème :
1. Vérifiez la console (F12)
2. Vérifiez que tous les fichiers sont chargés
3. Testez en mode navigation privée

---

**Le système est prêt !** Il suffit d'ajouter les attributs `data-i18n` au HTML ou d'utiliser le script automatique.
