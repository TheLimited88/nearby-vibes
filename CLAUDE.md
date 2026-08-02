# Nearby Vibes — project context for Claude Code

Nearby Vibes is a location-based PWA: venues (bars/restaurants) post time-boxed food/drink specials; nearby users discover, follow, and navigate to them; a QR-code-plus-geofence loop verifies posts convert into actual visits. Full spec lives in `/docs` — read it before writing any code.

## Read these first, in this order

1. `docs/product/Nearby Vibes MVP PRD v1.8.pdf` — the spec. RFC-style requirement IDs (REQ-XXX-NNN) are traceable and authoritative.
2. `docs/product/PRD §17.2 Rewrite (v1.9 draft).md` and `PRD §17.3 Rewrite (v1.9 draft).md` — supersede PRD v1.8's §17.2/§17.3 (Post Performance Card / Venue dashboard). Use these, not the PDF, for analytics requirements.
3. `docs/product/PRD Addendum — Design Handoff v1.4 (v1.9 draft continued).md` — new/changed requirements found in the latest design pass (Content Guidelines sheet, Push Sent vs Opens naming, Network Dashboard chart).
4. `docs/product/PRD Decisions — Phase 0 Sign-off (July 24).md` — every open PM decision, resolved. Treat as final; don't re-ask about these.
5. `docs/planning/Nearby Vibes - Technical Implementation Plan.md` — the phase-by-phase build plan (Phase 0 through 9, with exit criteria per phase). This is the sequence to follow.
6. `docs/design-handoff/` — high-fidelity HTML screen references (`.dc.html` files) plus `README.md` (design tokens: colors, type scale, component radii) and `ADDENDUM_post_venue_analytics.md`. Build screens to match these pixel-close, recreated in the target framework's own component patterns — don't embed the reference HTML/CSS directly.
7. `docs/product/Nearby Vibes Design Brief v1.8.pdf` — companion design doc. Where it conflicts with the Handoff on color roles, the Handoff wins (see Decisions doc, item 5).

## Confirmed stack (PRD §20.1 — do not re-litigate)

- Frontend: Next.js, hosted on Vercel
- Backend: NestJS, hosted on DigitalOcean
- Database: PostgreSQL + PostGIS (DigitalOcean Managed Database)
- Object storage: Cloudflare R2
- CDN/edge/WAF/bot protection: Cloudflare (Turnstile for auth/admin forms)
- Auth (consumer/venue): Firebase Auth
- Auth (admin): separate `admin_users` path, mandatory TOTP MFA, non-public portal URL (secret, provisioned out-of-band — never ask for or hardcode the literal path)
- Push: Firebase Cloud Messaging (Web Push)
- Maps: Mapbox GL JS (discovery/geofencing), Google Places API (venue claim import)
- Payments: Paddle.com (Merchant of Record) — promo codes (including the Founding Venue 50%-off/50-cap coupon) are created and managed directly in the Paddle dashboard, not in this app. This app only passes a promo code through at checkout and reads the applied discount back from Paddle's webhook.
- Repo structure: monorepo (this repo), pnpm/Turborepo workspaces, shared TypeScript types package between frontend and backend.

## How to work

- Confirm you've read the phase plan in `docs/planning/Nearby Vibes - Technical Implementation Plan.md` before writing code. Build phase by phase in the sequence it specifies (Phase 0 → 1.5 → 2 → 2.5 → 5.5 → 6.5 → 3 → 4 → 5 → 6 → 7 → 8 → 9), not all at once.
- Stop at each phase's exit criteria (stated per-phase in the plan) and surface working code/tests before moving to the next phase.
- Every functional requirement has a REQ-ID — reference it in commit messages/PR descriptions where relevant, so behavior stays traceable back to spec.
- Secrets (API keys, DB URLs, the admin portal path) come from the user directly as environment variables — never invent placeholder values that look real, never commit secrets to the repo.
