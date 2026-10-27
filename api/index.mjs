// Vercel Function entry for the Express API.
// vercel.json rewrites every /api/* request here; Express still sees the
// original path (e.g. /api/event-requests), so the existing routes match.
// The app is pre-bundled by `pnpm --filter @workspace/api-server run build`
// (part of vercel.json's buildCommand), so Vercel doesn't compile the TS source.
export { default } from "../artifacts/api-server/dist/app.mjs";
