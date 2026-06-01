'use client';

import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { BoardingPassPreview } from '@/components/BoardingPassPreview';
import { Timeline } from '@/components/Timeline';
import { CheckinForm } from '@/components/CheckinForm';
import { SuccessScreen } from '@/components/SuccessScreen';
import type { Passenger } from '@/types/registration';

interface SuccessState {
  bookingId: string;
  passengers: Passenger[];
  whatsappSent: boolean;
}

export default function HomePage() {
  const [success, setSuccess] = useState<SuccessState | null>(null);

  if (success) {
    return (
      <main>
        <SuccessScreen
          bookingId={success.bookingId}
          passengers={success.passengers}
          whatsappSent={success.whatsappSent}
        />
      </main>
    );
  }

  return (
    <main>
      <Hero />

      <section id="boarding-pass" className="scroll-mt-8 bg-[#1A1612] py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">
              Votre billet
            </p>
            <h2 className="mt-3 font-display text-3xl italic text-[#F5E6C8] sm:text-4xl">
              Votre embarquement immédiat
            </h2>
          </div>
          <BoardingPassPreview direction="aller" />
        </div>
      </section>

      <Timeline />

      <section id="checkin-form" className="scroll-mt-8 bg-[#1A1612] py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">
              Réservation
            </p>
            <h2 className="mt-3 font-display text-3xl italic text-[#F5E6C8] sm:text-4xl">
              Confirmez votre présence
            </h2>
          </div>

          <CheckinForm
            onSuccess={({ bookingId, values, whatsappSent }) => {
              const passengers: Passenger[] = [
                {
                  prenom: values.contact.prenom,
                  nom: values.contact.nom,
                  dateNaissance: values.contact.dateNaissance,
                  type: 'Adulte',
                },
                ...values.passengers.map((p) => ({
                  prenom: p.prenom,
                  nom: p.nom,
                  dateNaissance: p.dateNaissance,
                  type: p.type,
                })),
              ];
              setSuccess({ bookingId, passengers, whatsappSent });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      </section>

      <footer className="border-t border-[rgba(201,168,76,0.2)] bg-[#1A1612] py-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">
          Riviera Private Airways
        </p>
        <p className="mt-2 text-xs text-[#7a6e64]">
          by Travel Booking Agency · contact@travelba.fr
        </p>
      </footer>
    </main>
  );
}
