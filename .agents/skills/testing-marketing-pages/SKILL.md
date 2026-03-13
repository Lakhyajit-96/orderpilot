# Testing OrderPilot Marketing Pages

## Overview
OrderPilot is a Next.js app deployed on Vercel. The marketing pages (homepage, pricing, workflow, customers, controls, security, faq, platform) are public-facing and don't require authentication.

## Local Dev Server Setup
1. `npm install` in the repo root
2. `npx next dev -p 3099` to start the dev server
3. Visit `http://localhost:3099` to test marketing pages

## Vercel Preview Access
- Vercel preview deployments may be behind Vercel's deployment protection (SSO login required)
- If the preview URL redirects to `vercel.com/login`, use the local dev server instead for testing
- Preview URLs follow the pattern: `orderpilot-git-{branch-slug}-{team}.vercel.app`

## Marketing Pages to Test
All marketing subpages should have:
- `MarketingHeader` component at the top (nav with logo, Security, Platform, Workflow, Controls, Dashboard links)
- `SiteFooter` component at the bottom (Product links, Explore links, Contact info, copyright)

Pages:
- `/` - Homepage (also has starfield background effect)
- `/pricing` - Pricing tiers
- `/workflow` - Workflow explanation
- `/customers` - Customer stories/testimonials
- `/controls` - Controls and rollout info
- `/security` - Security & data handling
- `/faq` - FAQ with accordion
- `/platform` - Platform overview with ecosystem fit

## Key Visual Elements to Verify
- Pure black (#000000) background
- Header navigation with dropdown menus
- Footer with product links, explore links, contact info
- Button hover effects (glow shadows, scale)
- Card hover effects (border brightening, shadow deepening)
- Badge glow shadows (colored per variant)
- FAQ accordion open/close animations

## Build & Lint
- `npx eslint .` for linting
- `npx next build` for build verification
- Pre-existing warnings (unused vars in health route and ai-extraction) are expected

## Devin Secrets Needed
- None required for marketing page testing (public pages)
- Clerk auth would be needed for dashboard/app pages testing
