import app from "./app";
import { logger } from "./lib/logger";

// Replit sets PORT for this service. Locally (no PORT), use API_PORT from the
// root .env, falling back to 5001 (the Vite dev proxy's default target).
const rawPort = process.env["PORT"] ?? process.env["API_PORT"] ?? "5001";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
