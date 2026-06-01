'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { FLIGHT_DATA } from '@/types/registration';
import type { CheckinFormValues } from './formTypes';

const errorClass = 'mt-2 text-xs text-[#B76E79]';

export function Step3Summary() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CheckinFormValues>();

  const contact = useWatch({ control, name: 'contact' });
  const passengers = useWatch({ control, name: 'passengers' }) ?? [];

  const allPassengers = [
    {
      prenom: contact?.prenom ?? '',
      nom: contact?.nom ?? '',
      type: 'Adulte' as const,
      dateNaissance: contact?.dateNaissance ?? '',
    },
    ...passengers,
  ];

  const adultes = allPassengers.filter((p) => p.type === 'Adulte').length;
  const enfants = allPassengers.filter((p) => p.type === 'Enfant').length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[rgba(201,168,76,0.2)] bg-[#231F1A] p-5">
        <p className="text-xs uppercase tracking-widest text-[#C9A84C]">
          Vos vols
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(['aller', 'retour'] as const).map((dir) => {
            const f = FLIGHT_DATA[dir];
            return (
              <div key={dir} className="rounded-lg bg-[#2C2620] p-3">
                <p className="text-[10px] uppercase tracking-widest text-[#7a6e64]">
                  {dir === 'aller' ? 'Aller' : 'Retour'} · {f.code}
                </p>
                <p className="mt-1 font-display text-xl text-[#F5E6C8]">
                  {f.from} → {f.to}
                </p>
                <p className="text-xs text-[#7a6e64]">
                  {f.dep}–{f.arr} · {f.date}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(201,168,76,0.2)] bg-[#231F1A] p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-[#C9A84C]">
            Passagers
          </p>
          <span className="text-xs text-[#7a6e64]">
            ✈ {adultes} adulte(s) · 🧒 {enfants} enfant(s)
          </span>
        </div>
        <ol className="mt-4 space-y-3">
          {allPassengers.map((p, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 border-b border-[rgba(201,168,76,0.1)] pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(201,168,76,0.4)] text-xs font-semibold text-[#C9A84C]">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm text-[#F5E6C8]">
                    {p.prenom} {(p.nom || '').toUpperCase()}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-[#7a6e64]">
                    {p.dateNaissance}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {i === 0 && (
                  <span className="rounded-full bg-[#C9A84C] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#1A1612]">
                    Vous
                  </span>
                )}
                <span
                  className={[
                    'rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest',
                    p.type === 'Enfant'
                      ? 'border-[rgba(201,168,76,0.4)] text-[#F5E6C8]'
                      : 'border-[rgba(201,168,76,0.2)] text-[#7a6e64]',
                  ].join(' ')}
                >
                  {p.type === 'Enfant' ? '🧒 Enfant' : '✈ Adulte'}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Email mis en valeur — c'est sur cette adresse que partiront les billets */}
      <div className="rounded-xl border border-[#C9A84C] bg-[rgba(201,168,76,0.1)] p-5">
        <p className="text-xs uppercase tracking-widest text-[#C9A84C]">
          ✉ Billets envoyés à
        </p>
        <p className="mt-2 break-all font-display text-xl text-[#F5E6C8]">
          {contact?.email || '—'}
        </p>
        {contact?.telephone && (
          <p className="mt-1 text-xs text-[#7a6e64]">
            📱 Et par WhatsApp au {contact.telephone}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-[rgba(201,168,76,0.2)] bg-[#231F1A] p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[#C9A84C]"
            {...register('consent')}
          />
          <span className="text-sm text-[#F5E6C8]">
            J'accepte que mes informations soient utilisées par Travel Booking
            Agency pour l'émission de mes billets et l'organisation de
            l'événement.
          </span>
        </label>
        {errors.consent && (
          <p className={errorClass}>{errors.consent.message}</p>
        )}
      </div>
    </div>
  );
}

export default Step3Summary;
