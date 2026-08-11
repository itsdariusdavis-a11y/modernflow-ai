import { NavLink, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { shortDate, todayLA } from '@shared/dates';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/log', label: 'Log' },
  { to: '/standup', label: 'Standup' },
  { to: '/pipeline', label: 'Pipeline' },
  { to: '/review', label: 'Review' },
  { to: '/econ', label: 'Econ' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { person, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="font-semibold tracking-tight">MFA Ops</span>
            <span className="num text-xs text-muted truncate">{shortDate(todayLA())}</span>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="text-xs text-muted hover:text-ink shrink-0"
          >
            {person} · sign out
          </button>
        </div>

        {/* Desktop nav. On phones this collapses to the bottom bar below. */}
        <nav className="hidden sm:block border-t border-line">
          <div className="mx-auto max-w-5xl px-2 flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-sm border-b-2 ${
                    isActive
                      ? 'border-accent text-ink'
                      : 'border-transparent text-muted hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main
        key={location.pathname}
        className="animate-fade flex-1 mx-auto w-full max-w-5xl px-4 py-4 pb-24 sm:pb-8"
      >
        {children}
      </main>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-20 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
        <div className="flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex-1 text-center text-[11px] leading-none py-3.5 ${
                  isActive ? 'text-accent font-semibold' : 'text-muted'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

/** Section heading used across screens. */
export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-2">
      <h2 className="text-xs uppercase tracking-wider text-muted">{children}</h2>
      {right}
    </div>
  );
}
