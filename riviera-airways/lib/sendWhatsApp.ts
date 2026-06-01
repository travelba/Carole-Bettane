import twilio from 'twilio';
import { FLIGHT_DATA, formatPassengerCount } from '@/types/registration';
import type { Passenger, UploadedPDF } from '@/types/registration';

/**
 * Envoi WhatsApp via Twilio + template Meta approuvé (boarding_confirmation_fr).
 *
 * IMPORTANT (règle métier) : cet envoi est NON BLOQUANT.
 * La route API l'enveloppe dans un try/catch séparé : un échec ici
 * ne doit jamais empêcher la confirmation de l'inscription.
 *
 * Variables du template :
 *   {{1}} = prénom
 *   {{2}} = bookingId
 *   {{3}} = "2 adultes · 1 enfant"
 *   {{4}} = URL du PDF (lien aller)
 */
export interface SendWhatsAppParams {
  telephone: string;
  prenom: string;
  bookingId: string;
  passengers: Passenger[];
  uploadedPDFs: UploadedPDF[];
}

export async function sendWhatsApp({
  telephone,
  prenom,
  bookingId,
  passengers,
  uploadedPDFs,
}: SendWhatsAppParams): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
  const templateSid = process.env.TWILIO_TEMPLATE_SID;

  if (!accountSid || !authToken || !fromNumber || !templateSid) {
    throw new Error('Configuration Twilio incomplète');
  }

  const client = twilio(accountSid, authToken);

  // Lien du billet aller (premier PDF aller dispo), sinon le premier dispo.
  const allerPdf =
    uploadedPDFs.find((p) => p.direction === 'aller') ?? uploadedPDFs[0];
  const pdfUrl = allerPdf?.url ?? `Vol ${FLIGHT_DATA.aller.code}`;

  const contentVariables = JSON.stringify({
    '1': prenom,
    '2': bookingId,
    '3': formatPassengerCount(passengers),
    '4': pdfUrl,
  });

  const to = telephone.startsWith('whatsapp:')
    ? telephone
    : `whatsapp:${telephone}`;

  await client.messages.create({
    from: fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`,
    to,
    contentSid: templateSid,
    contentVariables,
  });
}
