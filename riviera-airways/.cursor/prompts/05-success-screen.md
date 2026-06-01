Crée `components/SuccessScreen.tsx`.

SÉQUENCE (Framer Motion orchestrée) :
1. 0ms    — Confettis : couleurs #C9A84C #F5E6C8 #B76E79 #FFFFFF, 180 particules
2. 300ms  — "Bienvenue à bord, {Prénom} ! 🥂" scale-in
3. 600ms  — "Vos billets ont été envoyés par email et WhatsApp"
4. 900ms  — Billets s'impriment en séquence (300ms entre chaque)
            Sous chaque billet : bouton "↓ Billet aller TO7020" + "↓ Retour AF7315"
5. Final  — Badge bookingId + "Confirmé ✓"

Chaque billet mini : version réduite boarding pass (max-width 420px)
Badge enfant : 🧒 rose-gold si type === 'Enfant'
Téléchargement : fonction downloadBoardingPass() de lib/generatePDFs.ts (PDF individuel, jamais ZIP)
