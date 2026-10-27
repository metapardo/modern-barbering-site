import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Behind one reverse proxy in deployment (Vercel) and locally (the Vite proxy), so req.ip is the real client
// address used by the per-IP form rate limits. Override with TRUST_PROXY if needed.
const trustProxy = process.env.TRUST_PROXY?.trim();
app.set("trust proxy", !trustProxy ? 1 : /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
