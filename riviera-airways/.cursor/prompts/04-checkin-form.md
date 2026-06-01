Crée tous les fichiers `components/CheckinForm/`.

SPECS COMPLÈTES :

ProgressBar : 3 cercles reliés (Contact → Passagers → Récapitulatif)
- Actif : fond or, texte nuit | Complété : check | Inactif : border or/30%

Step1Contact : labels flottants, champs Nom/Prénom/DDN/Email/Téléphone
- Tel : mention "📱 Pour recevoir vos billets par WhatsApp"

Step2Passengers :
- Passager 1 = contact (carte verrouillée, badge "Vous", fond or/10%)
- Sélecteur Adulte/Enfant (boutons radio stylisés, pas de select natif)
- Animation Framer Motion sur ajout/suppression de passagers
- Compteur temps réel "✈ X adulte(s) · 🧒 Y enfant(s)"
- Max 10 passagers

Step3Summary :
- Style document officiel, lecture seule
- Deux vols affichés (aller + retour)
- Liste passagers numérotée avec badges
- Email mis en valeur (fond or/10%)
- Checkbox RGPD
- Bouton Confirmer → état loading avec spinner or

Validation Zod : voir .cursor/rules/04-form-passengers.mdc
Erreurs en rose-gold #B76E79
