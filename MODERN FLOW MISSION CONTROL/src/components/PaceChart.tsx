import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PacePoint } from '@/lib/calc';
import { money } from '@/lib/format';
import { tinyDate } from '@shared/dates';

const ACCENT = '#22c55e';
const MUTED = '#8b9aa8';
const LINE = '#22303c';

/**
 * One real series (cash actually collected) against a neutral dashed reference
 * line (the straight line to $3,000). The reference line is deliberately gray
 * and dashed so it reads as a target, not as a second measure — and so the two
 * are told apart by shape as well as color.
 */
export function PaceChart({ data, today }: { data: PacePoint[]; today: string }) {
  const lastActual = [...data].reverse().find((d) => d.actual !== null);

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <Legend color={ACCENT} label="Collected" />
        <Legend color={MUTED} label="Pace to $3,000" dashed />
      </div>

      <div className="h-56 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={LINE} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: MUTED, fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: LINE }}
              interval={3}
            />
            <YAxis
              tick={{ fill: MUTED, fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              width={42}
              tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))}
            />
            <Tooltip
              cursor={{ stroke: MUTED, strokeWidth: 1 }}
              content={<PaceTooltip />}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="pace"
              stroke={MUTED}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke={ACCENT}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: ACCENT, stroke: '#0a0f14', strokeWidth: 2 }}
              connectNulls={false}
              isAnimationActive={false}
            />
            {lastActual && (
              <ReferenceDot
                x={lastActual.label}
                y={lastActual.actual ?? 0}
                r={4}
                fill={ACCENT}
                stroke="#0a0f14"
                strokeWidth={2}
                isFront
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted mt-1">
        Through {tinyDate(today)} ·{' '}
        <span className="num text-ink">{money(lastActual?.actual ?? 0)}</span> collected vs{' '}
        <span className="num">{money(lastActual ? lastActual.pace : 0)}</span> on pace
      </p>
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted">
      <svg width="16" height="2" aria-hidden="true">
        <line
          x1="0"
          y1="1"
          x2="16"
          y2="1"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={dashed ? '4 3' : undefined}
        />
      </svg>
      {label}
    </span>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: { payload: PacePoint }[];
}

function PaceTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const delta = point.actual === null ? null : point.actual - point.pace;

  return (
    <div className="rounded-md border border-line bg-surface2 px-3 py-2 text-xs">
      <p className="text-muted mb-1">{tinyDate(point.date)}</p>
      <p className="num text-ink">
        {point.actual === null ? '—' : money(point.actual)} collected
      </p>
      <p className="num text-muted">{money(point.pace)} on pace</p>
      {delta !== null && (
        <p className={`num mt-1 ${delta >= 0 ? 'text-accent' : 'text-warn'}`}>
          {delta >= 0 ? '+' : '−'}
          {money(Math.abs(delta))}
        </p>
      )}
    </div>
  );
}
