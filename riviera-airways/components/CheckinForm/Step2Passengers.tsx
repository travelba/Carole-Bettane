'use client';

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { PassengerType } from '@/types/registration';
import { maskDateFr } from '@/lib/maskDate';
import {
  MAX_ADDITIONAL_PASSENGERS,
  MAX_PASSENGERS_TOTAL,
  type CheckinFormValues,
} from './formTypes';

const inputClass =
  'w-full bg-[#2C2620] border border-[rgba(201,168,76,0.2)] text-[#F5E6C8] placeholder:text-[#7a6e64] rounded-lg px-4 py-3 focus:outline-none focus:border-[#C9A84C] transition-colors';
const labelClass = 'block text-xs uppercase tracking-widest text-[#7a6e64] mb-2';
const errorClass = 'mt-1 text-xs text-[#B76E79]';

/** Sélecteur Adulte / Enfant — boutons radio stylisés (pas de select natif). */
function TypeSelector({
  value,
  onChange,
}: {
  value: PassengerType;
  onChange: (next: PassengerType) => void;
}) {
  const options: PassengerType[] = ['Adulte', 'Enfant'];
  return (
    <div
      role="radiogroup"
      aria-label="Type de passager"
      className="grid grid-cols-2 gap-2"
    >
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={[
              'rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
              active
                ? 'border-[#C9A84C] bg-[#C9A84C] text-[#1A1612]'
                : 'border-[rgba(201,168,76,0.3)] bg-transparent text-[#F5E6C8] hover:border-[#C9A84C]',
            ].join(' ')}
          >
            {opt === 'Enfant' ? '🧒 Enfant' : '✈ Adulte'}
          </button>
        );
      })}
    </div>
  );
}

export function Step2Passengers() {
  const reduceMotion = useReducedMotion();
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<CheckinFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'passengers',
  });

  const contact = useWatch({ control, name: 'contact' });
  const passengers = useWatch({ control, name: 'passengers' }) ?? [];

  const adultes = 1 + passengers.filter((p) => p?.type === 'Adulte').length;
  const enfants = passengers.filter((p) => p?.type === 'Enfant').length;
  const total = 1 + passengers.length;
  const atMax = passengers.length >= MAX_ADDITIONAL_PASSENGERS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#7a6e64]">
          Ajoutez vos accompagnants (max {MAX_PASSENGERS_TOTAL} au total).
        </p>
        <span className="rounded-full border border-[rgba(201,168,76,0.2)] px-3 py-1 text-xs text-[#F5E6C8]">
          ✈ {adultes} adulte(s) · 🧒 {enfants} enfant(s)
        </span>
      </div>

      {/* Passager 1 = contact, carte verrouillée, fond or/10%, badge "Vous" */}
      <div className="rounded-xl border border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.1)] p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-[#C9A84C]">
            Passager 1
          </p>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#C9A84C] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#1A1612]">
              Vous
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#7a6e64]">
              🔒
            </span>
          </div>
        </div>
        <p className="mt-2 font-display text-lg text-[#F5E6C8]">
          {contact?.prenom || '—'} {(contact?.nom || '').toUpperCase()}
        </p>
      </div>

      <AnimatePresence initial={false}>
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : -8, height: reduceMotion ? 'auto' : 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8, height: reduceMotion ? 'auto' : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="overflow-hidden rounded-xl border border-[rgba(201,168,76,0.2)] bg-[#231F1A] p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-[#C9A84C]">
                Passager {index + 2}
              </p>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-xs text-[#B76E79] hover:underline"
              >
                Retirer
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Prénom</label>
                <input
                  className={inputClass}
                  placeholder="Prénom"
                  {...register(`passengers.${index}.prenom` as const)}
                />
                {errors.passengers?.[index]?.prenom && (
                  <p className={errorClass}>
                    {errors.passengers[index]?.prenom?.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Nom</label>
                <input
                  className={inputClass}
                  placeholder="Nom"
                  {...register(`passengers.${index}.nom` as const)}
                />
                {errors.passengers?.[index]?.nom && (
                  <p className={errorClass}>
                    {errors.passengers[index]?.nom?.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Date de naissance</label>
                {(() => {
                  const dateReg = register(
                    `passengers.${index}.dateNaissance` as const
                  );
                  return (
                    <input
                      className={inputClass}
                      placeholder="JJ/MM/AAAA"
                      inputMode="numeric"
                      {...dateReg}
                      onChange={(e) => {
                        e.target.value = maskDateFr(e.target.value);
                        return dateReg.onChange(e);
                      }}
                    />
                  );
                })()}
                {errors.passengers?.[index]?.dateNaissance && (
                  <p className={errorClass}>
                    {errors.passengers[index]?.dateNaissance?.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <TypeSelector
                  value={passengers[index]?.type ?? 'Adulte'}
                  onChange={(next) =>
                    setValue(`passengers.${index}.type`, next, {
                      shouldValidate: true,
                    })
                  }
                />
                {/* Garde la valeur enregistrée auprès de react-hook-form */}
                <input
                  type="hidden"
                  {...register(`passengers.${index}.type` as const)}
                />
                {errors.passengers?.[index]?.type && (
                  <p className={errorClass}>
                    {errors.passengers[index]?.type?.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        type="button"
        disabled={atMax}
        onClick={() =>
          append({ nom: '', prenom: '', dateNaissance: '', type: 'Adulte' })
        }
        className="w-full rounded-lg border border-dashed border-[rgba(201,168,76,0.4)] px-4 py-3 text-sm text-[#C9A84C] transition-colors hover:bg-[#2C2620] disabled:cursor-not-allowed disabled:opacity-40"
      >
        + Ajouter un passager
      </button>

      {atMax && (
        <p className="text-center text-xs text-[#B76E79]">
          Maximum {MAX_PASSENGERS_TOTAL} passagers atteint ({total} au total).
        </p>
      )}
    </div>
  );
}

export default Step2Passengers;
