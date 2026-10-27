import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

// Read the repo-root .env (if any) for local port settings. This only feeds
// this config file; nothing here is exposed to client code (Vite only exposes
// VITE_-prefixed vars, and only from this package's own directory).
const rootEnv = loadEnv(process.env.NODE_ENV ?? 'development', repoRoot, '');

const rawPort = process.env.WEB_PORT ?? rootEnv.WEB_PORT ?? '5180';

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid WEB_PORT value: "${rawPort}"`);
}

// In local dev, proxy same-origin /api calls to the Express API server.
// On Vercel, /api is served by the function in api/index.ts (see vercel.json).
const apiPort = Number(process.env.API_PORT ?? rootEnv.API_PORT ?? '5001');
const apiProxy = {
  '/api': {
    target: `http://127.0.0.1:${apiPort}`,
    changeOrigin: true,
  },
};

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
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
