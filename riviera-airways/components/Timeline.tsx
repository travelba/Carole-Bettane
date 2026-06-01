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
    date: 'VEN 03 JUL',
    time: '09:45',
    title: 'Embarquement · Paris Orly',
    description: 'Vol TO7020 à destination de Toulon-Hyères. Arrivée prévue à 11:15.',
  },
  {
    date: 'VEN 03 JUL',
    time: '12:00',
    title: 'Accueil à la Toison d\'Or',
    description: 'Transfert vers la résidence et installation des invités.',
  },
  {
    date: 'VEN 03 JUL',
    time: '13:00',
    title: 'Brunch de bienvenue',
    description: 'Déjeuner d\'accueil face à la Méditerranée.',
  },
  {
    date: 'VEN 03 JUL',
    time: '15:00',
    title: 'Après-midi détente',
    description: 'Temps libre à la résidence : piscine et farniente.',
  },
  {
    date: 'VEN 03 JUL',
    time: '19:30',
    title: 'Dîner d\'ouverture',
    description: 'Premier dîner au restaurant pour lancer les festivités.',
  },
  {
    date: 'SAM 04 JUL',
    time: '10:00',
    title: 'Petit-déjeuner',
    description: 'Petit-déjeuner servi à la résidence.',
  },
  {
    date: 'SAM 04 JUL',
    time: '12:00',
    title: 'Journée plage · Les Cybelles',
    description: 'Déjeuner et après-midi à la plage des Cybelles.',
  },
  {
    date: 'SAM 04 JUL',
    time: '21:00',
    title: 'Soirée des 50 ans de Carole',
    description: 'Dîner de gala et célébration — le temps fort du séjour.',
  },
  {
    date: 'DIM 05 JUL',
    time: '10:00',
    title: 'Petit-déjeuner',
    description: 'Petit-déjeuner servi à la résidence.',
  },
  {
    date: 'DIM 05 JUL',
    time: '12:00',
    title: 'Journée plage · Playamigos',
    description: 'Déjeuner et détente à la plage Playamigos.',
  },
  {
    date: 'DIM 05 JUL',
    time: '15:00',
    title: 'Transfert vers l\'aéroport',
    description: 'Départ de la résidence en direction de Nice Côte d\'Azur.',
  },
  {
    date: 'DIM 05 JUL',
    time: '17:55',
    title: 'Vol retour · Nice Côte d\'Azur',
    description: 'Vol AF7315 à destination de Paris CDG. Arrivée prévue à 19:30.',
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
