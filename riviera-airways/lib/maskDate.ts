/**
 * Formate une saisie en date française `JJ/MM/AAAA` au fur et à mesure.
 * On ne garde que les chiffres et on insère les `/` automatiquement, ce qui
 * permet la saisie avec un clavier purement numérique sur mobile (où la
 * touche `/` est absente).
 */
export function maskDateFr(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}
