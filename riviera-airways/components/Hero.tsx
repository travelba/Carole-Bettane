'use client';

import type { CSSProperties } from 'react';
import { FLIGHT_DATA } from '@/types/registration';

interface HeroProps {
  /** Optionnel : callback déclenché au clic sur le CTA (en plus du scroll). */
  onReserve?: () => void;
}

const TITLE = 'Tu es invitée';

/** Petit helper pour positionner le délai d'animation d'un élément révélé. */
const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

export function Hero({ onReserve }: HeroProps) {
  const { aller, retour } = FLIGHT_DATA;

  function handleCTA() {
    onReserve?.();
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document
      .getElementById('boarding-pass')
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  // Délais échelonnés (total ~1.1s) — rapide et fiable.
  const letters = TITLE.split('');
  const lastLetterDelay = 0.1 + (letters.length - 1) * 0.035;

  return (
    <section
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#1A1612]"
      style={{ minHeight: '100dvh' }}
    >
      {/* Halo doré */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% -5%, rgba(201,168,76,0.20), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(to top, #1A1612, transparent)' }}
      />

      {/* Logo en haut à gauche */}
      <div
        className="hero-reveal absolute left-6 top-6 z-10 sm:left-10 sm:top-10"
        style={delay(0)}
      >
        <RivieraLogo />
      </div>

      {/* Contenu central */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* 1. "Tu es invitée" lettre par lettre */}
        <h1
          aria-label={TITLE}
          className="font-display font-light italic text-[#FDFAF4]"
          style={{ fontSize: 'clamp(3.25rem, 7vw, 6.5rem)', lineHeight: 1.05 }}
        >
          {letters.map((char, i) => (
            <span
              key={i}
              className="hero-reveal inline-block"
              style={delay(0.1 + i * 0.035)}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* 2. "à célébrer les 50 ans de Carole" */}
        <p
          className="hero-reveal mt-6 font-display text-2xl text-[#F5E6C8] sm:text-3xl"
          style={delay(Math.max(0.5, lastLetterDelay))}
        >
          à célébrer les 50 ans de Carole
        </p>

        {/* 3. "à Saint-Tropez 🌴" en or */}
        <p
          className="hero-reveal mt-2 font-display text-4xl font-medium text-[#C9A84C] sm:text-5xl"
          style={delay(0.62)}
        >
          à Saint-Tropez <span className="align-middle">🌴</span>
        </p>

        {/* 4. Dates */}
        <p
          className="hero-reveal mt-8 text-xs uppercase tracking-[0.45em] text-[#7a6e64] sm:text-sm"
          style={delay(0.74)}
        >
          3 · 4 · 5 Juillet · Vol privé
        </p>

        {/* 5. Cartes de vol */}
        <div
          className="hero-reveal mx-auto mt-10 grid max-w-lg grid-cols-2 gap-4 text-left"
          style={delay(0.86)}
        >
          {[aller, retour].map((f, idx) => (
            <div
              key={f.code}
              className="rounded-xl border border-[rgba(201,168,76,0.2)] bg-[#231F1A] p-4"
            >
              <p className="text-[10px] uppercase tracking-widest text-[#7a6e64]">
                {idx === 0 ? 'Aller' : 'Retour'} · {f.code}
              </p>
              <p className="mt-2 font-display text-2xl text-[#F5E6C8]">
                {f.from} <span className="text-[#C9A84C]">→</span> {f.to}
              </p>
              <p className="mt-1 text-xs text-[#7a6e64]">
                {f.dep} – {f.arr} · {f.date}
              </p>
            </div>
          ))}
        </div>

        {/* 6. CTA */}
        <div className="hero-reveal mt-12" style={delay(0.98)}>
          <button
            type="button"
            onClick={handleCTA}
            className="group rounded-full bg-[#C9A84C] px-10 py-4 text-sm font-semibold uppercase tracking-wide text-[#1A1612] transition-all duration-200 hover:bg-[#E2C06A]"
          >
            Découvrir mon invitation
            <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
          <p className="mt-4 text-xs text-[#7a6e64]">
            Invitation exclusive · Classe Première
          </p>
        </div>
      </div>

      {/* 7. Avion oscillant */}
      <div
        className="hero-reveal absolute bottom-8 left-1/2 -translate-x-1/2 text-[#C9A84C]"
        style={delay(1.1)}
      >
        <div className="plane-float text-2xl" aria-hidden>
          ✈
        </div>
      </div>
    </section>
  );
}

/** Logo "Riviera Private Airways" + sous-titre agence. */
function RivieraLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="34"
        height="34"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="24" cy="24" r="22" stroke="#C9A84C" strokeWidth="1.5" />
        <path
          d="M12 26.5l9-1.5 4-9c.4-.9 1.7-.9 2.1 0l1.6 3.6 6.7-1.1c1-.2 1.7.9 1.1 1.7l-4.2 5.4 1.6 3.6c.4.9-.5 1.8-1.4 1.4l-6.2-2.7-6.9 4.1c-.9.5-1.9-.4-1.5-1.4l1.9-4.6L12 28c-1-.1-1-1.4 0-1.5z"
          fill="#C9A84C"
        />
      </svg>
      <div className="leading-tight">
        <p className="font-display text-lg tracking-wide text-[#F5E6C8]">
          Riviera Private Airways
        </p>
        <p className="text-[9px] uppercase tracking-[0.25em] text-[#7a6e64]">
          by Travel Booking Agency
        </p>
      </div>
    </div>
  );
}

export default Hero;
