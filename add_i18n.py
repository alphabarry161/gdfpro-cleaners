#!/usr/bin/env python3
"""
Script pour ajouter automatiquement les attributs data-i18n au HTML
"""

# Lecture du fichier HTML
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Mapping des textes français vers leurs clés de traduction
replacements = [
    # About section
    ('Qui sommes-nous', 'Qui sommes-nous" data-i18n="about.label'),
    ('Excellence en nettoyage depuis des années', 'Excellence en nettoyage depuis des années" data-i18n="about.title'),
    ('Chez G.D.F Pro-Cleaners, nous créons des environnements propres,\n                    sains et accueillants pour nos clients résidentiels et commerciaux.',
     'Chez G.D.F Pro-Cleaners, nous créons des environnements propres,\n                    sains et accueillants pour nos clients résidentiels et commerciaux." data-i18n="about.description'),
    ('Notre mission est simple : offrir des services de nettoyage professionnel\n                        adaptés à vos besoins spécifiques, qu\'il s\'agisse de votre maison,\n                        bureau ou espace commercial.',
     'Notre mission est simple : offrir des services de nettoyage professionnel\n                        adaptés à vos besoins spécifiques, qu\'il s\'agisse de votre maison,\n                        bureau ou espace commercial." data-i18n="about.intro'),
    ('<h3>Équipe qualifiée</h3>', '<h3 data-i18n="about.feature1.title">Équipe qualifiée</h3>'),
    ('Personnel formé et expérimenté en nettoyage résidentiel et commercial', 'Personnel formé et expérimenté en nettoyage résidentiel et commercial" data-i18n="about.feature1.desc'),
    ('<h3>Produits écologiques</h3>', '<h3 data-i18n="about.feature2.title">Produits écologiques</h3>'),
    ('Solutions de nettoyage sûres pour votre santé et l\'environnement', 'Solutions de nettoyage sûres pour votre santé et l\'environnement" data-i18n="about.feature2.desc'),
    ('<h3>Service sur mesure</h3>', '<h3 data-i18n="about.feature3.title">Service sur mesure</h3>'),
    ('Solutions personnalisées adaptées à vos besoins et horaires', 'Solutions personnalisées adaptées à vos besoins et horaires" data-i18n="about.feature3.desc'),
    ('<h3>Satisfaction garantie</h3>', '<h3 data-i18n="about.feature4.title">Satisfaction garantie</h3>'),
    ('Nous nous engageons à fournir un service impeccable à chaque fois', 'Nous nous engageons à fournir un service impeccable à chaque fois" data-i18n="about.feature4.desc'),
    ('<p>Image de l\'équipe professionnelle</p>', '<p data-i18n="about.image.placeholder">Image de l\'équipe professionnelle</p>'),
]

# Appliquer les remplacements
for old, new in replacements:
    content = content.replace(old, new)

# Sauvegarder le fichier modifié
with open('index_i18n.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fichier index_i18n.html créé avec succès!")
