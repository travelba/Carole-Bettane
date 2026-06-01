import { pdf, type DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import { BoardingPassPDF } from '@/components/pdf/BoardingPassPDF';
import { FLIGHT_DATA, seatForPassenger } from '@/types/registration';
import type { FlightDirection, Passenger } from '@/types/registration';

/**
 * Génère et télécharge le billet PDF d'UN passager pour UN sens de vol.
 * Toujours un fichier individuel — jamais de ZIP.
 *
 * Pendant côté client de `lib/generatePDFs.ts` (qui, lui, rend des buffers
 * côté serveur). Ici on utilise l'API navigateur `pdf().toBlob()`.
 */
export interface DownloadBoardingPassParams {
  passenger: Passenger;
  index: number;
  direction: FlightDirection;
  bookingId: string;
}

export async function downloadBoardingPass({
  passenger,
  index,
  direction,
  bookingId,
}: DownloadBoardingPassParams): Promise<void> {
  const flight = FLIGHT_DATA[direction];
  const seat = seatForPassenger(index, direction);

  // BoardingPassPDF renvoie un <Document> ; on aide le typage de react-pdf.
  const element = createElement(BoardingPassPDF, {
    passenger,
    flight,
    direction,
    bookingId,
    seat,
  }) as unknown as ReactElement<DocumentProps>;

  const blob = await pdf(element).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `billet-${flight.code}-${passenger.prenom}-${passenger.nom.toUpperCase()}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
