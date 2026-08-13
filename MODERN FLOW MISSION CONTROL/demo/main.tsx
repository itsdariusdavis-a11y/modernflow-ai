import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from '../src/App';
import { AuthProvider } from '../src/context/AuthContext';
import { TOKEN_KEY, PERSON_KEY } from '../src/lib/api';
import { storage } from '../src/lib/storage';
import { installStub, DEMO_PASSCODE } from './stub';
import '../src/index.css';

/**
 * Demo entry point. Same App, same components, same data layer — only three
 * things differ from production:
 *
 *   1. fetch is stubbed, so there's no Sheet and no server (see stub.ts)
 *   2. HashRouter, because the demo is served as a single static file
 *   3. It starts signed in as Darius, so you land on the dashboard
 *
 * Sign out to see the login screen; the demo passcode is "demo".
 */

installStub();

// Start signed in, and clear any cached snapshot from a previous visit so the
// demo always opens on the sample data.
storage.set(TOKEN_KEY, 'demo.Darius');
storage.set(PERSON_KEY, 'Darius');
storage.remove('mfa_ops_snapshot');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
);

// eslint-disable-next-line no-console
console.info(`MFA Ops demo — passcode is "${DEMO_PASSCODE}". Writes are in-memory only.`);
