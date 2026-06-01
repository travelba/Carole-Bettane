/**
 * Types métier — Riviera Private Airways.
 * Source de vérité partagée entre le front (formulaire), les routes API,
 * la génération PDF, les emails et WhatsApp.
 */

export type PassengerType = 'Adulte' | 'Enfant';

export interface Passenger {
  nom: string;
  prenom: string;
  dateNaissance: string; // JJ/MM/AAAA
  type: PassengerType;
}

export interface Contact {
  nom: string;
  prenom: string;
  dateNaissance: string; // JJ/MM/AAAA
  email: string;
  telephone?: string; // normalisé +33...
}

export interface Registration {
  contact: Contact;
  passengers: Passenger[];
  consent: true;
}

/** Sens d'un vol. */
export type FlightDirection = 'aller' | 'retour';

/** Données statiques d'un vol (immuables). */
export interface Flight {
  code: string;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  dep: string;
  arr: string;
  date: string;
}

export const FLIGHT_DATA: Record<FlightDirection, Flight> = {
  aller: {
    code: 'TO7020',
    from: 'ORY',
    fromCity: 'Paris Orly',
    to: 'TLN',
    toCity: 'Toulon Hyères',
    dep: '09:45',
    arr: '11:15',
    date: '03 JUL 2025',
  },
  retour: {
    code: 'AF7315',
    from: 'NCE',
    fromCity: "Nice Côte d'Azur",
    to: 'CDG',
    toCity: 'Paris CDG',
    dep: '17:55',
    arr: '19:30',
    date: '05 JUL 2025',
  },
};

/** Un billet = un passager sur un vol donné. */
export interface BoardingPassData {
  passenger: Passenger;
  flight: Flight;
  direction: FlightDirection;
  bookingId: string;
  seat: string;
}

/** PDF généré côté serveur, prêt à être attaché / uploadé. */
export interface GeneratedPDF {
  filename: string;
  buffer: Buffer;
  direction: FlightDirection;
  passenger: Passenger;
}

/** PDF uploadé sur Vercel Blob (URL publique pour WhatsApp). */
export interface UploadedPDF {
  filename: string;
  url: string;
  direction: FlightDirection;
  passenger: Passenger;
}

/** Réponse de l'API /api/register. */
export interface RegisterSuccessResponse {
  success: true;
  bookingId: string;
  passengers: Passenger[];
  whatsappSent: boolean;
}

export interface RegisterErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;

/** Résumé du nombre de passagers, ex: "2 adultes · 1 enfant". */
export interface PassengerCount {
  adultes: number;
  enfants: number;
  total: number;
}

export function countPassengers(passengers: Passenger[]): PassengerCount {
  const adultes = passengers.filter((p) => p.type === 'Adulte').length;
  const enfants = passengers.filter((p) => p.type === 'Enfant').length;
  return { adultes, enfants, total: passengers.length };
}

/**
 * Attribution déterministe d'un siège (rangées 1-9, sièges A/C/D/F).
 * Partagée entre la génération serveur (PDF email) et le téléchargement client,
 * afin que les sièges soient identiques partout.
 */
export function seatForPassenger(index: number, direction: FlightDirection): string {
  const letters = ['A', 'C', 'D', 'F'];
  const row = Math.floor(index / letters.length) + 1;
  const letter = letters[index % letters.length];
  const offset = direction === 'retour' ? 1 : 0;
  return `${row + offset}${letter}`;
}

export function formatPassengerCount(passengers: Passenger[]): string {
  const { adultes, enfants } = countPassengers(passengers);
  const parts: string[] = [];
  if (adultes > 0) parts.push(`${adultes} adulte${adultes > 1 ? 's' : ''}`);
  if (enfants > 0) parts.push(`${enfants} enfant${enfants > 1 ? 's' : ''}`);
  return parts.join(' · ') || '0 passager';
}
