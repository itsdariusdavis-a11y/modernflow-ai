import type { PersonDay } from '@/lib/calc';
import { int } from '@/lib/format';
import { TOUCH_MINIMUM, STANDUP_DUE_HOUR } from '@shared/config';
import { timeLA } from '@shared/dates';

/**
 * The accountability surface. Whether each of us did the work today, stated
 * without commentary. Green when the thing happened, grey when it didn't,
 * amber only where there's an actual gap. No nagging copy — just the fact.
 */
export function PersonTodayPanel({
  day,
  isMe,
  pastStandupTime,
}: {
  day: PersonDay;
  isMe: boolean;
  pastStandupTime: boolean;
}) {
  const touchPct = Math.min(day.touches / TOUCH_MINIMUM, 1) * 100;

  return (
    <div className="card p-3">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="font-semibold">
          {day.person}
          {isMe && <span className="text-muted font-normal text-xs"> · you</span>}
        </h3>
        <Mark ok={day.logged} okLabel="logged" offLabel="no log" />
      </div>

      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[11px] uppercase tracking-wide text-muted">Touches</span>
          <span className="num text-sm">
            <span className={day.metTouchMinimum ? 'text-accent' : 'text-ink'}>
              {int(day.touches)}
            </span>
            <span className="text-muted"> / {TOUCH_MINIMUM}</span>
          </span>
        </div>
        <div className="h-2 bg-surface2 rounded-sm overflow-hidden">
          <div
            className={`h-full ${day.metTouchMinimum ? 'bg-accent' : 'bg-warn'}`}
            style={{ width: `${touchPct}%` }}
          />
        </div>
        {!day.metTouchMinimum && (
          <p className="num text-[11px] text-warn mt-1">{int(day.touchesShort)} short</p>
        )}
      </div>

      <dl className="space-y-1.5 text-sm">
        <Row label="Standup">
          {day.standupSubmitted ? (
            <span className="text-accent num text-xs">{timeLA(day.standupAt)}</span>
          ) : (
            <span className={`text-xs ${pastStandupTime ? 'text-warn' : 'text-muted'}`}>
              {pastStandupTime ? `not in · past ${STANDUP_DUE_HOUR}am` : 'not in'}
            </span>
          )}
        </Row>
        <Row label="Build task">
          <Mark ok={day.buildTaskDone} okLabel="done" offLabel="not done" small />
        </Row>
        <Row label="Conversations">
          <span className="num text-sm">{int(day.conversations)}</span>
        </Row>
      </dl>

      {day.blocker && (
        <div className="mt-3 rounded-md border border-warn/50 bg-warn/10 px-2.5 py-2">
          <p className="text-[11px] uppercase tracking-wide text-warn">Blocker</p>
          <p className="text-sm text-ink mt-0.5 break-words">{day.blocker}</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-muted text-xs">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Mark({
  ok,
  okLabel,
  offLabel,
  small,
}: {
  ok: boolean;
  okLabel: string;
  offLabel: string;
  small?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${small ? 'text-xs' : 'text-sm'} ${
        ok ? 'text-accent' : 'text-muted'
      }`}
    >
      <span aria-hidden="true">{ok ? '✓' : '–'}</span>
      {ok ? okLabel : offLabel}
    </span>
  );
}
