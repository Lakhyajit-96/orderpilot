# OrderPilot Web

OrderPilot is an AI order-intake workspace for industrial distributors and wholesalers.

The current build includes:

- premium marketing landing page
- dark-mode-first authenticated dashboard with launch checklist
- inbox ingestion, mailbox sync, and review queue
- orders workspace and order detail review screen
- settings-based guided setup for mailbox, ERP, workflow, and billing
- Gmail and Microsoft OAuth mailbox onboarding
- Stripe billing, customer portal, diagnostics, and replay tools
- ERP/export adapters, retries, and downstream diagnostics

## Core product flow

1. Sign in and provision a workspace.
2. Connect Gmail or Microsoft 365.
3. Sync or ingest the first order.
4. Review exceptions and move the order forward.
5. Configure ERP/export handoff.
6. Verify billing and workspace readiness for launch.

## Run locally

From `apps/web`:

```bash
pnpm dev
```

Then open `http://localhost:3000`.

## Useful commands

```bash
pnpm dev
pnpm test:backend
pnpm lint
pnpm build
pnpm start
pnpm prisma:generate
pnpm prisma:push
```

## Key routes

- `/` — marketing landing page
- `/dashboard` — command center with launch checklist and live review queue
- `/inbox` — shared intake inbox and manual ingestion surface
- `/orders` — persisted order list and review handoff
- `/orders/[orderId]` — detailed order review, approval, and export state
- `/settings` — guided setup for mailbox, workflow, ERP, notifications, and billing

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS v4
- Radix UI primitives
- Framer Motion + GSAP
- Lucide icons
- Clerk auth
- Prisma + PostgreSQL
- Stripe billing

## Current capabilities

- Workspace-aware authentication and automatic workspace provisioning
- Persisted orders, line items, exceptions, notes, approvals, and export runs
- Gmail Pub/Sub and Microsoft Graph-oriented mailbox integration paths
- Workflow policy, reason codes, approval notifications, and undo support
- Billing diagnostics, replay tools, subscription checkout, and customer portal access
- Dashboard launch checklist plus guided onboarding inside Settings

## Environment setup

Copy `.env.example` to `.env` and fill in:

- Clerk publishable + secret keys
- PostgreSQL `DATABASE_URL`
- Stripe secret + publishable keys
- Stripe price IDs for the plans
- Mailbox OAuth credentials for Gmail and/or Microsoft 365 as needed
- Pub/Sub / webhook support values for live mailbox delivery when enabled

`prisma.config.ts` reads `.env`, so using `.env` keeps Next.js and Prisma on the same local config.

## Current product focus

1. Tighten onboarding and launch readiness UX.
2. Increase parsing/extraction intelligence on real customer orders.
3. Prove repeatable customer go-live and day-two operator workflows.

## Product references

- Blueprint: `../../docs/orderpilot-blueprint.md`
