import { useEffect, useRef, useState } from 'react';
import { TextArea } from '@/components/Fields';
import { SaveBar } from '@/components/SaveBar';
import { StaleBanner } from '@/components/StaleBanner';
import { SectionTitle } from '@/components/AppShell';
import { useMe } from '@/context/AuthContext';
import { useStore, EMPTY } from '@/lib/store';
import { useSubmit } from '@/lib/useSubmit';
import { post } from '@/lib/api';
import { STANDUP_DUE_HOUR } from '@shared/config';
import { hourLA, shortDate, timeLA, todayLA } from '@shared/dates';
import { PEOPLE, type Standup as StandupRow } from '@shared/types';

export default function Standup() {
  const me = useMe();
  const { data, stale, error, refresh } = useStore();
  const snapshot = data ?? EMPTY;
  const today = todayLA();
  const submit = useSubmit();

  const mine = snapshot.standups.find((s) => s.date === today && s.person === me);
  const [form, setForm] = useState({ yesterday: '', today: '', blocker: '' });

  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current || !mine) return;
    hydrated.current = true;
    setForm({ yesterday: mine.yesterday, today: mine.today, blocker: mine.blocker });
  }, [mine]);

  function save() {
    const row: StandupRow = {
      date: today,
      person: me,
      ...form,
      submitted_at: new Date().toISOString(),
    };

    void submit.run({
      optimistic: (s) => ({
        ...s,
        standups: [...s.standups.filter((x) => !(x.date === today && x.person === me)), row],
      }),
      request: () => post('/standup', row),
    });
  }

  const pastDue = hourLA() >= STANDUP_DUE_HOUR;

  return (
    <div className="space-y-6">
      <StaleBanner
        stale={stale}
        error={error}
        fetchedAt={snapshot.fetched_at}
        onRetry={() => void refresh()}
      />

      <div>
        <h1 className="text-xl font-semibold">Standup</h1>
        <p className="text-sm text-muted">{shortDate(today)}</p>
      </div>

      <div className="space-y-4">
        <TextArea
          label="Yesterday"
          value={form.yesterday}
          onChange={(v) => setForm((f) => ({ ...f, yesterday: v }))}
          placeholder="What you actually finished."
        />
        <TextArea
          label="Today"
          value={form.today}
          onChange={(v) => setForm((f) => ({ ...f, today: v }))}
          placeholder="What you'll finish today."
        />
        <TextArea
          label="Blocker"
          value={form.blocker}
          onChange={(v) => setForm((f) => ({ ...f, blocker: v }))}
          placeholder="Empty if nothing."
          rows={2}
        />

        <SaveBar
          status={submit.status}
          error={submit.error}
          onSubmit={save}
          onRetry={submit.retry}
          label={mine ? 'Update standup' : 'Submit standup'}
        />
      </div>

      <section>
        <SectionTitle>Both</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PEOPLE.map((person) => {
            const row = snapshot.standups.find((s) => s.date === today && s.person === person);
            return (
              <div key={person} className="card p-3">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="font-semibold">{person}</h3>
                  {row ? (
                    <span className="num text-xs text-muted">{timeLA(row.submitted_at)}</span>
                  ) : (
                    <span className={`text-xs ${pastDue ? 'text-warn' : 'text-muted'}`}>
                      {pastDue ? `not submitted · past ${STANDUP_DUE_HOUR}am` : 'not submitted'}
                    </span>
                  )}
                </div>

                {row ? (
                  <dl className="space-y-2 text-sm">
                    <Entry label="Yesterday" value={row.yesterday} />
                    <Entry label="Today" value={row.today} />
                    {row.blocker && (
                      <div>
                        <dt className="text-[11px] uppercase tracking-wide text-warn">
                          Blocker
                        </dt>
                        <dd className="text-ink break-words">{row.blocker}</dd>
                      </div>
                    )}
                  </dl>
                ) : (
                  <p className="text-sm text-muted">—</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Entry({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="text-ink break-words whitespace-pre-wrap">{value || '—'}</dd>
    </div>
  );
}
