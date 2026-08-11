# MFA Ops — Setup

Start to finish this is about 20 minutes, most of it in the Google Cloud console.
Do the steps in order; step 4 fails if you skip step 3.

---

## 1. Create the Google Sheet

Make a new spreadsheet at [sheets.new](https://sheets.new). Name it something like
`MFA Ops Data`.

Create **four tabs** with these exact names (lowercase, underscores):

`daily_log` · `deals` · `standups` · `weekly_review`

Delete the default `Sheet1` tab once the four exist.

Now paste the header row into **row 1** of each tab. Copy each line below and paste
it into cell **A1** — Sheets splits it across columns automatically if you use
_Paste special → Paste values only_, or just paste and use Data → Split text to columns.

**`daily_log` row 1:**

```
date	person	touches	conversations	booked_calls	deposits_closed	cash_collected	build_task_done	blocker	note
```

**`deals` row 1:**

```
id	business_name	contact_name	phone	source	owner	stage	deposit_amount	deposit_date	balance_amount	balance_date	delivery_hours	date_created	last_touch	next_action	next_action_date	notes
```

**`standups` row 1:**

```
date	person	yesterday	today	blocker	submitted_at
```

**`weekly_review` row 1:**

```
week_number	start_date	end_date	cash_collected	touches	conversations	closes	biggest_objection	one_change	written_by
```

### Header rules that actually matter

- **Names must match exactly.** The app maps columns by header name and will refuse
  to read a tab with a missing or renamed column, telling you which one is wrong.
- **Order doesn't matter.** You can drag columns around in the Sheet; reads and
  writes follow the header names.
- **Extra columns are safe.** Add your own notes column at the end — the app
  preserves cells it doesn't know about when it rewrites a row.
- Set the `date`-ish columns to **Format → Number → Plain text** if Sheets starts
  reformatting `2026-08-11` into something else. The app reads and writes plain
  `YYYY-MM-DD` strings.

Finally, grab the **Sheet ID** from the URL — the long string between `/d/` and `/edit`:

```
https://docs.google.com/spreadsheets/d/1AbC...THIS_PART...xYz/edit
```

---

## 2. Create the service account

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a
   project (or reuse the one your n8n workflows already use).
2. **APIs & Services → Library** → search **Google Sheets API** → **Enable**.
3. **APIs & Services → Credentials → Create credentials → Service account**.
   - Name: `mfa-ops`
   - Skip the optional role and user-access steps — it needs no project roles.
4. Open the new service account → **Keys** tab → **Add key → Create new key → JSON**.
   A `.json` file downloads. Keep it; you need two values from it:
   - `client_email` → ends in `.iam.gserviceaccount.com`
   - `private_key` → the long `-----BEGIN PRIVATE KEY-----...` block

> The JSON key is a credential. Don't commit it, don't paste it into Slack, and
> don't put it anywhere in this repo.

---

## 3. Share the Sheet with the service account

This is the step everyone forgets, and its failure looks like a permissions error
at runtime.

Open the Sheet → **Share** → paste the service account's `client_email` →
give it **Editor** → uncheck "Notify people" → **Share**.

The service account is a real Google identity. If the Sheet isn't shared with it,
the app gets a 403 no matter how correct the credentials are.

---

## 4. Environment variables

Five variables. The same five go in `.env` locally and in Netlify for production.

| Variable                       | What it is                                         |
| ------------------------------ | -------------------------------------------------- |
| `GOOGLE_SHEET_ID`              | The ID from the Sheet URL (step 1)                 |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` from the JSON key                   |
| `GOOGLE_PRIVATE_KEY`           | `private_key` from the JSON key                    |
| `APP_PASSCODE`                 | The shared passcode you and Ryan type at login     |
| `APP_SECRET`                   | Random 32+ char string used to sign session tokens |

Generate a good `APP_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### The private key formatting gotcha

`private_key` in the JSON contains real newlines. Both `.env` and Netlify want it on
**one line with literal `\n` sequences**, wrapped in double quotes:

```
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADAN...\n-----END PRIVATE KEY-----\n"
```

The JSON file already stores it that way — open the `.json` in a text editor and copy
the `private_key` value verbatim, quotes included. The app handles both forms, but
this one survives copy-paste into Netlify's UI.

### Locally

```bash
cp .env.example .env   # then fill in the five values
```

`.env` is gitignored. Keep it that way.

### On Netlify

**Site configuration → Environment variables → Add a variable** for each of the five.
Scope them to all deploy contexts. Redeploy after adding them — functions read env
vars at invocation, but a build triggered before they existed won't have them.

---

## 5. Run it locally

```bash
npm install
npm run dev
```

Open <http://localhost:5180>. Pick a name, type the passcode, and you're in.

`npm run dev` runs the Netlify Functions inside the Vite dev server, so you don't
need `netlify-cli` — one command gives you the whole app including the write path.
(`netlify dev` also works if you'd rather use it.)

Other commands:

```bash
npm run check     # typecheck
npm run build     # typecheck + production build into dist/
npm run seed      # populate sample data (below)
npm run format    # prettier
```

---

## 6. Seed sample data

To see the UI populated before real numbers exist:

```bash
npm run seed
```

This writes three days of daily logs, two standups, and six deals — including one
deliberately stale deal so you can see the amber flag, one dead deal, and one
delivered site with hours so the Unit Economics screen has something to compute.

It's safe to re-run: daily logs and standups upsert on (date, person), and deals are
matched by business name so you won't get duplicates.

To start clean, select the data rows in each tab (everything below row 1) and delete
them. Don't delete row 1.

---

## 7. Deploy to Netlify

`netlify.toml` is already configured — build `npm run build`, publish `dist`,
functions from `netlify/functions`.

If you're connecting this folder as its own site from a repo subdirectory, set the
**base directory** to `MODERN FLOW MISSION CONTROL` in Netlify's build settings so it
finds `package.json` and `netlify.toml`.

Then: add the five environment variables (step 4), deploy, and open the URL.

The site is set to `noindex` and `X-Frame-Options: DENY`. It's not linked from
anywhere, but the passcode is what actually keeps it private — pick a real one.

---

## Troubleshooting

| What you see                                        | What it means                                                                                                    |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `Missing GOOGLE_SHEET_ID` / `Missing APP_PASSCODE`  | An env var isn't set. Locally, check `.env`; on Netlify, check the variable exists and redeploy.                 |
| `Google token exchange failed (400): invalid_grant` | The private key or service account email is wrong or malformed. Re-copy `private_key` — usually a broken `\n`.   |
| `Sheets 403`                                        | The Sheet isn't shared with the service account email (step 3), or the Sheets API isn't enabled (step 2).        |
| `Sheets 404`                                        | Wrong `GOOGLE_SHEET_ID`.                                                                                         |
| `Tab "daily_log" is missing column(s): …`           | A header in row 1 was renamed, deleted, or has a typo. Compare against step 1.                                   |
| Amber "Showing cached data" banner                  | A read failed and you're looking at the last good data. The message under it says why. Numbers are real but old. |
| "Not saved" on a form                               | The write failed and **nothing was recorded**. Your input is still in the form — hit Retry.                      |
| Wrong day's numbers                                 | Everything runs on America/Los_Angeles and rolls over at local midnight, regardless of the device's timezone.    |
