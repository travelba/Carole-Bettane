'use client';

import { useState } from 'react';
import {
  FormProvider,
  useForm,
  type FieldPath,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from '@/lib/schemas/registration.schema';
import type { RegisterResponse } from '@/types/registration';
import { ProgressBar } from './ProgressBar';
import { Step1Contact } from './Step1Contact';
import { Step2Passengers } from './Step2Passengers';
import { Step3Summary } from './Step3Summary';
import {
  FORM_STEPS,
  type CheckinFormValues,
} from './formTypes';

interface CheckinFormProps {
  onSuccess: (result: {
    bookingId: string;
    values: CheckinFormValues;
    whatsappSent: boolean;
  }) => void;
}

const resolver = zodResolver(registrationSchema) as unknown as Resolver<CheckinFormValues>;

export function CheckinForm({ onSuccess }: CheckinFormProps) {
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<CheckinFormValues>({
    resolver,
    mode: 'onBlur',
    defaultValues: {
      contact: { nom: '', prenom: '', dateNaissance: '', email: '', telephone: '' },
      passengers: [],
      consent: false,
    },
  });

  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;

  async function goNext() {
    setSubmitError(null);
    // On valide les champs feuilles de l'étape courante (plus fiable qu'un
    // trigger sur l'objet entier avec un resolver de schéma global).
    const fieldsByStep: Record<number, FieldPath<CheckinFormValues>[]> = {
      1: [
        'contact.prenom',
        'contact.nom',
        'contact.dateNaissance',
        'contact.email',
        'contact.telephone',
      ],
      2: ['passengers'],
    };
    const toValidate = fieldsByStep[step];
    const valid = toValidate ? await trigger(toValidate) : true;
    if (valid) setStep((s) => Math.min(s + 1, FORM_STEPS.length));
  }

  function goBack() {
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  const onSubmit: SubmitHandler<CheckinFormValues> = async (values) => {
    setSubmitError(null);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = (await res.json()) as RegisterResponse;

      if (!res.ok || !data.success) {
        const message =
          data.success === false ? data.error : `Erreur ${res.status}`;
        setSubmitError(message);
        return;
      }

      onSuccess({
        bookingId: data.bookingId,
        values,
        whatsappSent: data.whatsappSent,
      });
    } catch {
      setSubmitError(
        "Une erreur réseau est survenue. Vérifiez votre connexion et réessayez."
      );
    }
  };

  const isLastStep = step === FORM_STEPS.length;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-xl rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[#231F1A] p-6 sm:p-8"
        noValidate
      >
        <div className="mb-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">
            Check-in
          </p>
          <h2 className="mt-2 font-display text-2xl italic text-[#F5E6C8]">
            {FORM_STEPS[step - 1]}
          </h2>
        </div>

        <ProgressBar current={step} steps={[...FORM_STEPS]} />

        {/* Transition d'étape en CSS (fiable, jamais bloquée) ; `key` rejoue
            l'animation à chaque changement d'étape. */}
        <div key={step} className="step-fade">
          {step === 1 && <Step1Contact />}
          {step === 2 && <Step2Passengers />}
          {step === 3 && <Step3Summary />}
        </div>

        {submitError && (
          <p className="mt-6 rounded-lg border border-[#B76E79] bg-[rgba(183,110,121,0.1)] px-4 py-3 text-center text-sm text-[#B76E79]">
            {submitError}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              disabled={isSubmitting}
              className="rounded-full border border-[rgba(201,168,76,0.4)] px-6 py-3 text-sm uppercase tracking-wide text-[#F5E6C8] transition-colors hover:bg-[#2C2620] disabled:opacity-40"
            >
              Retour
            </button>
          ) : (
            <span />
          )}

          {!isLastStep ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-full bg-[#C9A84C] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-[#1A1612] transition-all duration-200 hover:bg-[#E2C06A]"
            >
              Continuer
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-[#1A1612] transition-all duration-200 hover:bg-[#E2C06A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <span
                  aria-hidden
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[#1A1612]/25 border-t-[#1A1612] bg-transparent"
                />
              )}
              {isSubmitting ? 'Émission des billets…' : 'Confirmer l\'inscription'}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

export default CheckinForm;
