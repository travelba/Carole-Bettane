Génère le code Google Apps Script complet à coller dans Extensions > Apps Script.

CONTENU :
- Fonction doPost() : reçoit JSON, écrit dans onglet "Inscriptions"
- 1 ligne par passager avec colonnes : Timestamp | BookingID | Email | Tel | Nom | Prénom | DDN | Type | N°Pax | TotalPax
- bookingId : "BK2025-" + padStart(4, '0')
- Mise en forme auto : lignes Enfant en italic + couleur #B76E79
- Onglet "Résumé" avec formules : total inscrits, réservations uniques, adultes, enfants
- Instructions de déploiement en commentaire en haut du fichier

Inclure aussi le code de test (fonction testDoPost()) pour simuler une inscription sans le frontend.
