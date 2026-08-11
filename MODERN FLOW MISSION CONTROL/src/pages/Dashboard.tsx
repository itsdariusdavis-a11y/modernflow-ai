import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { SectionTitle } from '@/components/AppShell';
import { PersonTodayPanel } from '@/components/PersonTodayPanel';
import { StatCard } from '@/components/StatCard';
import { StaleBanner } from '@/components/StaleBanner';
import { useMe } from '@/context/AuthContext';
import { useStore, EMPTY } from '@/lib/store';
import {
  allPersonDays,
  currentWeek,
  dayTotals,
  goalProgress,
  paceSeries,
  pipelineSummary,
  weekTotals,
} from '@/lib/calc';
import { daysLabel, int, money } from '@/lib/format';
import { STANDUP_DUE_HOUR } from '@shared/config';
import { hourLA, todayLA } from '@shared/dates';

// Recharts is the single biggest thing in the bundle and it sits below the fold.
// Splitting it lets the money number and the two accountability panels paint
// first on a phone.
const PaceChart = lazy(() =>
  import('@/components/PaceChart').then((m) => ({ default: m.PaceChart })),
);

const TONE = {
  ahead: { text: 'text-accent', bar: 'bg-accent', border: 'border-accent' },
  behind: { text: 'text-warn', bar: 'bg-warn', border: 'border-warn' },
  bad: { text: 'text-danger', bar: 'bg-danger', border: 'border-danger' },
} as const;

export default function Dashboard() {
  const me = useMe();
  const { data, loading, stale, error, refresh } = useStore();
  const snapshot = data ?? EMPTY;
  const today = todayLA();

  const goal = goalProgress(snapshot.daily_log, today);
  const tone = TONE[goal.status];
  const totals = dayTotals(snapshot.daily_log, today);
  const week = currentWeek(today);
  const weekly = weekTotals(snapshot.daily_log, week.start_date, week.end_date);
  const days = allPersonDays(snapshot, today);
  const series = paceSeries(snapshot.daily_log, today);
  const stages = pipelineSummary(snapshot.deals).filter((s) => s.count > 0);
  const pastStandupTime = hourLA() >= STANDUP_DUE_HOUR;

  return (
    <div className="space-y-6">
      <StaleBanner
        stale={stale}
        error={error}
        fetchedAt={snapshot.fetched_at}
        onRetry={() => void refresh()}
      />

      {error && !stale && (
        <div className="rounded-md border border-danger bg-danger/10 px-3 py-2 flex items-center gap-3">
          <p className="text-sm text-danger flex-1">{error}</p>
          <button className="btn py-2 px-3 text-sm" onClick={() => void refresh()}>
            Retry
          </button>
        </div>
      )}

      {/* The money number. Everything else on this page is subordinate to it. */}
      <section className={`card border-l-4 ${tone.border} p-4`}>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs uppercase tracking-wider text-muted">Cash collected</p>
          <p className="num text-xs text-muted">{daysLabel(goal.daysRemaining)}</p>
        </div>

        <p className={`num text-5xl sm:text-6xl font-bold mt-1 ${tone.text}`}>
          {money(goal.collected)}
        </p>
        <p className="num text-sm text-muted">of {money(goal.goal)} by Aug 31</p>

        <div className="h-2.5 bg-surface2 rounded-sm overflow-hidden mt-3">
          <div className={`h-full ${tone.bar}`} style={{ width: `${goal.fraction * 100}%` }} />
        </div>

        <p className="text-sm mt-2">
          {goal.status === 'ahead' ? (
            <span className="text-accent">
              On or ahead of pace ({money(goal.paceTarget)} due by now).
            </span>
          ) : (
            <span className={tone.text}>
              {money(goal.shortfall)} behind pace — {money(goal.paceTarget)} should be in by day{' '}
              {int(goal.daysElapsed)} of 21.
            </span>
          )}
        </p>
      </section>

      {/* The accountability surface, second only to the money. */}
      <section>
        <SectionTitle
          right={
            <Link to="/log" className="text-xs text-accent">
              Log today →
            </Link>
          }
        >
          Today
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {days.map((day) => (
            <PersonTodayPanel
              key={day.person}
              day={day}
              isMe={day.person === me}
              pastStandupTime={pastStandupTime}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Combined</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Touches today" value={int(totals.touches)} />
          <StatCard label="Conversations today" value={int(totals.conversations)} />
          <StatCard label="Booked calls today" value={int(totals.booked_calls)} />
          <StatCard
            label="Deposits this week"
            value={int(weekly.closes)}
            sub={`week ${week.week} · ${money(weekly.cash_collected)}`}
            tone={weekly.closes > 0 ? 'accent' : 'default'}
          />
        </div>
      </section>

      <section>
        <SectionTitle>21-day pace</SectionTitle>
        <div className="card p-3">
          <Suspense fallback={<div className="h-64" />}>
            <PaceChart data={series} today={today} />
          </Suspense>
        </div>
      </section>

      <section>
        <SectionTitle
          right={
            <Link to="/pipeline" className="text-xs text-accent">
              Open pipeline →
            </Link>
          }
        >
          Pipeline
        </SectionTitle>
        <div className="card divide-y divide-line">
          {stages.length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted">
              {loading ? 'Loading…' : 'No deals yet.'}
            </p>
          ) : (
            stages.map((s) => (
              <div key={s.stage} className="flex items-center gap-3 px-3 py-2.5">
                <span className="flex-1 text-sm">{s.stage}</span>
                <span className="num text-sm text-muted">{int(s.count)}</span>
                <span className="num text-sm w-20 text-right">{money(s.value)}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
