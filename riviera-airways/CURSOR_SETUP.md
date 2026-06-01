# 🛫 Riviera Private Airways — Setup Cursor AI

Guide complet pour démarrer avec Cursor et construire ce projet étape par étape.

---

## 📦 Étape 0 — Ouvrir le projet dans Cursor

```bash
# Cloner / télécharger ce dossier, puis :
cursor .
```

Les fichiers `.cursor/rules/` et `.cursorrules` sont automatiquement chargés par Cursor.
Cursor connaît déjà tout le projet : vols, palette, stack, règles métier.

---

## ⚡ Étape 1 — Initialiser le projet (à faire UNE fois)

Ouvrir le chat Cursor (`Cmd+L`) et coller le contenu de :
📄 `.cursor/prompts/01-init-projet.md`

Cursor va générer toute la structure du projet, le package.json, les types, le .env.

```bash
npm install
```

---

## 🎨 Étape 2 — Construire les composants (dans cet ordre)

| Ordre | Fichier prompt | Ce que ça crée |
|---|---|---|
| 2 | `02-hero-section.md` | Section hero animée |
| 3 | `03-boarding-pass-preview.md` | Billet interactif avec hover 3D |
| 4 | `04-checkin-form.md` | Formulaire check-in complet |
| 5 | `05-success-screen.md` | Célébration + billets + PDF |
| 6 | `06-apps-script.md` | Code Google Sheets |

**Comment utiliser un prompt :**
1. Ouvrir `.cursor/prompts/0X-nom.md`
2. `Cmd+A` pour tout sélectionner
3. `Cmd+L` pour envoyer au chat Cursor
4. Cursor génère les fichiers → vérifier → valider

---

## 🔧 Étape 3 — Configurer les services externes

### Resend (emails)
1. https://resend.com → créer un compte gratuit
2. Ajouter domaine `travelba.fr` → copier les 3 DNS → attendre validation
3. Créer une API Key → coller dans `.env.local`

### Google Apps Script
1. Créer un Google Sheets vierge
2. Renommer onglets : "Inscriptions" et "Résumé"
3. Extensions > Apps Script > Nouveau projet
4. Coller le code généré par le Prompt 6
5. Déployer > Application Web > Accès : Tout le monde
6. Copier l'URL → `.env.local` NEXT_PUBLIC_APPS_SCRIPT_URL

### Twilio WhatsApp
1. https://twilio.com → créer un compte
2. Console > Messaging > Try it out > Send a WhatsApp message
3. ⚠️ Soumettre le template `boarding_confirmation_fr` à Meta MAINTENANT
   (délai d'approbation : 5-7 jours ouvrés)
4. Copier Account SID + Auth Token → `.env.local`

### Vercel Blob
1. Déployer le projet sur Vercel d'abord (`vercel deploy`)
2. Dashboard Vercel > Storage > Create Blob Store
3. Copier le token → `.env.local` BLOB_READ_WRITE_TOKEN

---

## 🚀 Étape 4 — Déploiement

```bash
# Test local
npm run dev

# Déploiement Vercel
npx vercel deploy

# Production
npx vercel --prod
```

URL suggérée : `sttropez-carole.vercel.app` ou domaine custom

---

## ✅ Variables d'environnement — Checklist

```bash
cp .env.local.example .env.local
```

| Variable | Source | Statut |
|---|---|---|
| RESEND_API_KEY | resend.com | ⬜ |
| NEXT_PUBLIC_APPS_SCRIPT_URL | Google Apps Script | ⬜ |
| AGENCY_EMAIL | `contact@travelba.fr` | ✅ déjà rempli |
| SENDER_EMAIL | `billets@travelba.fr` | ✅ déjà rempli |
| TWILIO_ACCOUNT_SID | twilio.com | ⬜ |
| TWILIO_AUTH_TOKEN | twilio.com | ⬜ |
| TWILIO_WHATSAPP_NUMBER | twilio.com | ⬜ |
| TWILIO_TEMPLATE_SID | twilio.com (après approbation Meta) | ⬜ |
| BLOB_READ_WRITE_TOKEN | vercel.com/storage | ⬜ |

---

## 💬 Prompts Cursor utiles en cours de développement

### Débugger un composant
```
Le composant BoardingPassPreview ne s'anime pas au scroll.
Vérifie l'Intersection Observer et corrige.
```

### Ajouter une feature
```
Dans Step2Passengers, ajoute une limite visuelle qui empêche
d'ajouter plus de 10 passagers et affiche un message explicatif.
```

### Adapter le design
```
Sur mobile (375px), le boarding pass preview dépasse de l'écran.
Adapte le design pour qu'il soit lisible sur mobile.
```

### Tester l'email
```
Crée un script de test /scripts/test-email.ts qui envoie un email
de test à contact@travelba.fr avec un passager fictif.
```

---

## 📁 Structure finale attendue

```
riviera-airways/
├── .cursor/
│   ├── rules/          ← Rules automatiques Cursor (NE PAS MODIFIER)
│   └── prompts/        ← Prompts à utiliser dans l'ordre
├── .cursorrules        ← Configuration globale Cursor
├── CURSOR_SETUP.md     ← Ce fichier
├── app/
├── components/
├── emails/
├── lib/
├── types/
└── public/
```

---

*Projet créé par Travel Booking Agency — contact@travelba.fr*
