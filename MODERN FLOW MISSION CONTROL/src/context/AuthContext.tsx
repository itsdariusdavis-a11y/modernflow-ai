import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  PERSON_KEY,
  clearSession,
  getToken,
  login as apiLogin,
  onSessionExpired,
  setSession,
} from '@/lib/api';
import { clearCache } from '@/lib/store';
import { storage } from '@/lib/storage';
import { PEOPLE, type Person } from '@shared/types';

interface AuthValue {
  person: Person | null;
  signIn: (person: Person, passcode: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

function storedPerson(): Person | null {
  const raw = storage.get(PERSON_KEY);
  return PEOPLE.includes(raw as Person) ? (raw as Person) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Signed in only when we hold both a token and a name — the name alone is a
  // leftover from a expired session and shouldn't unlock anything.
  const [person, setPerson] = useState<Person | null>(() =>
    getToken() ? storedPerson() : null,
  );

  useEffect(() => onSessionExpired(() => setPerson(null)), []);

  const signIn = useCallback(async (who: Person, passcode: string) => {
    const { token } = await apiLogin(who, passcode);
    setSession(token, who);
    setPerson(who);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    clearCache();
    setPerson(null);
  }, []);

  const value = useMemo(() => ({ person, signIn, signOut }), [person, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth used outside AuthProvider');
  return ctx;
}

/** The signed-in person, for screens that only render behind the gate. */
export function useMe(): Person {
  const { person } = useAuth();
  if (!person) throw new Error('useMe used outside the auth gate');
  return person;
}
