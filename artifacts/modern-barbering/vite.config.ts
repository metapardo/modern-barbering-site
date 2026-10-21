import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const isReplit = process.env.REPL_ID !== undefined;

// Read the repo-root .env (if any) for local port settings. This only feeds
// this config file; nothing here is exposed to client code (Vite only exposes
// VITE_-prefixed vars, and only from this package's own directory).
const rootEnv = loadEnv(process.env.NODE_ENV ?? 'development', repoRoot, '');

// Replit sets PORT and BASE_PATH for this artifact. Locally we fall back to
// WEB_PORT (from .env) or 5180, and to "/".
const rawPort = process.env.PORT ?? rootEnv.WEB_PORT ?? '5180';

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? '/';

// Locally, proxy same-origin /api calls to the API server. On Replit the
// platform router already sends /api to the API service, so no proxy there.
const apiPort = Number(process.env.API_PORT ?? rootEnv.API_PORT ?? '5001');
const apiProxy = isReplit
  ? undefined
  : {
      '/api': {
        target: `http://127.0.0.1:${apiPort}`,
        changeOrigin: true,
      },
    };

// The Replit runtime error overlay is a dev nicety; load it if installed but
// never fail startup because of it.
const runtimeErrorOverlay = await import(
  '@replit/vite-plugin-runtime-error-modal'
)
  .then((m) => m.default())
  .catch(() => null);

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    ...(runtimeErrorOverlay ? [runtimeErrorOverlay] : []),
    ...(process.env.NODE_ENV !== 'production' && isReplit
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: apiProxy,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: apiProxy,
  },
});
