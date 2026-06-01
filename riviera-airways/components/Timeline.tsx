'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface TimelineItem {
  time: string;
  title: string;
  description: string;
}

interface TimelineDay {
  day: string;
  label: string;
  items: TimelineItem[];
}

const ITINERARY: TimelineDay[] = [
  {
    day: 'Vendredi 3 juillet',
    label: 'Jour 1 · Arrivée',
    items: [
      {
        time: '09:45',
        title: 'Embarquement · Paris Orly',
        description: 'Vol TO7020 à destination de Toulon-Hyères. Arrivée prévue à 11:15.',
      },
      {
        time: '11:30',
        title: 'Location de voiture à l\'aéroport',
        description:
          'Pensez à réserver une voiture de location : récupération à l\'aéroport de Toulon-Hyères et restitution à l\'aéroport de Nice Côte d\'Azur. Elle vous servira tout le week-end pour rejoindre Saint-Tropez et vous déplacer.',
      },
      {
        time: '12:30',
        title: 'Arrivée à la Toison d\'Or',
        description: 'Installation à la résidence.',
      },
      {
        time: '13:00',
        title: 'Brunch de bienvenue',
        description: 'Déjeuner d\'accueil face à la Méditerranée.',
      },
      {
        time: '15:00',
        title: 'Après-midi détente',
        description: 'Temps libre à la résidence : piscine et farniente.',
      },
      {
        time: '19:30',
        title: 'Dîner d\'ouverture',
        description: 'Premier dîner au restaurant pour lancer le week-end.',
      },
    ],
  },
  {
    day: 'Samedi 4 juillet',
    label: 'Jour 2 · Bobo Bling',
    items: [
      {
        time: '10:00',
        title: 'Petit-déjeuner',
        description: 'Petit-déjeuner servi à la résidence.',
      },
      {
        time: '11:00',
        title: 'Activités sportives · Yoga, cours de sport & padel',
        description:
          'Au choix et en simultané : séance de yoga, cours de sport collectif ou match de padel.',
      },
      {
        time: '13:00',
        title: 'Journée plage · Cybèle',
        description: 'Déjeuner et après-midi à la plage Cybèle.',
      },
      {
        time: '21:00',
        title: 'Soirée Bobo Bling',
        description: 'Dîner de gala et célébration — le temps fort du week-end.',
      },
    ],
  },
  {
    day: 'Dimanche 5 juillet',
    label: 'Jour 3 · Départ',
    items: [
      {
        time: '10:00',
        title: 'Petit-déjeuner',
        description: 'Petit-déjeuner servi à la résidence.',
      },
      {
        time: '12:00',
        title: 'Journée plage · Playamigos',
        description: 'Déjeuner et détente à la plage Playamigos.',
      },
      {
        time: '15:00',
        title: 'Départ vers l\'aéroport',
        description:
          'Restitution de la voiture de location et route vers l\'aéroport de Nice Côte d\'Azur.',
      },
      {
        time: '17:55',
        title: 'Vol retour · Nice Côte d\'Azur',
        description: 'Vol AF7315 à destination de Paris CDG. Arrivée prévue à 19:30.',
      },
    ],
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

        <div className="mt-16 space-y-14">
          {ITINERARY.map((day) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
            >
              {/* En-tête du jour */}
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
                  {day.label}
                </p>
                <h3 className="mt-1 font-display text-2xl italic text-[#F5E6C8] sm:text-3xl">
                  {day.day}
                </h3>
              </div>

              {/* Activités du jour */}
              <ol className="relative border-l border-[rgba(201,168,76,0.25)] pl-8">
                {day.items.map((item, i) => (
                  <motion.li
                    key={item.time + item.title}
                    initial={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.4,
                      delay: reduceMotion ? 0 : i * 0.06,
                    }}
                    className="mb-8 last:mb-0"
                  >
                    <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-[#C9A84C] ring-4 ring-[#1A1612]" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
                      {item.time}
                    </span>
                    <h4 className="mt-1 font-display text-xl text-[#F5E6C8]">{item.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-[#7a6e64]">{item.description}</p>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Timeline;
