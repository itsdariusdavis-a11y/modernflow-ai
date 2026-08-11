import { useCallback, useRef, useState } from 'react';
import { patchLocal, invalidate, load } from './store';
import type { Snapshot } from '@shared/types';

export type SubmitStatus = 'idle' | 'saving' | 'saved' | 'error';

interface Options<T> {
  /** Applied to the local snapshot immediately, before the network call. */
  optimistic?: (snapshot: Snapshot) => Snapshot;
  /** The actual write. */
  request: () => Promise<T>;
  onSuccess?: (result: T) => void;
}

/**
 * Optimistic write with a visible failure state and a retry that replays the
 * exact same submission. Nothing is ever dropped silently: a failed write rolls
 * the UI back, keeps the payload in hand, and waits for the user to retry.
 */
export function useSubmit() {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const last = useRef<Options<unknown> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(async <T>(opts: Options<T>): Promise<T | null> => {
    last.current = opts as Options<unknown>;
    setStatus('saving');
    setError(null);

    const undo = opts.optimistic ? patchLocal(opts.optimistic) : () => {};

    try {
      const result = await opts.request();
      // The Sheet is now the truth; drop the cache so the next read is real.
      invalidate();
      void load(true);
      opts.onSuccess?.(result);
      setStatus('saved');
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setStatus('idle'), 2500);
      return result;
    } catch (err) {
      undo();
      setError(err instanceof Error ? err.message : 'Save failed');
      setStatus('error');
      return null;
    }
  }, []);

  const retry = useCallback(() => {
    if (last.current) void run(last.current);
  }, [run]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { status, error, run, retry, reset };
}
