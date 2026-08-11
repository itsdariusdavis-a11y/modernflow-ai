import { SectionTitle } from '@/components/AppShell';
import { StatCard } from '@/components/StatCard';
import { StaleBanner } from '@/components/StaleBanner';
import { useStore, EMPTY } from '@/lib/store';
import { unitEconomics, dealValue } from '@/lib/calc';
import { decimal, int, money } from '@/lib/format';
import { DELIVERED_STAGES } from '@shared/types';

/**
 * Small screen, big decision. This is the number that says whether the $500
 * full-cycle offer is worth continuing to sell at that price in September.
 */
export default function UnitEconomics() {
  const { data, stale, error, refresh } = useStore();
  const snapshot = data ?? EMPTY;
  const econ = unitEconomics(snapshot.deals);

  const delivered = snapshot.deals.filter((d) => DELIVERED_STAGES.includes(d.stage));
  const missingHours = delivered.filter((d) => d.delivery_hours <= 0);

  return (
    <div className="space-y-6">
      <StaleBanner
        stale={stale}
        error={error}
        fetchedAt={snapshot.fetched_at}
        onRetry={() => void refresh()}
      />

      <div>
        <h1 className="text-xl font-semibold">Unit economics</h1>
        <p className="text-sm text-muted">
          Effective hourly on the {money(econ.cycleValue)} full cycle.
        </p>
      </div>

      {econ.hoursLogged === 0 ? (
        <p className="card px-3 py-6 text-sm text-muted text-center">
          No delivered sites with hours recorded yet. Add delivery hours on a deal once it
          reaches Delivered.
        </p>
      ) : (
        <>
          <section
            className={`card border-l-4 p-4 ${econ.belowFloor ? 'border-danger' : 'border-accent'}`}
          >
            <p className="text-xs uppercase tracking-wider text-muted">Effective hourly</p>
            <p
              className={`num text-5xl font-bold mt-1 ${
                econ.belowFloor ? 'text-danger' : 'text-accent'
              }`}
            >
              {money(econ.effectiveHourly)}
              <span className="text-lg text-muted font-normal">/hr</span>
            </p>
            <p className={`text-sm mt-2 ${econ.belowFloor ? 'text-danger' : 'text-muted'}`}>
              {econ.belowFloor
                ? `Below the ${money(econ.floor)}/hr floor. Raise September pricing or cut delivery hours.`
                : `Above the ${money(econ.floor)}/hr floor.`}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Avg delivery hours"
              value={decimal(econ.avgHours, 1)}
              sub="per delivered site"
            />
            <StatCard
              label="Sites delivered"
              value={int(econ.deliveredCount)}
              sub={`${int(econ.hoursLogged)} with hours logged`}
            />
            <StatCard label="Total hours" value={decimal(econ.totalHours, 1)} />
            <StatCard
              label="Cycle value"
              value={money(econ.cycleValue)}
              sub="deposit + balance"
            />
          </div>
        </>
      )}

      {missingHours.length > 0 && (
        <section>
          <SectionTitle>Missing hours</SectionTitle>
          <p className="text-xs text-muted mb-2">
            These are excluded from the average, which flatters the number until they&apos;re
            filled in.
          </p>
          <div className="card divide-y divide-line">
            {missingHours.map((d) => (
              <div key={d.id} className="flex items-center gap-3 px-3 py-2.5">
                <span className="flex-1 text-sm truncate">{d.business_name}</span>
                <span className="text-xs text-muted">{d.stage}</span>
                <span className="num text-xs w-16 text-right">{money(dealValue(d))}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {delivered.length > 0 && (
        <section>
          <SectionTitle>Delivered sites</SectionTitle>
          <div className="card divide-y divide-line">
            {delivered
              .filter((d) => d.delivery_hours > 0)
              .map((d) => {
                const hourly = econ.cycleValue / d.delivery_hours;
                return (
                  <div key={d.id} className="flex items-center gap-3 px-3 py-2.5">
                    <span className="flex-1 text-sm truncate">{d.business_name}</span>
                    <span className="num text-xs text-muted">
                      {decimal(d.delivery_hours, 1)}h
                    </span>
                    <span
                      className={`num text-sm w-20 text-right ${
                        hourly < econ.floor ? 'text-danger' : 'text-ink'
                      }`}
                    >
                      {money(hourly)}/hr
                    </span>
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
}
