# OrderPilot Web

OrderPilot is an AI order-intake workspace for industrial distributors and wholesalers.

The current build includes:

- premium marketing landing page
- dark-mode-first dashboard shell
- inbox review flow
- orders workspace
- order detail review screen
- settings surface for future integrations, billing, and automation

## Run locally

From `apps/web`:

```bash
pnpm dev
```

Then open `http://localhost:3000`.

## Useful commands

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
pnpm prisma:generate
pnpm prisma:push
```

## Key routes

- `/` — marketing landing page
- `/dashboard` — product command center
- `/inbox` — shared intake inbox
- `/orders` — draft order list
- `/orders/PO-10482` — sample detailed review page
- `/settings` — future system controls

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS v4
- Radix UI primitives
- Framer Motion + GSAP
- Lucide icons

## Next implementation steps

1. Add Clerk middleware and organization sync
2. Push Prisma schema to PostgreSQL
3. Persist organizations, orders, and subscriptions
4. Build upload + mailbox ingestion pipeline
5. Add parser adapter layer and extraction jobs
6. Add ERP export adapters and audit history

## Environment setup

Copy `.env.example` to `.env` and fill in:

- Clerk publishable + secret keys
- PostgreSQL `DATABASE_URL`
- Stripe secret + publishable keys
- Stripe price IDs for the plans

`prisma.config.ts` reads `.env`, so using `.env` keeps Next.js and Prisma on the same local config.

## Product references

- Blueprint: `../../docs/orderpilot-blueprint.md`
