import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PEOPLE, type Person } from '@shared/types';

/**
 * Two names and one shared passcode. The passcode is checked in a Netlify
 * Function and exchanged for a signed token — it is never stored on the device.
 */
export default function Login() {
  const { signIn } = useAuth();
  const [person, setPerson] = useState<Person>('Darius');
  const [passcode, setPasscode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(person, passcode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      setPasscode('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">MFA Ops</h1>
          <p className="text-sm text-muted mt-1">Internal scoreboard. Two seats.</p>
        </div>

        <div>
          <span className="label">Who is this</span>
          <div className="grid grid-cols-2 gap-2">
            {PEOPLE.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPerson(p)}
                className={`btn py-3 ${
                  person === p ? 'border-accent bg-accent/10 text-ink' : 'text-muted'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="label">Passcode</span>
          <input
            type="password"
            className="field num tracking-widest text-center"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoComplete="current-password"
            autoFocus
          />
        </label>

        {error && (
          <p className="text-sm text-danger border border-danger rounded-md px-3 py-2 bg-danger/10">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={busy || !passcode}>
          {busy ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  );
}
