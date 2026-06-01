Crée `components/BoardingPassPreview.tsx`.

SPECS :
- Animation entrée au scroll (Intersection Observer) :
  initial: { y:60, opacity:0, rotateX:-20, filter:'blur(8px)' }
  final:   { y:0,  opacity:1, rotateX:0,   filter:'blur(0)' }
  spring: { stiffness:80, damping:20 }
- Hover : rotation 3D légère suivant position souris (±8deg, perspective 1000px)
- Design : fond #231F1A, border or/30%, border-radius 12px, max-width 680px
- Deux colonnes séparées par trait pointillé or vertical
- Colonne gauche : codes IATA ORY→TLN en Cormorant Garamond 4xl, horaires, infos vol
- Colonne droite : "PASSAGER" label + "Votre nom ici" italic champagne/50% + "PREMIÈRE ★"
- Bas : code-barres SVG décoratif + mention anniversaire
- Bouton sous le billet : scroll vers #checkin-form
