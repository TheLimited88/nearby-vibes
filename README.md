# Nearby Vibes

A location-based PWA for discovering venue specials. Venues post time-boxed food/drink specials; nearby users discover, follow, and navigate to them. A QR-code-plus-geofence loop verifies posts convert into actual visits.

## Stack

- **Frontend**: Next.js 14 (React 18) hosted on Vercel
- **Backend**: NestJS with TypeORM hosted on DigitalOcean
- **Database**: PostgreSQL with PostGIS extension (DigitalOcean Managed)
- **Storage**: Cloudflare R2
- **CDN/WAF**: Cloudflare (Turnstile for forms)
- **Auth**: Firebase Auth (consumer/venue), separate admin auth with TOTP MFA
- **Push**: Firebase Cloud Messaging
- **Maps**: Mapbox GL JS + Google Places API
- **Payments**: Paddle.com (promo codes via dashboard)
- **Build**: pnpm/Turborepo monorepo

## Project Structure

```
.
├── apps/
│   ├── web/          # Next.js frontend
│   └── backend/      # NestJS API
├── packages/
│   └── types/        # Shared TypeScript types
├── docs/             # Specification & design handoff
│   ├── product/      # PRD, design brief, decisions
│   ├── planning/     # Implementation roadmap
│   └── design-handoff/ # High-fidelity screen references
├── package.json      # Root workspace
├── pnpm-workspace.yaml
├── turbo.json        # Turborepo config
└── tsconfig.json     # Shared TypeScript config
```

## Setup

### Prerequisites

- Node.js ≥18
- pnpm ≥8

### Installation

```bash
# Install pnpm if needed
npm install -g pnpm@8.15.0

# Install dependencies
pnpm install

# Build workspace packages
pnpm build
```

## Development

```bash
# Start all dev servers (frontend + backend)
pnpm dev

# Frontend only (http://localhost:3000)
pnpm dev -F @nearby-vibes/web

# Backend only (http://localhost:3001)
pnpm dev -F @nearby-vibes/backend
```

## Build

```bash
# Build all packages
pnpm build

# Build specific workspace
pnpm build -F @nearby-vibes/web
pnpm build -F @nearby-vibes/backend
```

## Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch
```

## Linting & Type Checking

```bash
# Lint all workspaces
pnpm lint

# Type check all workspaces
pnpm type-check

# Format code
pnpm format
```

## Environment Variables

Create `.env.local` files in each workspace:

**Backend (.env.local)**:
```
DATABASE_URL=postgresql://user:password@host:5432/nearby_vibes
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
MAPBOX_TOKEN=...
GOOGLE_PLACES_API_KEY=...
PADDLE_API_KEY=...
PADDLE_ENVIRONMENT=sandbox
CLOUDFLARE_R2_ACCESS_KEY=...
CLOUDFLARE_R2_SECRET_KEY=...
CLOUDFLARE_R2_BUCKET=...
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_MAPBOX_TOKEN=...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Specification

Read the specification documents in order:

1. `docs/product/Nearby Vibes MVP PRD v1.8.pdf` — full spec with RFC-style REQ-IDs
2. `docs/product/PRD §17.2 Rewrite (v1.9 draft).md` — Post Performance Card
3. `docs/product/PRD §17.3 Rewrite (v1.9 draft).md` — Venue dashboard
4. `docs/product/PRD Addendum — Design Handoff v1.4 (v1.9 draft continued).md` — latest changes
5. `docs/product/PRD Decisions — Phase 0 Sign-off (July 24).md` — resolved PM decisions
6. `docs/planning/Nearby Vibes - Technical Implementation Plan.md` — phase-by-phase build sequence
7. `docs/design-handoff/` — high-fidelity screen references

## Implementation Phases

Follow the sequence in `docs/planning/Nearby Vibes - Technical Implementation Plan.md`:

**Phase 0** → 1.5 → 2 → 2.5 → 5.5 → 6.5 → 3 → 4 → 5 → 6 → 7 → 8 → 9

Each phase has exit criteria. Build phase-by-phase, not all at once.

## Git Workflow

- **Commits**: Reference REQ-IDs for traceability (e.g., "feat: implement REQ-AUTH-001 Firebase login")
- **PRs**: Link to requirements and pass all tests before merging
- **Secrets**: Never commit API keys, DB URLs, or admin portal paths. Use environment variables.

## Support

For issues or questions, refer to:
- The spec documents in `/docs`
- The CLAUDE.md file in this directory
- The PRD Decisions document for PM-resolved decisions
