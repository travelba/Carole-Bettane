import { put } from '@vercel/blob';
import type { GeneratedPDF, UploadedPDF } from '@/types/registration';

/**
 * Upload les PDFs générés sur Vercel Blob et renvoie leurs URLs publiques.
 * Ces URLs servent uniquement à WhatsApp (l'email utilise les pièces jointes).
 *
 * Résilience : si le Blob échoue, on lève l'erreur — l'appelant (route API)
 * doit continuer SANS WhatsApp (try/catch côté route).
 */
export async function uploadToBlob(
  pdfs: GeneratedPDF[],
  bookingId: string
): Promise<UploadedPDF[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN manquant');
  }

  const uploaded = await Promise.all(
    pdfs.map(async (pdf) => {
      const blob = await put(`${bookingId}/${pdf.filename}`, pdf.buffer, {
        access: 'public',
        contentType: 'application/pdf',
        token,
        addRandomSuffix: false,
      });

      return {
        filename: pdf.filename,
        url: blob.url,
        direction: pdf.direction,
        passenger: pdf.passenger,
      } satisfies UploadedPDF;
    })
  );

  return uploaded;
}
