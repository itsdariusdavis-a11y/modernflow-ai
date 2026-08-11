import { timeLA } from '@shared/dates';

interface Props {
  stale: boolean;
  error: string | null;
  fetchedAt: string | undefined;
  onRetry: () => void;
}

/**
 * Shown when the last read of the Sheet failed but we still have cached data.
 * The numbers on screen are real, just old — say so plainly rather than showing
 * a blank page or, worse, stale numbers that look live.
 */
export function StaleBanner({ stale, error, fetchedAt, onRetry }: Props) {
  if (!stale) return null;

  return (
    <div className="rounded-md border border-warn bg-warn/10 px-3 py-2 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-warn font-medium">
          Showing cached data{fetchedAt ? ` from ${timeLA(fetchedAt)}` : ''}
        </p>
        <p className="text-xs text-ink/70 truncate">{error ?? 'The Sheet is unreachable.'}</p>
      </div>
      <button type="button" className="btn py-2 px-3 text-sm shrink-0" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
