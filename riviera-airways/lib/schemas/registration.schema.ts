import { z } from 'zod';

/**
 * Date du vol aller — sert de référence pour calculer l'âge des enfants.
 * Un enfant doit avoir strictement moins de 12 ans le jour du départ.
 */
export const DATE_VOL = new Date('2025-07-03');

const DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;

/** Calcule l'âge (en années) à la date du vol à partir d'une date JJ/MM/AAAA. */
function ageAuVol(dateNaissance: string): number {
  const [jour, mois, annee] = dateNaissance.split('/').map(Number);
  const naissance = new Date(annee, mois - 1, jour);
  return (DATE_VOL.getTime() - naissance.getTime()) / (365.25 * 24 * 3600 * 1000);
}

export const passengerSchema = z
  .object({
    nom: z.string().trim().min(2, 'Minimum 2 caractères').max(50).toUpperCase(),
    prenom: z.string().trim().min(2, 'Minimum 2 caractères').max(50).toUpperCase(),
    dateNaissance: z.string().regex(DATE_REGEX, 'Format : JJ/MM/AAAA'),
    type: z.enum(['Adulte', 'Enfant']),
  })
  .refine(
    (data) => {
      if (data.type === 'Enfant') {
        return ageAuVol(data.dateNaissance) < 12;
      }
      return true;
    },
    { message: 'Un enfant doit avoir moins de 12 ans le 03/07', path: ['type'] }
  );

export const contactSchema = z.object({
  nom: z.string().trim().min(2, 'Minimum 2 caractères').max(50).toUpperCase(),
  prenom: z.string().trim().min(2, 'Minimum 2 caractères').max(50).toUpperCase(),
  dateNaissance: z.string().regex(DATE_REGEX, 'Format : JJ/MM/AAAA'),
  email: z.string().email('Email invalide'),
  telephone: z
    .string()
    .optional()
    .transform((t) =>
      t && t.trim().length > 0
        ? t.replace(/[\s\-.]/g, '').replace(/^0/, '+33')
        : undefined
    ),
});

export const registrationSchema = z.object({
  contact: contactSchema,
  passengers: z.array(passengerSchema).min(0).max(9),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter pour continuer' }),
  }),
});

/** Type d'entrée brut du formulaire (avant transform du téléphone). */
export type RegistrationInput = z.input<typeof registrationSchema>;
/** Type validé/transformé (après parsing Zod). */
export type RegistrationData = z.output<typeof registrationSchema>;
export type PassengerInput = z.input<typeof passengerSchema>;
export type ContactInput = z.input<typeof contactSchema>;
