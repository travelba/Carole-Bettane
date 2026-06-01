'use client';

import type { HTMLInputTypeAttribute } from 'react';
import {
  useFormContext,
  type FieldError,
  type UseFormRegisterReturn,
} from 'react-hook-form';
import type { CheckinFormValues } from './formTypes';

const errorClass = 'mt-1 text-xs text-[#B76E79]';

interface FloatingFieldProps {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  placeholder?: string;
  hint?: string;
}

/** Champ à label flottant (style luxe). */
function FloatingField({
  id,
  label,
  registration,
  error,
  type = 'text',
  autoComplete,
  inputMode,
  placeholder = ' ',
  hint,
}: FloatingFieldProps) {
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="peer w-full rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#2C2620] px-4 pb-2 pt-6 text-[#F5E6C8] placeholder-transparent transition-colors focus:border-[#C9A84C] focus:outline-none"
          {...registration}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-4 origin-left text-sm text-[#7a6e64] transition-all duration-200 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#C9A84C] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest peer-[:not(:placeholder-shown)]:text-[#C9A84C]"
        >
          {label}
        </label>
      </div>
      {hint && <p className="mt-2 text-xs text-[#C9A84C]">{hint}</p>}
      {error && <p className={errorClass}>{error.message}</p>}
    </div>
  );
}

export function Step1Contact() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckinFormValues>();

  return (
    <div className="space-y-5">
      <p className="text-sm text-[#7a6e64]">
        Vous êtes le passager principal. Vos informations apparaîtront sur le
        premier billet.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FloatingField
          id="contact-prenom"
          label="Prénom"
          autoComplete="given-name"
          registration={register('contact.prenom')}
          error={errors.contact?.prenom}
        />
        <FloatingField
          id="contact-nom"
          label="Nom"
          autoComplete="family-name"
          registration={register('contact.nom')}
          error={errors.contact?.nom}
        />
      </div>

      <FloatingField
        id="contact-naissance"
        label="Date de naissance (JJ/MM/AAAA)"
        inputMode="numeric"
        registration={register('contact.dateNaissance')}
        error={errors.contact?.dateNaissance}
      />

      <FloatingField
        id="contact-email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        registration={register('contact.email')}
        error={errors.contact?.email}
      />

      <FloatingField
        id="contact-tel"
        label="Téléphone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        registration={register('contact.telephone')}
        error={errors.contact?.telephone}
        hint="📱 Pour recevoir vos billets par WhatsApp"
      />
    </div>
  );
}

export default Step1Contact;
