interface Props {
  label: string;
  value: string;
  sub?: string;
  tone?: 'default' | 'accent' | 'warn' | 'danger';
}

const TONE = {
  default: 'text-ink',
  accent: 'text-accent',
  warn: 'text-warn',
  danger: 'text-danger',
} as const;

export function StatCard({ label, value, sub, tone = 'default' }: Props) {
  return (
    <div className="card px-3 py-3">
      <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
      <p className={`num text-2xl font-bold mt-1 ${TONE[tone]}`}>{value}</p>
      {sub && <p className="text-[11px] text-muted mt-0.5">{sub}</p>}
    </div>
  );
}
