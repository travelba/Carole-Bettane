import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Riviera Private Airways · Les 50 ans de Carole à Saint-Tropez',
  description:
    "Invitation exclusive en classe Première pour célébrer les 50 ans de Carole à Saint-Tropez, du 3 au 5 juillet. Organisé par Travel Booking Agency.",
  openGraph: {
    title: 'Tu es invitée — les 50 ans de Carole à Saint-Tropez',
    description:
      'Embarquement immédiat en classe Première · Riviera Private Airways by Travel Booking Agency',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#1A1612',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={cormorant.variable}>
      <body>{children}</body>
    </html>
  );
}
