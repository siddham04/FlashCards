export function normalizeForCompare(s: string): string {
  if (!s) return '';
  // trim + lowercase
  let out = s.trim().toLowerCase();
  // normalize NFD and remove diacritics
  out = out.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  // collapse inner whitespace
  out = out.replace(/\s+/g, ' ');
  return out;
}

