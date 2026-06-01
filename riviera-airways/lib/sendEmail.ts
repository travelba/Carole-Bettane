import { Resend } from 'resend';
import { ConfirmationEmail } from '@/emails/ConfirmationEmail';
import { AgencyNotificationEmail } from '@/emails/AgencyNotificationEmail';
import { FLIGHT_DATA } from '@/types/registration';
import type {
  Contact,
  GeneratedPDF,
  Passenger,
} from '@/types/registration';

/**
 * Envoi des emails via Resend.
 * - Email invité : billets en pièces jointes (PDFs individuels).
 * - Email agence : notification vers contact@travelba.fr.
 *
 * Résilience : si l'email invité échoue, la route renvoie une 500.
 */

// L'adresse d'expédition DOIT appartenir à un domaine vérifié sur Resend.
// Tant que `travelba.fr` n'est pas vérifié, on retombe sur l'adresse de test
// `onboarding@resend.dev` (qui n'envoie qu'à l'adresse du compte Resend).
const SENDER = process.env.SENDER_EMAIL ?? 'onboarding@resend.dev';
const FROM = `Riviera Private Airways · Travel Booking Agency <${SENDER}>`;
const REPLY_TO = process.env.AGENCY_EMAIL ?? 'contact@travelba.fr';

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('RESEND_API_KEY manquant');
  }
  return new Resend(key);
}

export interface SendConfirmationParams {
  contact: Contact;
  passengers: Passenger[];
  bookingId: string;
  pdfs: GeneratedPDF[];
}

export async function sendConfirmationEmail({
  contact,
  passengers,
  bookingId,
  pdfs,
}: SendConfirmationParams): Promise<void> {
  const resend = getResend();

  const attachments = pdfs.map((pdf) => ({
    filename: pdf.filename,
    content: pdf.buffer,
  }));

  const { error } = await resend.emails.send({
    from: FROM,
    to: contact.email,
    replyTo: REPLY_TO,
    subject: `✈️ Vos billets — Saint-Tropez · ${passengers.length} passager(s) · ${FLIGHT_DATA.aller.code}`,
    react: ConfirmationEmail({
      prenom: contact.prenom,
      bookingId,
      passengers,
    }),
    attachments,
  });

  if (error) {
    throw new Error(`Resend (invité) a échoué : ${error.message}`);
  }
}

export interface SendAgencyParams {
  contact: Contact;
  passengers: Passenger[];
  bookingId: string;
  whatsappSent: boolean;
}

export async function sendAgencyNotification({
  contact,
  passengers,
  bookingId,
  whatsappSent,
}: SendAgencyParams): Promise<void> {
  const resend = getResend();
  const to = process.env.AGENCY_EMAIL ?? 'contact@travelba.fr';

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    replyTo: contact.email,
    subject: `🆕 ${contact.prenom} ${contact.nom} · ${passengers.length} pax · ${bookingId}`,
    react: AgencyNotificationEmail({
      contact,
      passengers,
      bookingId,
      whatsappSent,
    }),
  });

  if (error) {
    throw new Error(`Resend (agence) a échoué : ${error.message}`);
  }
}
