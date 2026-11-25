# Chargeblast Stripe Payments

Front-end assessment replica of the Stripe Dashboard **Payments** screen. Next.js App Router, SQLite + Drizzle, TanStack Query, and a Stripe-shaped HTTP API served by this app.

## Credentials

| Email | Password |
| --- | --- |
| `demo@stripe.test` | `demo1234` |

## Local development

```bash
nvm use 24
pnpm install
pnpm db:migrate
pnpm db:seed -- --reset
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), sign in, and open **Payments**.

## Scripts

- `pnpm db:generate` — drizzle-kit generate
- `pnpm db:migrate` — apply migrations
- `pnpm db:seed -- --reset` — deterministic seed (`SEED=20261123`)
- `pnpm test` — Node test runner
- `pnpm build` / `pnpm start`

## Pagination note

List endpoints use **offset pagination** (`page`, `page_size`) instead of Stripe’s cursor pagination (`starting_after` / `ending_before`). Cursor parameters return `400`.

## Docker / Dokploy

Mount a persistent volume at `/app/data` for SQLite (`stripe.db`) and CSV exports.

```bash
docker build -t chargeblast-stripe-payments .
docker run --rm -p 3000:3000 -v stripe-data:/app/data chargeblast-stripe-payments
```

The entrypoint runs `node scripts/migrate.mjs`, seeds when `payments` is empty, then `node server.js`.

Health check: `GET /api/health`.

Compose example: `docker-compose.yml` (expects an external `dokploy-network`).
