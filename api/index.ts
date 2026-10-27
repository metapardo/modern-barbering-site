// Vercel serverless entry for the Express API.
// vercel.json rewrites every /api/* request here; Express still sees the
// original path (e.g. /api/event-requests), so the existing routes match.
import app from "../artifacts/api-server/src/app";

export default app;
