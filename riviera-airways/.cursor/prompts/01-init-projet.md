Lis le fichier `.cursorrules` et tous les fichiers dans `.cursor/rules/`.

Initialise le projet Next.js 14 complet "Riviera Private Airways" avec :

1. STRUCTURE COMPLÈTE des dossiers et fichiers :
app/layout.tsx, app/page.tsx, app/globals.css
app/api/register/route.ts
components/Hero.tsx
components/BoardingPassPreview.tsx
components/Timeline.tsx
components/CheckinForm/index.tsx + Step1Contact.tsx + Step2Passengers.tsx + Step3Summary.tsx + ProgressBar.tsx
components/SuccessScreen.tsx
components/pdf/BoardingPassPDF.tsx
emails/ConfirmationEmail.tsx + AgencyNotificationEmail.tsx
lib/schemas/registration.schema.ts
lib/submitToSheets.ts + generatePDFs.ts + uploadToBlob.ts + sendEmail.ts + sendWhatsApp.ts
types/registration.ts
tailwind.config.ts
.env.local.example

2. package.json avec TOUTES les dépendances :
next@14, react@18, framer-motion, react-hook-form, zod, @hookform/resolvers,
@react-pdf/renderer, resend, @react-email/components, twilio, @vercel/blob, canvas-confetti

3. tsconfig.json en mode strict

4. globals.css avec toutes les variables CSS du design system

Génère chaque fichier avec son contenu COMPLET. Aucun placeholder. Aucun TODO.
