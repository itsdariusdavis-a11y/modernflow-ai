import { useEffect, useRef, useState } from 'react';
import { TextArea } from '@/components/Fields';
import { SaveBar } from '@/components/SaveBar';
import { StaleBanner } from '@/components/StaleBanner';
import { SectionTitle } from '@/components/AppShell';
import { useStore, EMPTY } from '@/lib/store';
import { useSubmit } from '@/lib/useSubmit';
import { post } from '@/lib/api';
import { currentWeek, weekTotals } from '@/lib/calc';
import { int, money, pct } from '@/lib/format';
import { GOAL_DAYS, GOAL_END, GOAL_START, WEEKLY_GATES } from '@shared/config';
import { sprintWeekRange, tinyDate } from '@shared/dates';
import { todayLA } from '@shared/dates';

const WEEKS = Array.from({ length: Math.ceil(GOAL_DAYS / 7) }, (_, i) => i + 1);

export default function WeeklyReview() {
  const { data, stale, error, refresh } = useStore();
  const snapshot = data ?? EMPTY;
  const today = todayLA();
  const submit = useSubmit();

  const [week, setWeek] = useState(() => currentWeek(today).week);
  const range = sprintWeekRange(week, GOAL_START, GOAL_END);
  const actuals = weekTotals(snapshot.daily_log, range.start_date, range.end_date);
  const saved = snapshot.weekly_review.find((r) => r.week_number === week);

  const [form, setForm] = useState({ biggest_objection: '', one_change: '' });

  // Re-hydrate whenever the selected week changes, not just on first load.
  const loadedWeek = useRef<number | null>(null);
  useEffect(() => {
    if (loadedWeek.current === week) return;
    loadedWeek.current = week;
    setForm({
      biggest_objection: saved?.biggest_objection ?? '',
      one_change: saved?.one_change ?? '',
    });
  }, [week, saved]);

  function save() {
    void submit.run({
      request: () =>
        post('/weekly-review', {
          week_number: week,
          start_date: range.start_date,
          end_date: range.end_date,
          cash_collected: actuals.cash_collected,
          touches: actuals.touches,
          conversations: actuals.conversations,
          closes: actuals.closes,
          ...form,
        }),
    });
  }

  const past = [...snapshot.weekly_review].sort((a, b) => b.week_number - a.week_number);

  return (
    <div className="space-y-6">
      <StaleBanner
        stale={stale}
        error={error}
        fetchedAt={snapshot.fetched_at}
        onRetry={() => void refresh()}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Weekly review</h1>
          <p className="num text-sm text-muted">
            {tinyDate(range.start_date)} – {tinyDate(range.end_date)}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          {WEEKS.map((w) => (
            <button
              key={w}
              onClick={() => setWeek(w)}
              className={`btn px-3 py-2 num text-sm ${
                w === week ? 'border-accent text-accent' : 'text-muted'
              }`}
            >
              W{w}
            </button>
          ))}
        </div>
      </div>

      <section>
        <SectionTitle>Gates vs actual</SectionTitle>
        <div className="card divide-y divide-line">
          <Gate
            label="Cash collected"
            actual={actuals.cash_collected}
            target={WEEKLY_GATES.cash_collected}
            format={money}
          />
          <Gate
            label="Touches"
            actual={actuals.touches}
            target={WEEKLY_GATES.touches}
            format={int}
          />
          <Gate
            label="Conversations"
            actual={actuals.conversations}
            target={WEEKLY_GATES.conversations}
            format={int}
          />
          <Gate
            label="Closes"
            actual={actuals.closes}
            target={WEEKLY_GATES.closes}
            format={int}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>
          {saved ? `Written by ${saved.written_by || 'unknown'}` : 'Not written yet'}
        </SectionTitle>
        <TextArea
          label="Biggest objection this week"
          value={form.biggest_objection}
          onChange={(v) => setForm((f) => ({ ...f, biggest_objection: v }))}
          placeholder="The one that came up most and cost the most."
        />
        <TextArea
          label="One change for next week"
          value={form.one_change}
          onChange={(v) => setForm((f) => ({ ...f, one_change: v }))}
          placeholder="One. Not a list."
        />
        <SaveBar
          status={submit.status}
          error={submit.error}
          onSubmit={save}
          onRetry={submit.retry}
          label={saved ? 'Update review' : 'Save review'}
        />
      </section>

      <section>
        <SectionTitle>Past reviews</SectionTitle>
        {past.length === 0 ? (
          <p className="card px-3 py-4 text-sm text-muted">Nothing written yet.</p>
        ) : (
          <div className="space-y-2">
            {past.map((r) => (
              <div key={r.week_number} className="card p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="num font-semibold">Week {r.week_number}</h3>
                  <span className="num text-xs text-muted">
                    {tinyDate(r.start_date)} – {tinyDate(r.end_date)}
                  </span>
                </div>
                <p className="num text-sm text-muted mt-1">
                  {money(r.cash_collected)} · {int(r.touches)} touches · {int(r.conversations)}{' '}
                  convos · {int(r.closes)} closes
                </p>
                {r.biggest_objection && (
                  <p className="text-sm mt-2">
                    <span className="text-muted">Objection: </span>
                    {r.biggest_objection}
                  </p>
                )}
                {r.one_change && (
                  <p className="text-sm mt-1">
                    <span className="text-muted">Change: </span>
                    {r.one_change}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Gate({
  label,
  actual,
  target,
  format,
}: {
  label: string;
  actual: number;
  target: number;
  format: (n: number) => string;
}) {
  const ratio = target > 0 ? actual / target : 1;
  const tone = ratio >= 1 ? 'text-accent' : ratio >= 0.6 ? 'text-warn' : 'text-danger';

  return (
    <div className="px-3 py-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm">{label}</span>
        <span className="num text-sm">
          <span className={tone}>{format(actual)}</span>
          <span className="text-muted"> / {format(target)}</span>
          <span className={`${tone} ml-2 text-xs`}>{pct(ratio)}</span>
        </span>
      </div>
      <div className="h-1.5 bg-surface2 rounded-sm overflow-hidden mt-1.5">
        <div
          className={
            ratio >= 1
              ? 'h-full bg-accent'
              : ratio >= 0.6
                ? 'h-full bg-warn'
                : 'h-full bg-danger'
          }
          style={{ width: `${Math.min(ratio, 1) * 100}%` }}
        />
      </div>
    </div>
  );
}
