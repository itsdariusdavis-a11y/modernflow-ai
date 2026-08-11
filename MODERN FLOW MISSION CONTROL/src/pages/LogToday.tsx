import { useEffect, useRef, useState } from 'react';
import { NumberField, TextArea, Toggle } from '@/components/Fields';
import { SaveBar } from '@/components/SaveBar';
import { StaleBanner } from '@/components/StaleBanner';
import { SectionTitle } from '@/components/AppShell';
import { useMe } from '@/context/AuthContext';
import { useStore, EMPTY } from '@/lib/store';
import { useSubmit } from '@/lib/useSubmit';
import { post } from '@/lib/api';
import { int } from '@/lib/format';
import { TOUCH_MINIMUM } from '@shared/config';
import { shortDate, todayLA } from '@shared/dates';
import type { DailyLog } from '@shared/types';

const BLANK = {
  touches: 0,
  conversations: 0,
  booked_calls: 0,
  deposits_closed: 0,
  cash_collected: 0,
  build_task_done: false,
  blocker: '',
  note: '',
};

/**
 * The write path. Under 20 seconds, one-handed. Re-opening it loads today's
 * existing row so a second submission corrects rather than duplicates.
 */
export default function LogToday() {
  const me = useMe();
  const { data, stale, error, refresh } = useStore();
  const snapshot = data ?? EMPTY;
  const today = todayLA();
  const submit = useSubmit();

  const existing = snapshot.daily_log.find((l) => l.date === today && l.person === me);
  const [form, setForm] = useState(BLANK);

  // Hydrate once from the server row. After that the form is the user's — a
  // background refresh must never overwrite numbers being typed.
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current || !existing) return;
    hydrated.current = true;
    setForm({
      touches: existing.touches,
      conversations: existing.conversations,
      booked_calls: existing.booked_calls,
      deposits_closed: existing.deposits_closed,
      cash_collected: existing.cash_collected,
      build_task_done: existing.build_task_done,
      blocker: existing.blocker,
      note: existing.note,
    });
  }, [existing]);

  const set = <K extends keyof typeof BLANK>(key: K, value: (typeof BLANK)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function save() {
    const row: DailyLog = { date: today, person: me, ...form };

    void submit.run({
      optimistic: (s) => ({
        ...s,
        daily_log: [...s.daily_log.filter((l) => !(l.date === today && l.person === me)), row],
      }),
      request: () => post('/daily-log', row),
    });
  }

  const short = Math.max(TOUCH_MINIMUM - form.touches, 0);

  return (
    <div className="space-y-4">
      <StaleBanner
        stale={stale}
        error={error}
        fetchedAt={snapshot.fetched_at}
        onRetry={() => void refresh()}
      />

      <div>
        <h1 className="text-xl font-semibold">Log today</h1>
        <p className="text-sm text-muted">
          {me} · {shortDate(today)}
          {existing && <span className="text-accent"> · updating today&apos;s entry</span>}
        </p>
      </div>

      <div className="space-y-4">
        <NumberField
          label="Touches"
          value={form.touches}
          onChange={(v) => set('touches', v)}
          step={5}
          hint={
            short > 0 ? `${int(short)} below the ${TOUCH_MINIMUM} minimum` : 'Minimum cleared'
          }
        />
        <NumberField
          label="Conversations"
          value={form.conversations}
          onChange={(v) => set('conversations', v)}
        />
        <NumberField
          label="Booked calls"
          value={form.booked_calls}
          onChange={(v) => set('booked_calls', v)}
        />
        <NumberField
          label="Deposits closed"
          value={form.deposits_closed}
          onChange={(v) => set('deposits_closed', v)}
        />
        <NumberField
          label="Cash collected"
          value={form.cash_collected}
          onChange={(v) => set('cash_collected', v)}
          step={100}
          money
          hint="Money actually in the account today, not invoiced."
        />

        <Toggle
          label="Build task done"
          hint="The one delivery task you committed to today."
          value={form.build_task_done}
          onChange={(v) => set('build_task_done', v)}
        />
      </div>

      <div className="space-y-4">
        <SectionTitle>Context</SectionTitle>
        <TextArea
          label="Blocker"
          value={form.blocker}
          onChange={(v) => set('blocker', v)}
          placeholder="What's in the way? Leave empty if nothing."
          rows={2}
        />
        <TextArea
          label="Note"
          value={form.note}
          onChange={(v) => set('note', v)}
          placeholder="Anything worth remembering."
          rows={2}
        />
      </div>

      <SaveBar
        status={submit.status}
        error={submit.error}
        onSubmit={save}
        onRetry={submit.retry}
        label={existing ? 'Update today' : 'Log today'}
      />
    </div>
  );
}
