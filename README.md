# Modern Barbering NYC

Marketing site for Modern Barbering NYC (React + Vite front end, Express API that emails form submissions through Resend; no database), in a pnpm workspace. Code lives on GitHub, the site is hosted on Vercel, and email goes through Resend.

## Run locally

### Prerequisites

- **Node.js 22.9 or newer** (Node 24 LTS is recommended, and it matches Vercel's Node 24.x runtime). The API server loads `.env` with `node --env-file-if-exists`, which needs Node 22.9 or newer.
- **pnpm 10 or newer**: `npm install -g pnpm` or `corepack enable`.

### Steps

```bash
pnpm install                 # install all workspace dependencies
cp .env.example .env         # then fill in the values (see below)
pnpm dev                     # start the website and the API together
```

Then open **http://localhost:5180**. The routes are `/`, `/about` and `/policies`.

| Process | Default port | Override |
|---|---|---|
| Website (Vite dev server) | 5180 | `WEB_PORT` in `.env` |
| API (Express) | 5001 | `API_PORT` in `.env` |

The front end calls same-origin `/api/...`. In local dev, Vite proxies `/api` to the API port, so you only ever open the website port. To check the API: `curl http://localhost:5180/api/healthz` should return `{"status":"ok"}`.

Other useful commands:

```bash
pnpm run typecheck                                  # typecheck every package
pnpm --filter @workspace/api-server run dev         # API only
pnpm --filter @workspace/modern-barbering run dev   # website only
```

Notes:

- No database is needed. Without `RESEND_API_KEY` the site and API still run, but submitting the event form shows a "couldn't send" message.
- The default website port is 5180, not Vite's usual 5173, so it doesn't collide with other Vite projects you have running.

## Environment variables

Locally these go in `.env` at the repo root. It is gitignored; `.env.example` is the committed template. On Vercel, set the email variables in **Project Settings → Environment Variables**.

| Variable | Used by | Required | Notes |
|---|---|---|---|
| `WEB_PORT` | Vite config | no (default 5180) | Local only |
| `API_PORT` | API, Vite `/api` proxy | no (default 5001) | Local only |
| `RESEND_API_KEY` | API | for email | Server-only secret. Never commit it or put it in client code |
| `NOTIFY_TO_EMAIL` | API | for email | `modernbarbering@icloud.com` (event inquiries go here) |
| `NOTIFY_FROM_EMAIL` | API | for email | `onboarding@resend.dev` for testing. Use an address on a verified domain in production |

How env is loaded: the API's `start` script runs `node --env-file-if-exists=../../.env`. Variables already set in the shell win over `.env`. The Vite config reads only `WEB_PORT` and `API_PORT` from the root `.env`. No secret is exposed to the browser, because Vite exposes only `VITE_`-prefixed variables.

## Resend setup

The site emails form submissions through [Resend](https://resend.com).

1. **Create the Resend account.** Event inquiries go to `modernbarbering@icloud.com`. While you use the shared test sender `onboarding@resend.dev`, Resend delivers **only to the email address that owns the Resend account**, so either create the account with `modernbarbering@icloud.com` or verify a sending domain (step 5) before relying on delivery.
2. **Create an API key** at https://resend.com/api-keys with the **"Sending access"** permission (not "Full access").
3. **Put it in `.env` locally:**
   ```
   RESEND_API_KEY=re_...
   NOTIFY_TO_EMAIL=modernbarbering@icloud.com
   NOTIFY_FROM_EMAIL=onboarding@resend.dev
   ```
4. **Set the same three variables in Vercel** (Project Settings → Environment Variables, for Production and Preview), then redeploy.
5. **Before production, verify a domain you own** in Resend (Domains, then Add domain), add the SPF and DKIM DNS records it gives you, and change `NOTIFY_FROM_EMAIL` to an address on that domain (e.g. `forms@yourdomain.com`). Until then, mail from the shared test sender may land in spam and can't reach other recipients. DNS changes can take a while to propagate.

The API key lives only on the server. It must never be logged, returned in a response, used in client code, or committed.

## Deploy (Vercel)

GitHub is the source of truth; Vercel deploys from it (pushes to `main` go to production, other branches get preview URLs).

- `vercel.json` (repo root) installs with pnpm, builds only the website (`pnpm --filter @workspace/modern-barbering run build`), and serves `artifacts/modern-barbering/dist/public`.
- `api/index.ts` is a Vercel Function that wraps the same Express app as local dev. `vercel.json` rewrites `/api/*` to it; every other path falls back to `index.html` so `/about` and `/policies` work.
- In the Vercel project, keep **Root Directory** as the repo root and set `RESEND_API_KEY`, `NOTIFY_TO_EMAIL` and `NOTIFY_FROM_EMAIL` under Environment Variables.
- The form rate limits are in memory, so on Vercel they apply per function instance. That still stops quick repeat submissions, but it isn't a global limit.

## Stack notes

From Phase 0 discovery:

- **Workspace:** pnpm workspaces (`artifacts/*`, `lib/*`, `scripts`), TypeScript 5.9, Node 24.
- **Website:** `artifacts/modern-barbering`, a React SPA with `wouter` routing, TanStack Query, Radix UI and Tailwind 4, bundled by Vite 7. Vercel serves the production build as static files from `dist/public`.
- **API:** `artifacts/api-server`, Express 5, bundled by esbuild (`build.mjs`) into `dist/index.mjs`. `dev` runs build and then start. Routes are mounted under `/api` (`/api/healthz`, `/api/event-requests`).
- **Shared libs:** `lib/api-spec` (OpenAPI), and the generated `lib/api-zod` and `lib/api-client-react`. The original `lib/db` (Drizzle + Postgres) package was removed.
- **Event inquiry (`POST /api/event-requests`):** before this work, it validated the request and saved it to Postgres. It sent no email. Now it is email-only: it validates the fields (honeypot, per-IP and per-email rate limits), generates a reference such as `MB-20261021-4F3K`, and emails the inquiry through Resend to `NOTIFY_TO_EMAIL` with Reply-To set to the visitor. The email is the only record, so if the send fails the visitor gets a 503 "couldn't send, please try again" message instead of a success.
- **Booking:** works like the old site (modernbarberingnyc.com): booking happens on Square, opened in a new tab. The Square URLs live in `artifacts/modern-barbering/src/lib/booking.ts`; change a link there and nowhere else.
  - Salon buttons (hero tile, BOOK SALON) open the suite page; mobile buttons (hero tile, BOOK MOBILE) open the mobile page.
  - Generic BOOK NOW buttons open a chooser; picking The Salon or On the Go opens that Square page.
  - Before this work the modal collected a name and email and submitted nothing. Square now collects those details and sends its own booking notifications, so there's no appointment-email endpoint.
- **`booking.js`:** the old site's plain-script version of the same Square URLs. The React app doesn't load it; `src/lib/booking.ts` holds the same URLs.
- **Replit removed:** the project originally ran on Replit. The Replit config (`.replit`, `replit.md`, `.replit-artifact`), Replit Vite plugins, the `mockup-sandbox` design canvas and the database post-merge script were removed. `pnpm-workspace.yaml` keeps the macOS (darwin) native binaries for esbuild, rollup, lightningcss and Tailwind oxide so the app runs on a Mac; pnpm installs only the binary for the current OS.
