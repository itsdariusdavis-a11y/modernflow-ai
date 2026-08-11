import type { SubmitStatus } from '@/lib/useSubmit';

interface Props {
  status: SubmitStatus;
  error: string | null;
  onSubmit: () => void;
  onRetry: () => void;
  label?: string;
  disabled?: boolean;
}

/**
 * The submit control for every write in the app. A failed save is loud and
 * keeps the payload — the user can retry the exact same submission. Nothing
 * gets dropped quietly.
 */
export function SaveBar({ status, error, onSubmit, onRetry, label = 'Save', disabled }: Props) {
  return (
    <div className="space-y-3">
      {status === 'error' && (
        <div className="rounded-md border border-danger bg-danger/10 px-3 py-3">
          <p className="text-sm text-danger font-medium">Not saved</p>
          <p className="text-sm text-ink/80 mt-0.5 break-words">{error}</p>
          <button type="button" className="btn mt-3 w-full border-danger" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      <button
        type="button"
        className="btn-primary w-full"
        onClick={onSubmit}
        disabled={disabled || status === 'saving'}
      >
        {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : label}
      </button>
    </div>
  );
}
