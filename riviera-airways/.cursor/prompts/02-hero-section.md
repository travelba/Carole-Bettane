Crée le composant `components/Hero.tsx` complet.

SPECS :
- Plein écran 100dvh, fond sombre avec overlay gradient sur image Saint-Tropez
- Logo SVG "Riviera Private Airways" en haut à gauche + "by Travel Booking Agency" dessous
- Animation Framer Motion séquencée :
  1. Logo fade-in (0ms)
  2. "Tu es invitée" lettre par lettre — staggerChildren (300ms)
  3. "à célébrer les 50 ans de Carole" fade-in (1200ms)
  4. "à Saint-Tropez 🌴" slide-up + fade en or #C9A84C (1800ms)
  5. "3 · 4 · 5 Juillet · Vol privé" uppercase tracking-widest (2400ms)
  6. Bouton CTA or "Découvrir mon invitation →" (3000ms)
  7. Icône avion oscillante (3500ms)
- Typographie : Cormorant Garamond italic 300 pour "Tu es invitée", clamp(3.5rem,7vw,7rem)
- Bouton CTA : scroll vers #boarding-pass au clic
