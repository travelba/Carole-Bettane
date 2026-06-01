'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface TimelineItem {
  date: string;
  time: string;
  title: string;
  description: string;
}

const ITINERARY: TimelineItem[] = [
  {
    date: '03 JUL',
    time: '09:45',
    title: 'Décollage · Paris Orly',
    description: 'Vol TO7020 en classe Première vers Toulon-Hyères. Arrivée 11:15.',
  },
  {
    date: '03 JUL',
    time: '13:00',
    title: 'Arrivée à Saint-Tropez',
    description: 'Transfert privé et installation. Déjeuner face à la Méditerranée.',
  },
  {
    date: '04 JUL',
    time: '20:00',
    title: 'Soirée des 50 ans de Carole',
    description: 'Le moment que tout le monde attend — dîner de gala et célébration.',
  },
  {
    date: '05 JUL',
    time: '17:55',
    title: 'Retour · Nice Côte d\'Azur',
    description: 'Vol AF7315 vers Paris CDG. Arrivée 19:30, des souvenirs plein la tête.',
  },
];

export function Timeline() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-[#1A1612] py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Programme</p>
          <h2 className="mt-3 font-display text-3xl italic text-[#F5E6C8] sm:text-4xl">
            Votre week-end à Saint-Tropez
          </h2>
        </div>

        <ol className="relative mt-16 border-l border-[rgba(201,168,76,0.25)] pl-8">
          {ITINERARY.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                delay: reduceMotion ? 0 : i * 0.08,
              }}
              className="mb-12 last:mb-0"
            >
              <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-[#C9A84C] ring-4 ring-[#1A1612]" />
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
                  {item.date}
                </span>
                <span className="text-xs text-[#7a6e64]">{item.time}</span>
              </div>
              <h3 className="mt-2 font-display text-xl text-[#F5E6C8]">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[#7a6e64]">{item.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Timeline;
