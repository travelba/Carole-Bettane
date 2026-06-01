import { NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/schemas/registration.schema';
import { submitToSheets } from '@/lib/submitToSheets';
import { generatePDFs } from '@/lib/generatePDFs';
import { uploadToBlob } from '@/lib/uploadToBlob';
import {
  sendConfirmationEmail,
  sendAgencyNotification,
} from '@/lib/sendEmail';
import { sendWhatsApp } from '@/lib/sendWhatsApp';
import type {
  Contact,
  Passenger,
  RegisterResponse,
  UploadedPDF,
} from '@/types/registration';

// @react-pdf/renderer nécessite le runtime Node.js (pas Edge).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * POST /api/register
 *
 * Ordre STRICT (cf. .cursor/rules/05-api-routes) :
 * 1. Valider body (Zod)
 * 2. Construire la liste passagers (contact = passager 1)
 * 3. Google Sheets → bookingId
 * 4. Générer les PDFs (aller + retour × chaque passager)
 * 5. Upload Vercel Blob (URLs pour WhatsApp)
 * 6. Email confirmation invité (PDFs en pièces jointes)
 * 7. Notification agence
 * 8. WhatsApp si téléphone fourni (non bloquant)
 */
export async function POST(request: Request): Promise<NextResponse<RegisterResponse>> {
  // 1. Validation Zod
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Corps de requête JSON invalide' },
      { status: 400 }
    );
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Données invalides',
        details: parsed.error.flatten(),
      },
      { status: 422 }
    );
  }

  const { contact: parsedContact, passengers: extraPassengers } = parsed.data;

  // 2. Liste passagers : contact = passager 1 (toujours Adulte)
  const contact: Contact = {
    nom: parsedContact.nom,
    prenom: parsedContact.prenom,
    dateNaissance: parsedContact.dateNaissance,
    email: parsedContact.email,
    telephone: parsedContact.telephone,
  };

  const passengers: Passenger[] = [
    {
      nom: contact.nom,
      prenom: contact.prenom,
      dateNaissance: contact.dateNaissance,
      type: 'Adulte',
    },
    ...extraPassengers,
  ];

  // 3. Google Sheets → bookingId (échec ici = échec total)
  let bookingId: string;
  try {
    const result = await submitToSheets({ contact, passengers });
    bookingId = result.bookingId;
  } catch (error) {
    console.error('[register] Google Sheets a échoué :', error);
    return NextResponse.json(
      { success: false, error: "L'enregistrement a échoué. Merci de réessayer." },
      { status: 500 }
    );
  }

  // 4. Génération des PDFs (aller + retour par passager)
  let pdfs;
  try {
    pdfs = await generatePDFs({ passengers, bookingId });
  } catch (error) {
    console.error('[register] Génération PDF a échoué :', error);
    return NextResponse.json(
      { success: false, error: 'La génération des billets a échoué.' },
      { status: 500 }
    );
  }

  // 5. Upload Vercel Blob (résilient : si échec → pas de WhatsApp)
  let uploadedPDFs: UploadedPDF[] = [];
  try {
    uploadedPDFs = await uploadToBlob(pdfs, bookingId);
  } catch (error) {
    console.error('[register] Upload Blob a échoué (WhatsApp désactivé) :', error);
    uploadedPDFs = [];
  }

  // 6. Email de confirmation invité (échec ici = 500)
  try {
    await sendConfirmationEmail({ contact, passengers, bookingId, pdfs });
  } catch (error) {
    console.error('[register] Email invité a échoué :', error);
    return NextResponse.json(
      { success: false, error: "L'envoi de l'email de confirmation a échoué." },
      { status: 500 }
    );
  }

  // 8. WhatsApp — non bloquant, uniquement si téléphone + Blob OK
  let whatsappSent = false;
  if (contact.telephone && uploadedPDFs.length > 0) {
    try {
      await sendWhatsApp({
        telephone: contact.telephone,
        prenom: contact.prenom,
        bookingId,
        passengers,
        uploadedPDFs,
      });
      whatsappSent = true;
    } catch (error) {
      console.error('[register] WhatsApp a échoué (non bloquant) :', error);
    }
  }

  // 7. Notification agence (non bloquante pour la réponse client)
  try {
    await sendAgencyNotification({ contact, passengers, bookingId, whatsappSent });
  } catch (error) {
    console.error('[register] Notification agence a échoué (non bloquant) :', error);
  }

  return NextResponse.json(
    { success: true, bookingId, passengers, whatsappSent },
    { status: 200 }
  );
}
