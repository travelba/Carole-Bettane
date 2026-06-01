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
  title: 'Riviera Private Airways · Week-end Bobo Bling à Saint-Tropez',
  description:
    "Invitation exclusive pour le Week-end Bobo Bling à Saint-Tropez, du 3 au 5 juillet. Organisé par Travel Booking Agency.",
  openGraph: {
    title: 'Week-end Bobo Bling à Saint-Tropez',
    description:
      'Embarquement immédiat · Riviera Private Airways by Travel Booking Agency',
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
