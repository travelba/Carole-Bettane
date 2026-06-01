import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import { BoardingPassPDF } from '@/components/pdf/BoardingPassPDF';
import { FLIGHT_DATA, seatForPassenger } from '@/types/registration';
import type {
  FlightDirection,
  GeneratedPDF,
  Passenger,
} from '@/types/registration';

/**
 * Génère un PDF par passager ET par sens de vol (aller + retour).
 * Nommage : billet-{CODE}-{Prenom}-{NOM}.pdf
 * Jamais de ZIP — chaque PDF reste un fichier individuel.
 */
export interface GeneratePDFsParams {
  passengers: Passenger[];
  bookingId: string;
}

export async function generatePDFs({
  passengers,
  bookingId,
}: GeneratePDFsParams): Promise<GeneratedPDF[]> {
  const directions: FlightDirection[] = ['aller', 'retour'];
  const pdfs: GeneratedPDF[] = [];

  for (let i = 0; i < passengers.length; i++) {
    const passenger = passengers[i];
    for (const direction of directions) {
      const flight = FLIGHT_DATA[direction];
      const seat = seatForPassenger(i, direction);

      // BoardingPassPDF renvoie un <Document> ; on aide le typage de react-pdf.
      const element = createElement(BoardingPassPDF, {
        passenger,
        flight,
        direction,
        bookingId,
        seat,
      }) as unknown as ReactElement<DocumentProps>;

      const buffer = await renderToBuffer(element);

      const filename = `billet-${flight.code}-${passenger.prenom}-${passenger.nom.toUpperCase()}.pdf`;

      pdfs.push({
        filename,
        buffer: Buffer.from(buffer),
        direction,
        passenger,
      });
    }
  }

  return pdfs;
}
