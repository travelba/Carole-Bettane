'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { FLIGHT_DATA, type FlightDirection } from '@/types/registration';

interface BoardingPassPreviewProps {
  direction?: FlightDirection;
}

/**
 * Billet d'aperçu.
 * - Entrée au scroll via IntersectionObserver + transition CSS (fiable, même
 *   en onglet d'arrière-plan, contrairement aux animations JS orchestrées).
 * - Survol : léger tilt 3D suivant la position de la souris (±8°, perspective 1000px).
 */
export function BoardingPassPreview({ direction = 'aller' }: BoardingPassPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const flight = FLIGHT_DATA[direction];

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    // Robustesse : pas d'IO ou reduced-motion → affichage immédiat (pas d'animation).
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof IntersectionObserver === 'undefined' || reduce) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 8, ry: px * 8 });
  }

  function handleLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  function scrollToForm() {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document
      .getElementById('checkin-form')
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  const wrapperStyle: CSSProperties = {
    perspective: 1000,
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'translateY(0) rotateX(0deg)'
      : 'translateY(60px) rotateX(-20deg)',
    filter: visible ? 'blur(0)' : 'blur(8px)',
    transformStyle: 'preserve-3d',
    transition:
      'transform 0.85s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.7s ease-out, filter 0.7s ease-out',
  };

  const cardStyle: CSSProperties = {
    maxWidth: 680,
    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.2s ease-out',
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={wrapperRef} style={wrapperStyle} className="w-full">
        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={cardStyle}
          className="mx-auto w-full overflow-hidden rounded-xl border border-[rgba(201,168,76,0.3)] bg-[#231F1A] shadow-2xl"
        >
          {/* Deux colonnes séparées par un trait pointillé or vertical */}
          <div className="flex">
            {/* Colonne gauche */}
            <div className="flex-1 p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
                    Riviera Private Airways
                  </p>
                  <p className="mt-1 text-[10px] tracking-widest text-[#7a6e64]">
                    by Travel Booking Agency
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div>
                  <p className="font-display text-4xl text-[#F5E6C8] sm:text-5xl">
                    {flight.from}
                  </p>
                  <p className="mt-1 text-xs text-[#7a6e64]">{flight.fromCity}</p>
                  <p className="mt-2 text-sm font-semibold text-[#C9A84C]">
                    {flight.dep}
                  </p>
                </div>
                <div className="mx-3 flex flex-1 items-center text-[#C9A84C]">
                  <span className="h-px flex-1 bg-[rgba(201,168,76,0.4)]" />
                  <span className="px-2 text-lg">✈</span>
                  <span className="h-px flex-1 bg-[rgba(201,168,76,0.4)]" />
                </div>
                <div className="text-right">
                  <p className="font-display text-4xl text-[#F5E6C8] sm:text-5xl">
                    {flight.to}
                  </p>
                  <p className="mt-1 text-xs text-[#7a6e64]">{flight.toCity}</p>
                  <p className="mt-2 text-sm font-semibold text-[#C9A84C]">
                    {flight.arr}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[rgba(201,168,76,0.2)] pt-4">
                <Info label="Vol" value={flight.code} />
                <Info label="Date" value={flight.date} />
                <Info label="Embarquement" value={flight.dep} />
              </div>
            </div>

            {/* Séparateur pointillé or vertical */}
            <div
              aria-hidden
              className="my-4 w-px border-l border-dashed border-[rgba(201,168,76,0.5)]"
            />

            {/* Colonne droite */}
            <div className="flex w-40 flex-col justify-between p-5 sm:w-48">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#7a6e64]">
                  Passager
                </p>
                <p className="mt-2 font-display text-2xl italic text-[rgba(245,230,200,0.5)]">
                  Votre nom ici
                </p>
              </div>
              <div className="mt-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#C9A84C] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1A1612]">
                  Saint-Tropez <span aria-hidden>★</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bas : code-barres décoratif + mention anniversaire */}
          <div className="flex items-center justify-between gap-4 border-t border-dashed border-[rgba(201,168,76,0.3)] bg-[#2C2620] px-6 py-4 sm:px-8">
            <Barcode />
            <p className="text-right text-[10px] uppercase tracking-widest text-[#7a6e64]">
              Week-end Bobo Bling
              <span className="block text-[#C9A84C]">Saint-Tropez · 03–05 JUL 2025</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bouton sous le billet */}
      <button
        type="button"
        onClick={scrollToForm}
        className="mt-10 rounded-full border border-[rgba(201,168,76,0.4)] px-8 py-3 text-sm uppercase tracking-wide text-[#C9A84C] transition-colors duration-200 hover:bg-[#C9A84C] hover:text-[#1A1612]"
      >
        Récupérer mon billet →
      </button>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-widest text-[#7a6e64]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#F5E6C8]">{value}</p>
    </div>
  );
}

/** Code-barres SVG purement décoratif. */
function Barcode() {
  const bars = Array.from({ length: 28 }, (_, i) => ({
    w: (i % 4) + 1,
    gap: ((i * 7) % 3) + 1,
  }));
  let x = 0;
  return (
    <svg
      width="160"
      height="40"
      viewBox="0 0 160 40"
      role="img"
      aria-label="Code-barres décoratif"
      className="text-[#F5E6C8]"
    >
      {bars.map((b, i) => {
        const rectX = x;
        x += b.w + b.gap;
        return (
          <rect
            key={i}
            x={rectX}
            y={i % 2 === 0 ? 0 : 6}
            width={b.w}
            height={i % 2 === 0 ? 40 : 28}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}

export default BoardingPassPreview;
