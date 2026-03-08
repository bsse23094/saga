export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatJournalDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Returns an array of the last `n` date keys in YYYY-MM-DD format,
 * ending with today, ordered oldest → newest.
 */
export function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

/**
 * Returns the full year of date keys (Jan 1 → Dec 31) for `year`.
 */
export function yearDays(year: number): string[] {
  const days: string[] = [];
  const d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    days.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return days;
}
