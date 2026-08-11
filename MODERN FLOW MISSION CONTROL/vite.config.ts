import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Runs the Netlify functions inside the Vite dev server so `npm run dev` is the
 * only command needed locally — no netlify-cli required. Each request loads the
 * function module through Vite's SSR pipeline, so edits to a function are picked
 * up without a restart. Production still runs the same files on Netlify.
 *
 * `netlify dev` also works if you prefer it; this plugin just makes it optional.
 */
function netlifyFunctionsDev(): Plugin {
  const PREFIX = '/.netlify/functions/';

  return {
    name: 'mfa-ops:netlify-functions-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        if (!url.startsWith(PREFIX)) return next();

        const name = url.slice(PREFIX.length).split('?')[0];
        const file = path.resolve(process.cwd(), 'netlify/functions', `${name}.ts`);
        if (!name || !existsSync(file)) return next();

        try {
          const mod = await server.ssrLoadModule(file);
          const fn = mod.default as (r: Request) => Promise<Response>;

          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && chunks.length > 0;

          const request = new Request(`http://localhost${url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: hasBody ? Buffer.concat(chunks) : undefined,
          });

          const response = await fn(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          // Surface the real stack in the terminal; keep the wire shape JSON so
          // the client's error handling is the same in dev and production.
          server.config.logger.error(`[functions] ${name}: ${(err as Error).stack}`);
          res.statusCode = 500;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ error: (err as Error).message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Functions read plain process.env, so mirror .env into it for dev.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [react(), netlifyFunctionsDev()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
        '@shared': path.resolve(process.cwd(), 'shared'),
      },
    },
    server: { port: 5180, host: true },
    build: { outDir: 'dist', sourcemap: false },
  };
});
