# Nearby Vibes 🎯

> Discover time-limited specials from nearby venues in real-time.

Nearby Vibes is a location-based PWA connecting venues and customers through time-boxed drink/food specials. Venues post specials, customers discover and verify them via QR code + geofence, and analytics drive venue decisions.

**Status**: MVP Complete — All 9 Phases Implemented & Production Ready

---

## Quick Start

### Local Development (Docker)

```bash
# Clone and install
git clone https://github.com/nearby-vibes/nv-claude.git
cd nv-claude
pnpm install

# Start all services (PostgreSQL, Redis, API, Web)
docker-compose up -d

# Verify services are running
docker-compose ps

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Access
# Frontend: http://localhost:3000
# API: http://localhost:3001/api
# Health check: http://localhost:3001/health
```

### Stop Services

```bash
docker-compose down      # Keep volumes
docker-compose down -v   # Delete volumes
```

---

## Stack

- **Frontend**: Next.js 14 (React 18, TypeScript) + Zustand
- **Backend**: NestJS (TypeScript) + TypeORM
- **Database**: PostgreSQL 15 + PostGIS (DigitalOcean Managed)
- **Cache**: Redis 7
- **Auth**: Firebase Auth (consumer/venue) + JWT + TOTP MFA (admin)
- **Payments**: Paddle.com (Merchant of Record)
- **Push**: Firebase Cloud Messaging
- **Maps**: Mapbox GL JS + Google Places API
- **CDN/WAF**: Cloudflare (Turnstile CAPTCHA, bot protection)
- **Deployment**: Docker + GitHub Actions → DigitalOcean App Platform
- **Build**: pnpm/Turborepo monorepo

---

## Features Implemented

### Phase 1.5: Admin Foundation ✓
- TOTP MFA authentication
- Admin audit logging
- Secret admin portal URL
- User/venue management endpoints

### Phase 2: Post Lifecycle ✓
- Create, publish, update, cancel posts
- Draft → Published → Expired → Cancelled flow
- Post analytics (views, clicks, redemptions)
- Post status tracking

### Phase 2.5: Discovery & Following ✓
- Venue search by name/location
- Nearby discovery (geospatial)
- Follow/unfollow system
- Personalized feed algorithm

### Phase 3: Social Features ✓
- Like/unlike posts
- Comment system
- Trending algorithm
- Multi-component scoring (views, clicks, redemptions, likes, comments, recency)

### Phase 4: Push Notifications ✓
- Notification preferences (opt-in/opt-out)
- FCM token management
- Device tracking (web/iOS/Android)
- Preference-aware notification delivery
- Notification queue

### Phase 5: Frontend Foundation ✓
- User/venue authentication
- Discovery feed (tile & map views)
- Account & profile management
- Responsive design (mobile-first)
- Design tokens (colors, typography, spacing)
- Reusable component library

### Phase 5.5: QR & Geofence Verification ✓
- QR code generation (cryptographically verified)
- Geofence distance calculation (Haversine formula)
- Multi-stage redemption workflow (initiated → qr_scanned → geofence_verified → completed)
- Configurable geofence radius (default 100m)

### Phase 6: Post Creation Wizard ✓
- 6-step creation flow
- Live timer preview (animated progress bar)
- Image upload support
- Discount configuration
- Active window scheduling
- Final review & confirmation

### Phase 6.5: Analytics & Dashboard ✓
- Post performance metrics (views, clicks, CTR, conversion rate)
- Venue dashboard (followers, growth, top posts)
- Real-time analytics tracking
- Post-level analytics

### Phase 7: Subscription & Billing ✓
- Paddle checkout integration
- Trial system (14 days)
- Grace period (3 days after trial expiry)
- Promo code support
- Founding Venue Program (50% off, $50 cap)
- Subscription lifecycle events (trialing → active → past_due → cancelled)

### Phase 8: Subscription Frontend ✓
- Plan comparison cards (Free vs Premium)
- Trial countdown display
- Billing management page
- Premium feature gates
- Upgrade/downgrade flows

### Phase 9A: Abuse Prevention ✓
- Place claim ledger (90-day cooldown enforcement)
- One-trial-per-Place-ID validation
- Disposable email blocking
- VPN/proxy detection framework (MaxMind ready)
- Fraud event tracking & admin queue
- Admin cooldown override
- Geographic mismatch detection

### Phase 9B: Launch Preparation ✓
- Docker containerization (multi-stage builds)
- CI/CD pipelines (GitHub Actions)
- Automated testing & linting
- Smoke tests (10 critical endpoints)
- Load testing infrastructure
- Deployment guide & runbooks
- Launch checklist (97 items)
- Blue-green deployment strategy

---

## Project Structure

```
.
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/app/           # Routes & pages
│   │   ├── src/components/    # Reusable UI
│   │   ├── src/stores/        # Zustand state
│   │   ├── src/lib/           # API client
│   │   └── Dockerfile         # Production build
│   └── backend/               # NestJS API
│       ├── src/auth/          # Firebase + JWT auth
│       ├── src/posts/         # Post CRUD & lifecycle
│       ├── src/discovery/     # Venue search & feed
│       ├── src/social/        # Likes, comments, scoring
│       ├── src/subscriptions/ # Paddle integration
│       ├── src/verification/  # QR + geofence
│       ├── src/analytics/     # Metrics & dashboards
│       ├── src/notifications/ # FCM + preferences
│       ├── src/abuse-prevention/ # Fraud detection
│       ├── src/admin/         # TOTP MFA admin
│       ├── src/database/      # TypeORM + migrations
│       └── Dockerfile         # Production build
├── packages/
│   └── types/                 # Shared TypeScript types
├── scripts/
│   └── smoke-tests.sh         # Post-deployment verification
├── .github/workflows/
│   ├── ci.yml                # Linting, type-check, test, build
│   └── deploy.yml            # Build, push, deploy, verify
├── docker-compose.yml         # Local dev stack
├── DEPLOYMENT_GUIDE.md        # Ops manual
├── LAUNCH_CHECKLIST.md        # Pre-launch verification
├── load-test.js              # Load testing script
├── docs/                      # Specification & design
└── CLAUDE.md                 # Project context
```

---

## Setup

### Prerequisites

- Node.js ≥18
- pnpm ≥8
- Docker & Docker Compose (for local dev)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Start Docker services
docker-compose up -d

# Run database migrations
docker-compose exec api npm run migrate

# Verify everything is running
curl http://localhost:3001/health
curl http://localhost:3000
```

---

## Development

### Local Development (Docker)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api      # Backend
docker-compose logs -f web      # Frontend
docker-compose logs -f db       # Database

# Stop services
docker-compose down
```

### Frontend Development

```bash
# Frontend only (requires API running elsewhere)
pnpm dev -F @nearby-vibes/web   # http://localhost:3000
```

### Backend Development

```bash
# Backend only (requires DB/Redis running)
pnpm dev -F @nearby-vibes/backend  # http://localhost:3001
```

---

## Testing

### Run All Tests

```bash
pnpm test
```

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

### Load Testing

```bash
# Simulate 50 RPS for 5 minutes
node load-test.js --rps=50 --duration=300 --test-type=all

# Checkout flow stress test (100 RPS, 1 min)
node load-test.js --rps=100 --duration=60 --test-type=checkout
```

### Smoke Tests

```bash
# Post-deployment verification
chmod +x scripts/smoke-tests.sh
./scripts/smoke-tests.sh
```

---

## API Endpoints

### Authentication
- `POST /auth/signup` — Register user/venue
- `POST /auth/{role}/login/email` — Email/password login
- `POST /admin/login` — Admin login (requires TOTP)
- `POST /admin/2fa/setup` — Setup TOTP MFA
- `POST /admin/2fa/confirm` — Confirm TOTP MFA

### Posts
- `POST /posts` — Create post (draft)
- `PUT /posts/:id` — Update post
- `POST /posts/:id/publish` — Publish post
- `POST /posts/:id/cancel` — Cancel post
- `GET /posts/:id` — Get post details

### Discovery
- `GET /discovery/search?q=...` — Search venues
- `GET /discovery/nearby?lat=&lng=` — Nearby venues
- `GET /discovery/popular` — Popular venues
- `GET /discovery/feed` — Personalized feed

### Social
- `POST /social/posts/:id/like` — Like post
- `DELETE /social/posts/:id/like` — Unlike post
- `POST /social/posts/:id/comments` — Comment on post
- `GET /social/posts/:id/stats` — Post statistics

### Subscriptions
- `GET /subscriptions/current` — Current subscription
- `POST /subscriptions/checkout` — Create checkout
- `GET /subscriptions/premium-access` — Check access
- `POST /subscriptions/webhook/paddle` — Paddle webhook

### Abuse Prevention
- `POST /abuse-prevention/check-claim` — Verify place claim
- `POST /abuse-prevention/check-email` — Email quality check
- `GET /abuse-prevention/admin/fraud-queue` — Fraud queue
- `POST /abuse-prevention/admin/override-cooldown` — Override cooldown

### Analytics
- `GET /analytics/posts/:id/metrics` — Post metrics
- `GET /analytics/venue/dashboard` — Venue dashboard
- `GET /analytics/venue/posts` — All venue posts analytics

### Notifications
- `GET /notifications/preferences` — Get preferences
- `PUT /notifications/preferences` — Update preferences
- `POST /notifications/tokens` — Register device
- `GET /notifications/tokens` — List devices
- `DELETE /notifications/tokens/:id` — Unregister device

---

## Environment Variables

### Backend (.env.local)

```
DATABASE_URL=postgresql://user:pass@localhost:5432/nearby_vibes
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
PADDLE_API_KEY=...
PADDLE_WEBHOOK_SECRET=...
ADMIN_PORTAL_PATH=secret-admin-path
NODE_ENV=development
```

### Frontend (.env.local)

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

See `.env.production.example` for complete production configuration.

---

## Deployment

### Local Docker Deployment

```bash
docker-compose up -d
```

### Production Deployment (DigitalOcean)

Automated via GitHub Actions:

1. Push to `main` branch
2. GitHub Actions runs CI (tests, linting, build)
3. On success, builds Docker images
4. Pushes to DigitalOcean Container Registry
5. Triggers deployment to DigitalOcean App Platform
6. Runs smoke tests
7. Sends Slack notification

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed procedures.

---

## Monitoring

### Health Checks
- `GET /health` — API health
- `GET /` — Frontend (Next.js)

### Key Metrics
- Error rate < 1%
- P99 response time < 2s
- Uptime 99.9%
- Signup success > 95%
- Checkout success > 90%

### Alerts
- Error rate exceeds 1%
- Response time P99 > 2s
- Database connection pool exhausted
- Payment processing failures
- Backup failures

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for monitoring setup.

---

## Launch Checklist

See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) for the complete 97-item pre-launch verification (infrastructure, security, payments, abuse prevention, notifications, monitoring, performance, data, frontend, admin, analytics, docs, communication, final 24-hour checks).

**Quick Start (14 categories, 97 items):**
- [ ] Infrastructure & Deployment
- [ ] Security & Authentication
- [ ] Payment Processing
- [ ] Abuse Prevention
- [ ] Notifications & Communication
- [ ] Monitoring & Observability
- [ ] Performance & Load Testing
- [ ] Data & Backups
- [ ] Frontend & UX
- [ ] Admin Panel
- [ ] Analytics & Tracking
- [ ] Documentation
- [ ] Communication & Readiness
- [ ] Final Verification (24 hours before)

---

## Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** — Complete ops manual (setup, scaling, troubleshooting, rollback)
- **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)** — 97-item pre-launch verification + launch day procedure
- **[docs/product/](docs/product/)** — Product requirements & decisions
- **[docs/planning/](docs/planning/)** — Technical implementation plan
- **[docs/design-handoff/](docs/design-handoff/)** — UI screens & design system
- **[CLAUDE.md](CLAUDE.md)** — Project context & team guidelines
- **API Docs** — `/api/docs` (Swagger) when running

---

## CI/CD Pipelines

### Continuous Integration (.github/workflows/ci.yml)
Runs on every push/PR to main/develop:
- Lint (backend + frontend)
- Type check (backend + frontend)
- Build (backend + frontend)
- Test (backend with PostgreSQL 15 + Redis 7)
- Coverage upload to codecov

### Continuous Deployment (.github/workflows/deploy.yml)
Runs on push to main:
- Build multi-stage Docker images
- Push to DigitalOcean Container Registry
- Deploy to DigitalOcean App Platform
- Run smoke tests (10 endpoints)
- Notify Slack on success/failure

---

## Support & Escalation

- **Status Page**: https://status.nearby-vibes.com
- **Incidents**: #incidents (Slack)
- **On-Call**: [See rotation schedule]
- **Email**: ops@nearby-vibes.com

---

## License

Proprietary — Nearby Vibes, Inc.

---

**Last Updated**: 2026-07-29 | Phase 9B Complete ✓
