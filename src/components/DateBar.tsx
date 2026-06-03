import { isoDate } from "../lib/util";

export function DateBar({
  date,
  onChange,
}: {
  date: string;
  onChange: (d: string) => void;
}) {
  const shift = (days: number) => {
    const d = new Date(`${date}T12:00:00`);
    d.setDate(d.getDate() + days);
    onChange(isoDate(d));
  };
  return (
    <div className="datebar">
      <button onClick={() => shift(-1)} aria-label="Previous day">
        ‹ Prev
      </button>
      <input
        type="date"
        value={date}
        onChange={(e) => e.target.value && onChange(e.target.value)}
      />
      <button onClick={() => onChange(isoDate())}>Today</button>
      <button onClick={() => shift(1)} aria-label="Next day">
        Next ›
      </button>
    </div>
  );
}
