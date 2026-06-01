import type { Contact, Passenger } from '@/types/registration';

/**
 * Envoie l'inscription au Google Apps Script déployé en "Application Web".
 * Règle métier : 1 ligne par passager dans la feuille (pas 1 par réservation).
 *
 * Le script Apps Script (généré via le prompt 06) doit renvoyer un JSON :
 *   { bookingId: "BK2025-0042" }
 *
 * Si Sheets échoue, l'inscription complète échoue (cf. règle de résilience API).
 */
export interface SheetsPayload {
  contact: Contact;
  passengers: Passenger[];
}

export interface SheetsResult {
  bookingId: string;
}

export async function submitToSheets({
  contact,
  passengers,
}: SheetsPayload): Promise<SheetsResult> {
  const url = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_APPS_SCRIPT_URL manquant');
  }

  // Une ligne par passager : on aplatit en répétant les infos de contact.
  const rows = passengers.map((p, index) => ({
    nom: p.nom,
    prenom: p.prenom,
    dateNaissance: p.dateNaissance,
    type: p.type,
    estContact: index === 0,
    contactEmail: contact.email,
    contactTelephone: contact.telephone ?? '',
    horodatage: new Date().toISOString(),
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows, totalPassengers: passengers.length }),
    // Apps Script redirige (302) ; on suit la redirection.
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Google Sheets a répondu ${response.status}`);
  }

  const data = (await response.json()) as Partial<SheetsResult>;
  if (!data.bookingId) {
    throw new Error('Google Sheets n\'a pas renvoyé de bookingId');
  }

  return { bookingId: data.bookingId };
}
