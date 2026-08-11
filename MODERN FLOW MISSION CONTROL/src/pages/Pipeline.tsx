import { useMemo, useState } from 'react';
import { SelectField, TextField } from '@/components/Fields';
import { SaveBar } from '@/components/SaveBar';
import { StaleBanner } from '@/components/StaleBanner';
import { SectionTitle } from '@/components/AppShell';
import { useMe } from '@/context/AuthContext';
import { useStore, EMPTY } from '@/lib/store';
import { useSubmit } from '@/lib/useSubmit';
import { post } from '@/lib/api';
import { dealFlags, dealValue } from '@/lib/calc';
import { int, money } from '@/lib/format';
import { STALE_TOUCH_DAYS } from '@shared/config';
import { todayLA, tinyDate } from '@shared/dates';
import { PEOPLE, STAGES, type Deal, type Person, type Stage } from '@shared/types';

type OwnerFilter = 'All' | Person;
type StageFilter = 'All' | Stage;
type SortKey = 'Next action' | 'Last touch' | 'Name' | 'Stage';

export default function Pipeline() {
  const me = useMe();
  const { data, stale, error, refresh } = useStore();
  const snapshot = data ?? EMPTY;
  const today = todayLA();

  const [owner, setOwner] = useState<OwnerFilter>('All');
  const [stage, setStage] = useState<StageFilter>('All');
  const [sort, setSort] = useState<SortKey>('Next action');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const deals = useMemo(() => {
    const filtered = snapshot.deals.filter(
      (d) => (owner === 'All' || d.owner === owner) && (stage === 'All' || d.stage === stage),
    );

    const stageRank = (s: Stage) => STAGES.indexOf(s);
    // Blank dates sort last rather than first — an empty next action isn't urgent.
    const dateKey = (v: string) => v || '9999-12-31';

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'Last touch':
          return dateKey(a.last_touch).localeCompare(dateKey(b.last_touch));
        case 'Name':
          return a.business_name.localeCompare(b.business_name);
        case 'Stage':
          return (
            stageRank(a.stage) - stageRank(b.stage) ||
            dateKey(a.next_action_date).localeCompare(dateKey(b.next_action_date))
          );
        default:
          return dateKey(a.next_action_date).localeCompare(dateKey(b.next_action_date));
      }
    });
  }, [snapshot.deals, owner, stage, sort]);

  const flagged = deals.filter((d) => {
    const f = dealFlags(d, today);
    return f.overdue || f.stale;
  }).length;

  return (
    <div className="space-y-4">
      <StaleBanner
        stale={stale}
        error={error}
        fetchedAt={snapshot.fetched_at}
        onRetry={() => void refresh()}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Pipeline</h1>
          <p className="text-sm text-muted">
            <span className="num">{int(deals.length)}</span> shown
            {flagged > 0 && (
              <span className="text-warn">
                {' '}
                · <span className="num">{int(flagged)}</span> need attention
              </span>
            )}
          </p>
        </div>
        <button className="btn shrink-0" onClick={() => setAdding((v) => !v)}>
          {adding ? 'Cancel' : '+ Deal'}
        </button>
      </div>

      {adding && <AddDeal me={me} onDone={() => setAdding(false)} />}

      <div className="grid grid-cols-3 gap-2">
        <SelectField
          label="Owner"
          value={owner}
          options={['All', ...PEOPLE] as OwnerFilter[]}
          onChange={setOwner}
          compact
        />
        <SelectField
          label="Stage"
          value={stage}
          options={['All', ...STAGES] as StageFilter[]}
          onChange={setStage}
          compact
        />
        <SelectField
          label="Sort"
          value={sort}
          options={['Next action', 'Last touch', 'Name', 'Stage'] as SortKey[]}
          onChange={setSort}
          compact
        />
      </div>

      {deals.length === 0 ? (
        <p className="card px-3 py-6 text-sm text-muted text-center">
          No deals match. Add one when a prospect reaches a real conversation.
        </p>
      ) : (
        <div className="space-y-2">
          {deals.map((deal) => (
            <DealRow
              key={deal.id}
              deal={deal}
              today={today}
              open={editing === deal.id}
              onToggle={() => setEditing((id) => (id === deal.id ? null : deal.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DealRow({
  deal,
  today,
  open,
  onToggle,
}: {
  deal: Deal;
  today: string;
  open: boolean;
  onToggle: () => void;
}) {
  const flags = dealFlags(deal, today);
  const attention = flags.overdue || flags.stale;

  return (
    <div className={`card ${attention ? 'border-warn/60' : ''}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-3 py-3 flex items-start gap-3"
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{deal.business_name || 'Untitled'}</p>
          <p className="text-xs text-muted truncate">
            {deal.owner}
            {deal.contact_name && ` · ${deal.contact_name}`}
            {deal.source && ` · ${deal.source}`}
          </p>

          {attention && (
            <p className="text-xs text-warn mt-1">
              {flags.overdue && `Next action due ${tinyDate(deal.next_action_date)}`}
              {flags.overdue && flags.stale && ' · '}
              {flags.stale &&
                `No touch in ${int(flags.daysSinceTouch)}d (${STALE_TOUCH_DAYS}+)`}
            </p>
          )}
        </div>

        <div className="text-right shrink-0">
          <span
            className={`inline-block text-xs px-2 py-1 rounded border ${
              deal.stage === 'Dead'
                ? 'border-line text-muted'
                : deal.stage === 'Recurring' || deal.stage === 'Balance Paid'
                  ? 'border-accent text-accent'
                  : 'border-line text-ink'
            }`}
          >
            {deal.stage}
          </span>
          <p className="num text-xs text-muted mt-1">{money(dealValue(deal))}</p>
        </div>
      </button>

      {open && <DealEditor deal={deal} onDone={onToggle} />}
    </div>
  );
}

function DealEditor({ deal, onDone }: { deal: Deal; onDone: () => void }) {
  const submit = useSubmit();
  const [stage, setStage] = useState<Stage>(deal.stage);
  const [depositAmount, setDepositAmount] = useState(String(deal.deposit_amount || ''));
  const [depositDate, setDepositDate] = useState(deal.deposit_date || todayLA());
  const [deadReason, setDeadReason] = useState('');
  const [nextAction, setNextAction] = useState(deal.next_action);
  const [nextActionDate, setNextActionDate] = useState(deal.next_action_date);
  const [deliveryHours, setDeliveryHours] = useState(String(deal.delivery_hours || ''));
  const [balanceAmount, setBalanceAmount] = useState(String(deal.balance_amount || ''));
  const [balanceDate, setBalanceDate] = useState(deal.balance_date);

  // The two gates. A stage change that hides a missing number is a lie, so the
  // save button stays disabled until the number exists.
  const needsDeposit = stage === 'Deposit Paid' && (!Number(depositAmount) || !depositDate);
  const needsReason = stage === 'Dead' && !deadReason.trim();
  const blocked = needsDeposit || needsReason;

  function save() {
    const next: Deal = {
      ...deal,
      stage,
      deposit_amount: Number(depositAmount) || 0,
      deposit_date: depositDate,
      balance_amount: Number(balanceAmount) || 0,
      balance_date: balanceDate,
      delivery_hours: Number(deliveryHours) || 0,
      next_action: nextAction,
      next_action_date: nextActionDate,
      last_touch: todayLA(),
      notes: deadReason ? `Dead: ${deadReason} — ${deal.notes}`.trim() : deal.notes,
    };

    void submit.run({
      optimistic: (s) => ({
        ...s,
        deals: s.deals.map((d) => (d.id === deal.id ? next : d)),
      }),
      request: () =>
        post('/deals', {
          action: 'update',
          deal: { ...next, dead_reason: deadReason || undefined },
        }),
      onSuccess: onDone,
    });
  }

  return (
    <div className="border-t border-line p-3 space-y-3">
      <SelectField label="Stage" value={stage} options={STAGES} onChange={setStage} />

      {stage === 'Deposit Paid' && (
        <div className="grid grid-cols-2 gap-2">
          <TextField
            label="Deposit amount"
            type="number"
            value={depositAmount}
            onChange={setDepositAmount}
            required
          />
          <TextField
            label="Deposit date"
            type="date"
            value={depositDate}
            onChange={setDepositDate}
            required
          />
        </div>
      )}

      {stage === 'Balance Paid' && (
        <div className="grid grid-cols-2 gap-2">
          <TextField
            label="Balance amount"
            type="number"
            value={balanceAmount}
            onChange={setBalanceAmount}
          />
          <TextField
            label="Balance date"
            type="date"
            value={balanceDate}
            onChange={setBalanceDate}
          />
        </div>
      )}

      {(stage === 'Delivered' || stage === 'Balance Paid' || stage === 'Recurring') && (
        <TextField
          label="Delivery hours"
          type="number"
          value={deliveryHours}
          onChange={setDeliveryHours}
        />
      )}

      {stage === 'Dead' && (
        <TextField
          label="Why did it die?"
          value={deadReason}
          onChange={setDeadReason}
          placeholder="Price, timing, went silent…"
          required
        />
      )}

      <div className="grid grid-cols-2 gap-2">
        <TextField label="Next action" value={nextAction} onChange={setNextAction} />
        <TextField
          label="Due"
          type="date"
          value={nextActionDate}
          onChange={setNextActionDate}
        />
      </div>

      {deal.notes && <p className="text-xs text-muted break-words">{deal.notes}</p>}

      <SaveBar
        status={submit.status}
        error={submit.error}
        onSubmit={save}
        onRetry={submit.retry}
        label="Save deal"
        disabled={blocked}
      />
      {blocked && (
        <p className="text-xs text-warn">
          {needsDeposit
            ? 'Deposit Paid needs an amount and a date.'
            : 'Marking a deal Dead needs a reason.'}
        </p>
      )}
    </div>
  );
}

function AddDeal({ me, onDone }: { me: Person; onDone: () => void }) {
  const submit = useSubmit();
  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    phone: '',
    source: '',
    owner: me as Person,
  });

  function save() {
    void submit.run({
      request: () =>
        post('/deals', { action: 'create', deal: { ...form, stage: 'Conversation' } }),
      onSuccess: onDone,
    });
  }

  return (
    <div className="card p-3 space-y-3">
      <SectionTitle>New deal</SectionTitle>
      <TextField
        label="Business name"
        value={form.business_name}
        onChange={(v) => setForm((f) => ({ ...f, business_name: v }))}
        required
      />
      <div className="grid grid-cols-2 gap-2">
        <TextField
          label="Contact"
          value={form.contact_name}
          onChange={(v) => setForm((f) => ({ ...f, contact_name: v }))}
        />
        <TextField
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <TextField
          label="Source"
          value={form.source}
          onChange={(v) => setForm((f) => ({ ...f, source: v }))}
          placeholder="Cold call, referral…"
        />
        <SelectField
          label="Owner"
          value={form.owner}
          options={PEOPLE}
          onChange={(v) => setForm((f) => ({ ...f, owner: v }))}
        />
      </div>

      <SaveBar
        status={submit.status}
        error={submit.error}
        onSubmit={save}
        onRetry={submit.retry}
        label="Add deal"
        disabled={!form.business_name.trim()}
      />
    </div>
  );
}
