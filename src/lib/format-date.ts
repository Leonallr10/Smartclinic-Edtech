import { format, isValid, parseISO } from 'date-fns';

function toDate(value: string | Date | number): Date | null {
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === 'number') {
    const d = new Date(value);
    return isValid(d) ? d : null;
  }
  const parsed = parseISO(value);
  if (isValid(parsed)) return parsed;
  const fallback = new Date(value);
  return isValid(fallback) ? fallback : null;
}

/** Locale-stable date — avoids SSR/client hydration mismatches from toLocaleDateString(). */
export function formatDate(value: string | Date | number, pattern = 'dd MMM yyyy'): string {
  const d = toDate(value);
  return d ? format(d, pattern) : '';
}

export function formatTime(value: string | Date | number, pattern = 'HH:mm'): string {
  const d = toDate(value);
  return d ? format(d, pattern) : '';
}

export function formatDateTime(
  value: string | Date | number,
  pattern = 'dd MMM yyyy · HH:mm',
): string {
  const d = toDate(value);
  return d ? format(d, pattern) : '';
}
