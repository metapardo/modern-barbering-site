import app from "./app";
import { logger } from "./lib/logger";

// Local dev server only; on Vercel the app is served by api/index.ts.
// Uses API_PORT from the root .env, falling back to 5001 (the Vite dev proxy's target).
const rawPort = process.env["API_PORT"] ?? "5001";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid API_PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
