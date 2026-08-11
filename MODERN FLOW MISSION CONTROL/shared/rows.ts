import { HEADERS, type TabName } from './types';

/**
 * Translation between Google Sheet rows (arrays of strings) and typed objects.
 * Reads map by header name so column reordering in the Sheet is survivable.
 */

export function num(v: unknown): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (typeof v !== 'string') return 0;
  // Tolerate what a human types into a spreadsheet cell: "$1,200", " 40 ".
  const cleaned = v.replace(/[$,\s]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function bool(v: unknown): boolean {
  if (typeof v === 'boolean') return v;
  const s = String(v ?? '')
    .trim()
    .toLowerCase();
  return s === 'true' || s === 'yes' || s === 'y' || s === '1';
}

export function str(v: unknown): string {
  return v === null || v === undefined ? '' : String(v).trim();
}

/** Map a header row from the Sheet to column indexes. */
export function headerIndex(headerRow: string[]): Record<string, number> {
  const index: Record<string, number> = {};
  headerRow.forEach((h, i) => {
    const key = str(h).toLowerCase();
    if (key && !(key in index)) index[key] = i;
  });
  return index;
}

/** Pull one named cell out of a raw row. */
export function cell(row: string[], index: Record<string, number>, key: string): string {
  const i = index[key];
  return i === undefined ? '' : str(row[i]);
}

/**
 * Build the row array to write for a tab, respecting the Sheet's actual column
 * order rather than assuming ours. Unknown columns in the Sheet are preserved
 * from `existing` so we never blank out a cell a human added.
 */
export function toRow(
  tab: TabName,
  obj: object,
  index: Record<string, number>,
  existing: string[] = [],
): string[] {
  const source = obj as Record<string, unknown>;
  const width = Math.max(
    ...Object.values(index).map((i) => i + 1),
    HEADERS[tab].length,
    existing.length,
  );
  const row: string[] = Array.from({ length: width }, (_, i) => str(existing[i]));
  for (const key of HEADERS[tab]) {
    const i = index[key];
    if (i === undefined) continue;
    const v = source[key];
    row[i] = typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : str(v);
  }
  return row;
}

/** Convert 0-based column index to a spreadsheet column letter (0 -> A). */
export function columnLetter(i: number): string {
  let n = i + 1;
  let out = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}
