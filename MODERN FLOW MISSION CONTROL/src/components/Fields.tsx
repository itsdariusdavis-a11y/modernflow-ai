import type { ReactNode } from 'react';

/**
 * Form primitives sized for a thumb. Every tap target clears 44px and number
 * inputs get stepper buttons because typing digits one-handed between calls is
 * the thing this app has to make trivial.
 */

export function Label({ children }: { children: ReactNode }) {
  return <span className="label">{children}</span>;
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  hint?: string;
  money?: boolean;
}

export function NumberField({
  label,
  value,
  onChange,
  step = 1,
  hint,
  money,
}: NumberFieldProps) {
  const bump = (delta: number) => onChange(Math.max(0, Number((value + delta).toFixed(2))));

  return (
    <label className="block">
      <Label>{label}</Label>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          className="btn w-14 shrink-0 text-xl leading-none"
          onClick={() => bump(-step)}
        >
          −
        </button>
        <div className="relative flex-1">
          {money && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 num text-muted">$</span>
          )}
          <input
            type="number"
            inputMode="decimal"
            className={`field num text-center text-lg h-full ${money ? 'pl-7' : ''}`}
            value={Number.isFinite(value) ? String(value) : '0'}
            min={0}
            step={step}
            onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          className="btn w-14 shrink-0 text-xl leading-none"
          onClick={() => bump(step)}
        >
          +
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </label>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: TextFieldProps) {
  return (
    <label className="block">
      <Label>
        {label}
        {required && <span className="text-danger"> *</span>}
      </Label>
      <input
        type={type}
        className="field"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextArea({ label, value, onChange, placeholder, rows = 3 }: TextAreaProps) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <textarea
        className="field resize-y"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  /** Tighter type for the three-across filter row, where "Next action" has to fit. */
  compact?: boolean;
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  compact,
}: SelectFieldProps<T>) {
  return (
    <label className="block min-w-0">
      <Label>{label}</Label>
      <select
        className={`field w-full ${compact ? 'px-2 py-2.5 text-[13px]' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

interface ToggleProps {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ label, hint, value, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`w-full flex items-center justify-between gap-3 rounded-md border px-4 py-4 text-left ${
        value ? 'border-accent bg-accent/10' : 'border-line bg-surface2'
      }`}
    >
      <span>
        <span className="block font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
      <span
        className={`shrink-0 w-12 h-7 rounded-full border p-0.5 ${
          value ? 'border-accent bg-accent/30' : 'border-line bg-bg'
        }`}
      >
        <span
          className={`block w-5 h-5 rounded-full ${
            value ? 'translate-x-5 bg-accent' : 'bg-muted'
          }`}
        />
      </span>
    </button>
  );
}
