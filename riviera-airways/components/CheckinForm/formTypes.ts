import type { PassengerType } from '@/types/registration';

/**
 * Valeurs internes du formulaire React Hook Form.
 * `consent` est un boolean côté UI (case à cocher) ; la validation Zod
 * impose qu'il soit `true` avant soumission.
 */
export interface CheckinFormValues {
  contact: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    email: string;
    telephone?: string;
  };
  passengers: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    type: PassengerType;
  }[];
  consent: boolean;
}

export const MAX_PASSENGERS_TOTAL = 10;
export const MAX_ADDITIONAL_PASSENGERS = MAX_PASSENGERS_TOTAL - 1;

export const FORM_STEPS = ['Contact', 'Passagers', 'Récapitulatif'] as const;
