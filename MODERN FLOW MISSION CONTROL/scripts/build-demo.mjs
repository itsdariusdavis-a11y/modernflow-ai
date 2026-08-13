/**
 * Inlines the demo build into a single self-contained HTML fragment.
 *
 * Output is deliberately a fragment (title + style + root + script) with no
 * <html>/<head>/<body> wrapper, because the artifact host supplies those.
 * It makes no external requests, so it works offline and inside a strict CSP.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist-demo');
const out = path.resolve('dist-demo/mfa-ops-demo.html');

const js = path.join(dist, 'app.js');
const css = path.join(dist, 'app.css');

for (const f of [js, css]) {
  if (!existsSync(f)) {
    console.error(`Missing ${f}. Run: npx vite build --config vite.demo.config.ts`);
    process.exit(1);
  }
}

const script = readFileSync(js, 'utf8');
const styles = readFileSync(css, 'utf8');

// </script> anywhere in the bundle would close the tag early.
const safeScript = script.replace(/<\/script>/gi, '<\\/script>');

const html = `<title>MFA Ops</title>
<style>
${styles}
/* The demo can't load webfonts under the host's CSP, so pin the fallbacks
   explicitly rather than letting the browser pick something proportional
   for the numbers. */
:root { color-scheme: dark; }
html, body { background: #0a0f14; }
.num, .font-mono { font-family: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace; }
</style>
<div id="root"></div>
<script type="module">
${safeScript}
</script>
`;

writeFileSync(out, html);
console.log(`Wrote ${out} — ${(html.length / 1024).toFixed(0)} kB`);
