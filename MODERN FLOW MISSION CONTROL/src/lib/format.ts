/** Display helpers. Numbers are always rendered in JetBrains Mono (.num). */

export function money(n: number, opts: { cents?: boolean } = {}): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: opts.cents ? 2 : 0,
    maximumFractionDigits: opts.cents ? 2 : 0,
  }).format(Number.isFinite(n) ? n : 0);
}

export function int(n: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(Number.isFinite(n) ? n : 0));
}

export function decimal(n: number, places = 1): string {
  return (Number.isFinite(n) ? n : 0).toFixed(places);
}

export function pct(n: number): string {
  return `${Math.round((Number.isFinite(n) ? n : 0) * 100)}%`;
}

/** "3 days left" / "last day" / "1 day over". */
export function daysLabel(n: number): string {
  if (n > 1) return `${n} days left`;
  if (n === 1) return 'last day';
  if (n === 0) return 'final day';
  return `${Math.abs(n)} day${Math.abs(n) === 1 ? '' : 's'} over`;
}
