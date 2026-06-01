'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  FLIGHT_DATA,
  seatForPassenger,
  type FlightDirection,
  type Passenger,
} from '@/types/registration';

interface SuccessScreenProps {
  bookingId: string;
  passengers: Passenger[];
  whatsappSent: boolean;
}

const CONFETTI_COLORS = ['#C9A84C', '#F5E6C8', '#B76E79', '#FFFFFF'];

/** Mini boarding pass (version réduite, max 420px) pour un passager. */
function MiniBoardingPass({
  passenger,
  index,
  bookingId,
}: {
  passenger: Passenger;
  index: number;
  bookingId: string;
}) {
  const isChild = passenger.type === 'Enfant';

  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.25)] bg-gradient-to-br from-[#231F1A] to-[#1A1612] text-left shadow-[0_20px_60px_-30px_rgba(201,168,76,0.6)]">
      <div className="flex items-center justify-between px-5 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
            Riviera Private Airways
          </p>
          <p className="text-[9px] uppercase tracking-widest text-[#7a6e64]">
            by Travel Booking Agency
          </p>
        </div>
        <span className="rounded-full bg-[#C9A84C] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#1A1612]">
          Saint-Tropez ★
        </span>
      </div>

      <div className="flex items-center justify-between px-5 pb-1 pt-3">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-[#7a6e64]">
            Passager
          </p>
          <p className="font-display text-lg leading-tight text-[#F5E6C8]">
            {passenger.prenom} {passenger.nom.toUpperCase()}
          </p>
        </div>
        {isChild && (
          <span className="rounded-full border border-[#B76E79] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#B76E79]">
            🧒 Enfant
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2 px-5">
        {(['aller', 'retour'] as const).map((dir) => {
          const f = FLIGHT_DATA[dir];
          const seat = seatForPassenger(index, dir);
          return (
            <div
              key={dir}
              className="flex items-center justify-between rounded-lg bg-[#2C2620] px-3 py-2"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-base text-[#F5E6C8]">
                  {f.from}
                </span>
                <span className="text-[#C9A84C]">→</span>
                <span className="font-display text-base text-[#F5E6C8]">
                  {f.to}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#7a6e64]">
                  {dir === 'aller' ? 'Aller' : 'Retour'} · {f.code}
                </p>
                <p className="text-[10px] text-[#C9A84C]">
                  {f.dep} · Siège {seat}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 border-t border-dashed border-[rgba(201,168,76,0.25)] px-5 py-3">
        <div aria-hidden className="flex h-7 flex-1 items-end gap-[2px]">
          {Array.from({ length: 36 }).map((_, i) => (
            <span
              key={i}
              className="block w-[2px] bg-[#F5E6C8]"
              style={{ height: `${20 + ((i * 37) % 60)}%`, opacity: 0.55 }}
            />
          ))}
        </div>
        <p className="text-[9px] uppercase tracking-widest text-[#7a6e64]">
          {bookingId}
        </p>
      </div>
    </div>
  );
}

export function SuccessScreen({
  bookingId,
  passengers,
  whatsappSent,
}: SuccessScreenProps) {
  const reduceMotion = useReducedMotion();
  const [downloading, setDownloading] = useState<string | null>(null);

  const firstName = passengers[0]?.prenom ?? '';

  // 1. 0ms — Confettis aux couleurs de la marque (180 particules)
  useEffect(() => {
    if (reduceMotion) return;
    confetti({
      particleCount: 180,
      spread: 90,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.35 },
      colors: CONFETTI_COLORS,
      scalar: 1.05,
      ticks: 220,
    });
  }, [reduceMotion]);

  async function handleDownload(
    passenger: Passenger,
    index: number,
    direction: FlightDirection
  ) {
    const key = `${index}-${direction}`;
    setDownloading(key);
    try {
      // Import dynamique : @react-pdf/renderer n'est chargé qu'au 1er clic,
      // ce qui l'exclut du bundle initial de la page.
      const { downloadBoardingPass } = await import('@/lib/downloadBoardingPass');
      await downloadBoardingPass({ passenger, index, direction, bookingId });
    } finally {
      setDownloading(null);
    }
  }

  const delay = (s: number) => (reduceMotion ? 0 : s);

  // Le dernier billet apparaît à 0.9 + (n-1)*0.3 ; le badge final juste après.
  const finalDelay = 0.9 + Math.max(passengers.length - 1, 0) * 0.3 + 0.3;

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#1A1612] px-6 py-20">
      <div className="w-full max-w-2xl text-center">
        {/* 2. 300ms — Titre de bienvenue (scale-in) */}
        <motion.h1
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: delay(0.3),
            duration: reduceMotion ? 0 : 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-display text-4xl italic text-[#F5E6C8] sm:text-5xl"
        >
          Bienvenue à bord, {firstName} ! 🥂
        </motion.h1>

        {/* 3. 600ms — Confirmation d'envoi */}
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay(0.6), duration: reduceMotion ? 0 : 0.5 }}
          className="mx-auto mt-4 max-w-md text-sm text-[#7a6e64]"
        >
          Vos billets ont été envoyés par email
          {whatsappSent ? ' et WhatsApp' : ''}.
        </motion.p>

        {/* 4. 900ms — Les billets s'impriment en séquence (300ms d'écart) */}
        <div className="mt-12 space-y-10">
          {passengers.map((p, index) => (
            <motion.div
              key={`${p.prenom}-${p.nom}-${index}`}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: delay(0.9 + index * 0.3),
                duration: reduceMotion ? 0 : 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <MiniBoardingPass
                passenger={p}
                index={index}
                bookingId={bookingId}
              />

              <div className="mx-auto mt-3 flex max-w-[420px] gap-3">
                <button
                  type="button"
                  onClick={() => handleDownload(p, index, 'aller')}
                  disabled={downloading === `${index}-aller`}
                  className="flex-1 rounded-lg border border-[rgba(201,168,76,0.4)] px-3 py-2 text-xs uppercase tracking-wide text-[#C9A84C] transition-colors hover:bg-[#2C2620] disabled:opacity-50"
                >
                  {downloading === `${index}-aller`
                    ? '…'
                    : `↓ Billet aller ${FLIGHT_DATA.aller.code}`}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(p, index, 'retour')}
                  disabled={downloading === `${index}-retour`}
                  className="flex-1 rounded-lg border border-[rgba(201,168,76,0.4)] px-3 py-2 text-xs uppercase tracking-wide text-[#C9A84C] transition-colors hover:bg-[#2C2620] disabled:opacity-50"
                >
                  {downloading === `${index}-retour`
                    ? '…'
                    : `↓ Retour ${FLIGHT_DATA.retour.code}`}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 5. Final — Badge bookingId + Confirmé */}
        <motion.div
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay(finalDelay), duration: reduceMotion ? 0 : 0.5 }}
          className="mt-14 flex flex-col items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C] bg-[rgba(201,168,76,0.1)] px-5 py-2 text-sm tracking-wide text-[#F5E6C8]">
            <span className="text-[#C9A84C]">{bookingId}</span>
            <span className="text-[#7a6e64]">·</span>
            <span className="font-semibold text-[#C9A84C]">Confirmé ✓</span>
          </span>
          <p className="text-xs text-[#7a6e64]">
            Organisé par Travel Booking Agency · contact@travelba.fr
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default SuccessScreen;
