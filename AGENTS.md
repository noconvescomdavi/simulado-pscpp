# AGENTS.md — ESTIBORDO (Simulados PSCPP)

## Project Overview
Next.js 15 App Router app (JavaScript, no TypeScript) for PSCPP exam preparation.
Uses PostgreSQL for persistence, `argon2` for password hashing, `jose` for JWT sessions.

## Stack
- **Runtime:** Node.js >= 20 (compose uses node:22)
- **Framework:** Next.js 15.5 (App Router, `next dev`)
- **Database:** PostgreSQL 16
- **Auth:** JWT cookies via `jose`, sessions stored in `pscpp_session` cookie
- **Native deps:** `argon2` requires build tools (node:22 full image has them)

## Running Locally (Base44)
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Web entry point: http://localhost:3000
- Health check: `GET /api/health?shallow=1` (shallow) or `/api/health` (full, checks DB)
- Postgres runs as a compose service; schema + 33 migrations applied automatically by the `migrate` one-shot service on first boot.

## Required Environment Variables
- `DATABASE_URL` — set automatically by compose (local postgres)
- `AUTH_SECRET` — JWT signing secret (min 32 chars); generated as a dev placeholder, replace with a real value for production
- `NEXT_PUBLIC_APP_URL` — public app URL, set by compose to the preview origin

## Optional External Integrations (non-functional without real credentials)
- Mercado Pago (payments), OpenAI (AI tutor), Gmail OAuth (email), Google OAuth (login), reCAPTCHA, GitHub (PDF library), Google Drive
- All have safe fallbacks — the app boots and renders without them.

## Dev Workflow
- The `npm run dev` script runs data-generation scripts before `next dev` to produce runtime JSON banks from `data/` sources.
- In compose, these generate scripts run on every container start (they are idempotent and hash-checked).
- Source is bind-mounted; edits hot-reload via Next.js dev server.
- `next.config.mjs` includes `allowedDevOrigins` for the Base44 preview origin.

## Database
- Schema: `db/schema.sql` (initial tables)
- Migrations: `db/migrations/*.sql` (applied in sorted order, idempotent)
- Migration script: `scripts/base44-migrate.sh`

## Key Directories
- `app/` — Next.js App Router pages and API routes
- `lib/` — server-side logic (db, auth, exams, payments, etc.)
- `data/` — source question banks, site content, study plans
- `scripts/` — data generation, validation, and audit scripts
- `db/` — schema and migrations
- `public/` — static assets
