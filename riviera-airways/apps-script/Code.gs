/**
 * ============================================================================
 *  Riviera Private Airways — Réception des inscriptions (Google Apps Script)
 * ============================================================================
 *
 *  RÔLE
 *  ----
 *  Reçoit le POST envoyé par `lib/submitToSheets.ts`, écrit 1 ligne par
 *  passager dans l'onglet « Inscriptions », et renvoie le bookingId attribué
 *  à la réservation sous la forme JSON : { "bookingId": "BK2025-0042" }.
 *
 *  Format du POST attendu (Content-Type: application/json) :
 *    {
 *      "rows": [
 *        {
 *          "nom": "Durand",
 *          "prenom": "Marie",
 *          "dateNaissance": "12/05/1975",
 *          "type": "Adulte",                // "Adulte" | "Enfant"
 *          "estContact": true,               // true pour le passager 1
 *          "contactEmail": "marie@mail.com",
 *          "contactTelephone": "+33612345678",
 *          "horodatage": "2025-07-01T10:00:00.000Z"
 *        },
 *        ...
 *      ],
 *      "totalPassengers": 2
 *    }
 *
 *  ----------------------------------------------------------------------------
 *  DÉPLOIEMENT (à faire une seule fois)
 *  ----------------------------------------------------------------------------
 *  1. Ouvrez votre Google Sheet, puis : Extensions ▸ Apps Script.
 *  2. Collez ce fichier dans l'éditeur (remplacez tout le contenu), Enregistrez.
 *  3. Lancez une fois la fonction `testDoPost` (menu ▸ Exécuter) pour autoriser
 *     les permissions demandées par Google.
 *  4. Déployer ▸ Nouveau déploiement ▸ type « Application Web ».
 *       - Description       : Riviera inscriptions
 *       - Exécuter en tant que : Moi
 *       - Qui a accès       : Tout le monde
 *  5. Copiez l'URL « /exec » fournie et placez-la dans `.env.local` :
 *       NEXT_PUBLIC_APPS_SCRIPT_URL="https://script.google.com/macros/s/XXXX/exec"
 *  6. À chaque modification du code : Déployer ▸ Gérer les déploiements ▸
 *     (crayon) ▸ Nouvelle version ▸ Déployer. (Sinon l'URL sert l'ancien code.)
 * ============================================================================
 */

var SHEET_INSCRIPTIONS = 'Inscriptions';
var SHEET_RESUME = 'Résumé';
var ENFANT_COLOR = '#B76E79';

var HEADERS = [
  'Timestamp',
  'BookingID',
  'Email',
  'Tel',
  'Nom',
  'Prénom',
  'DDN',
  'Type',
  'N°Pax',
  'TotalPax',
];

/**
 * Point d'entrée HTTP. Appelé par le frontend lors d'une inscription.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Empêche deux réservations simultanées d'obtenir le même bookingId.
  lock.waitLock(30000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOutput({ error: 'Corps de requête vide' });
    }

    var payload = JSON.parse(e.postData.contents);
    var rows = payload.rows || [];
    var totalPax = payload.totalPassengers || rows.length;

    if (rows.length === 0) {
      return jsonOutput({ error: 'Aucun passager' });
    }

    var sheet = getOrCreateInscriptions();
    var bookingId = nextBookingId_(sheet);

    var firstRow = sheet.getLastRow() + 1;
    var values = rows.map(function (r, index) {
      return [
        r.horodatage ? new Date(r.horodatage) : new Date(),
        bookingId,
        r.contactEmail || '',
        r.contactTelephone || '',
        r.nom || '',
        r.prenom || '',
        r.dateNaissance || '',
        r.type || '',
        index + 1, // N°Pax dans la réservation
        totalPax,
      ];
    });

    sheet
      .getRange(firstRow, 1, values.length, HEADERS.length)
      .setValues(values);

    // Mise en forme : lignes Enfant en italique + couleur rose-gold.
    rows.forEach(function (r, index) {
      if (r.type === 'Enfant') {
        sheet
          .getRange(firstRow + index, 1, 1, HEADERS.length)
          .setFontStyle('italic')
          .setFontColor(ENFANT_COLOR);
      }
    });

    ensureResume_();

    return jsonOutput({ bookingId: bookingId });
  } catch (err) {
    return jsonOutput({ error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Retourne (et crée si besoin) l'onglet « Inscriptions » avec son en-tête.
 */
function getOrCreateInscriptions() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_INSCRIPTIONS);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_INSCRIPTIONS);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet
      .getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#1A1612')
      .setFontColor('#C9A84C');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Calcule le prochain bookingId séquentiel : "BK2025-" + numéro de réservation
 * unique, sur 4 chiffres (BK2025-0001, BK2025-0002, ...).
 */
function nextBookingId_(sheet) {
  var lastRow = sheet.getLastRow();
  var uniqueCount = 0;

  if (lastRow >= 2) {
    var ids = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
    var seen = {};
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i][0];
      if (id && !seen[id]) {
        seen[id] = true;
        uniqueCount++;
      }
    }
  }

  var next = uniqueCount + 1;
  return 'BK2025-' + String(next).padStart(4, '0');
}

/**
 * Crée / met à jour l'onglet « Résumé » avec des formules agrégées.
 */
function ensureResume_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_RESUME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_RESUME);
  }

  var rows = [
    ['Indicateur', 'Valeur'],
    ['Total inscrits', '=COUNTA(Inscriptions!E2:E)'],
    ['Réservations uniques', '=COUNTUNIQUE(Inscriptions!B2:B)'],
    ['Adultes', '=COUNTIF(Inscriptions!H2:H;"Adulte")'],
    ['Enfants', '=COUNTIF(Inscriptions!H2:H;"Enfant")'],
  ];

  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  sheet
    .getRange(1, 1, 1, 2)
    .setFontWeight('bold')
    .setBackground('#1A1612')
    .setFontColor('#C9A84C');
  sheet.getRange(2, 1, rows.length - 1, 1).setFontWeight('bold');
  sheet.autoResizeColumns(1, 2);
}

/**
 * Construit une réponse JSON pour ContentService.
 */
function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * ----------------------------------------------------------------------------
 *  TEST — simule une inscription sans passer par le frontend.
 *  Sélectionnez `testDoPost` dans la barre d'outils puis cliquez « Exécuter ».
 *  Vérifiez ensuite les onglets « Inscriptions » et « Résumé », puis le log
 *  (Affichage ▸ Journaux) pour voir le bookingId renvoyé.
 * ----------------------------------------------------------------------------
 */
function testDoPost() {
  var payload = {
    rows: [
      {
        nom: 'Durand',
        prenom: 'Marie',
        dateNaissance: '12/05/1975',
        type: 'Adulte',
        estContact: true,
        contactEmail: 'marie.durand@email.com',
        contactTelephone: '+33612345678',
        horodatage: new Date().toISOString(),
      },
      {
        nom: 'Durand',
        prenom: 'Lucas',
        dateNaissance: '08/09/2018',
        type: 'Enfant',
        estContact: false,
        contactEmail: 'marie.durand@email.com',
        contactTelephone: '+33612345678',
        horodatage: new Date().toISOString(),
      },
    ],
    totalPassengers: 2,
  };

  var e = { postData: { contents: JSON.stringify(payload) } };
  var response = doPost(e);
  Logger.log('Réponse doPost : ' + response.getContent());
}
