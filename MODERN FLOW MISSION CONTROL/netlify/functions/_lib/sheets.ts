import { getAccessToken, clearTokenCache } from './google';
import { HEADERS, type TabName } from '../../../shared/types';
import { columnLetter, headerIndex, toRow, str } from '../../../shared/rows';

const API = 'https://sheets.googleapis.com/v4/spreadsheets';

/** Widest tab is `deals` at 17 columns; A:Z leaves room for human-added notes. */
const RANGE = 'A1:Z10000';

export const TABS: TabName[] = ['daily_log', 'deals', 'standups', 'weekly_review'];

function spreadsheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error('Missing GOOGLE_SHEET_ID. See SETUP.md.');
  return id;
}

/** One Sheets API call with a bounded retry on transient failures. */
async function call(path: string, init: RequestInit = {}, attempt = 0): Promise<any> {
  const token = await getAccessToken();
  const res = await fetch(`${API}/${spreadsheetId()}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
  });

  if (res.ok) return res.json();

  const detail = await res.text();

  // A stale cached token, or Sheets rate limiting us. Both are worth one retry.
  const retryable = res.status === 401 || res.status === 429 || res.status >= 500;
  if (retryable && attempt < 2) {
    if (res.status === 401) clearTokenCache();
    await new Promise((r) => setTimeout(r, 300 * 2 ** attempt));
    return call(path, init, attempt + 1);
  }

  throw new Error(`Sheets ${res.status} on ${path}: ${detail.slice(0, 300)}`);
}

export interface TabData {
  /** Header name (lowercased) -> column index. */
  index: Record<string, number>;
  /** Data rows only, header excluded. Row N here is sheet row N + 2. */
  rows: string[][];
}

function toTabData(tab: TabName, values: string[][] | undefined): TabData {
  const all = values ?? [];
  const header = all[0] ?? [];
  const index = headerIndex(header as string[]);

  // An empty or unheadered tab is a setup mistake, not a runtime state. Say so
  // loudly rather than silently returning zero rows and drawing a $0 chart.
  const missing = HEADERS[tab].filter((h) => !(h in index));
  if (missing.length) {
    throw new Error(
      `Tab "${tab}" is missing column(s): ${missing.join(', ')}. Check the header row against SETUP.md.`,
    );
  }

  const rows = all.slice(1).filter((r) => (r ?? []).some((c) => str(c) !== ''));
  return { index, rows };
}

/** Read every tab in one round trip. */
export async function readAll(): Promise<Record<TabName, TabData>> {
  const params = TABS.map((t) => `ranges=${encodeURIComponent(`${t}!${RANGE}`)}`).join('&');
  const body = await call(`/values:batchGet?${params}&majorDimension=ROWS`);
  const ranges: { values?: string[][] }[] = body.valueRanges ?? [];
  const out = {} as Record<TabName, TabData>;
  TABS.forEach((tab, i) => {
    out[tab] = toTabData(tab, ranges[i]?.values);
  });
  return out;
}

export async function readTab(tab: TabName): Promise<TabData> {
  const body = await call(
    `/values/${encodeURIComponent(`${tab}!${RANGE}`)}?majorDimension=ROWS`,
  );
  return toTabData(tab, body.values);
}

/**
 * Insert or overwrite a single row.
 *
 * `match` identifies an existing row (e.g. same date + person). When it hits we
 * rewrite that row in place; otherwise we append. There is no locking here — see
 * the fragility notes in SETUP.md for what that costs.
 */
export async function upsertRow(
  tab: TabName,
  obj: object,
  match: (row: string[], index: Record<string, number>) => boolean,
): Promise<{ action: 'updated' | 'appended'; row: string[] }> {
  const { index, rows } = await readTab(tab);
  const existingAt = rows.findIndex((r) => match(r, index));
  const width = Math.max(...Object.values(index).map((i) => i + 1));
  const lastCol = columnLetter(width - 1);

  if (existingAt >= 0) {
    const row = toRow(tab, obj, index, rows[existingAt]);
    const sheetRow = existingAt + 2; // +1 for header, +1 for 1-based rows
    await call(
      `/values/${encodeURIComponent(`${tab}!A${sheetRow}:${lastCol}${sheetRow}`)}?valueInputOption=RAW`,
      { method: 'PUT', body: JSON.stringify({ values: [row] }) },
    );
    return { action: 'updated', row };
  }

  const row = toRow(tab, obj, index);
  await call(
    `/values/${encodeURIComponent(`${tab}!A1:${lastCol}1`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: 'POST', body: JSON.stringify({ values: [row] }) },
  );
  return { action: 'appended', row };
}

/** Append without checking for an existing row. */
export async function appendRow(tab: TabName, obj: object): Promise<string[]> {
  const { index } = await readTab(tab);
  const width = Math.max(...Object.values(index).map((i) => i + 1));
  const row = toRow(tab, obj, index);
  await call(
    `/values/${encodeURIComponent(`${tab}!A1:${columnLetter(width - 1)}1`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: 'POST', body: JSON.stringify({ values: [row] }) },
  );
  return row;
}

/** Append many rows at once. Used by the seed script. */
export async function appendRows(tab: TabName, objs: object[]): Promise<number> {
  if (!objs.length) return 0;
  const { index } = await readTab(tab);
  const width = Math.max(...Object.values(index).map((i) => i + 1));
  const values = objs.map((o) => toRow(tab, o, index));
  await call(
    `/values/${encodeURIComponent(`${tab}!A1:${columnLetter(width - 1)}1`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: 'POST', body: JSON.stringify({ values }) },
  );
  return values.length;
}
