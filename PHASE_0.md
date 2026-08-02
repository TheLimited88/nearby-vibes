# Phase 0 — Foundation Setup

**Status:** In Progress  
**Started:** 2026-07-27  
**Target Exit Criteria:** Database schema deployed, authentication foundation working, health checks passing

---

## ✅ Completed

- [x] Monorepo structure (Next.js frontend, NestJS backend, shared types)
- [x] Environment configuration (.env.local files created)
- [x] All API keys gathered and stored securely
- [x] PostgreSQL schema with core tables:
  - `users` (consumer accounts)
  - `venues` (restaurant/bar accounts)
  - `posts` (venue specials/offers)
  - `subscriptions` (trial & billing)
  - `subscription_events` (lifecycle tracking)
  - `admin_users` (admin portal access)
  - `admin_audit_log` (compliance logging)
- [x] TypeORM entities for all core models
- [x] Firebase Admin SDK integration
- [x] Authentication module with Passport/JWT strategy
- [x] Database connection configuration

---

## ⏳ Next Steps (DO THESE NOW)

### 1. Provision DigitalOcean PostgreSQL Database

1. Go to: https://cloud.digitalocean.com
2. Click **Create** → **Databases** → **PostgreSQL**
3. Configure:
   - **Engine:** PostgreSQL 14+
   - **Region:** Choose your preferred region
   - **Cluster name:** `nearby-vibes-db`
4. **Enable PostGIS extension:**
   - Once created, go to Databases → **Flags**
   - Add extension: search for and select `postgis`
5. **Get connection string:**
   - Copy the full connection string from Connection Details
   - It looks like: `postgresql://user:password@db-xxx.ondigitalocean.com:25060/defaultdb?sslmode=require`
6. Update `apps/backend/.env.local`:
   ```
   DATABASE_URL=YOUR_ACTUAL_CONNECTION_STRING
   ```

### 2. Create Admin Portal Secret Path

Generate a non-guessable secret path for the admin portal (e.g., `/admin-xyz789-secret-path`).

**Store it in your password manager or local .env only — NEVER commit it.**

Update `apps/backend/.env.local`:
```
ADMIN_PORTAL_PATH=/your-secret-path-here
```

### 3. Get Cloudflare Account ID

1. Go to: https://dash.cloudflare.com
2. In the sidebar, click **Account** → **General Settings**
3. Copy **Account ID**
4. Update `apps/backend/.env.local`:
   ```
   CLOUDFLARE_R2_ACCOUNT_ID=YOUR_ACCOUNT_ID
   ```

### 4. Get Google Places API Key

1. Go to: https://console.cloud.google.com/
2. Make sure you're in the `claude-nearby-vibes` project (same one as Firebase)
3. Click **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **API Key**
5. Restrict it to **Places API** only (for security)
6. Copy the key
7. Update `apps/backend/.env.local`:
   ```
   GOOGLE_PLACES_API_KEY=YOUR_API_KEY
   ```

### 5. Verify All Secrets in `.env.local`

Check that your `apps/backend/.env.local` has:
- ✅ DATABASE_URL (from DigitalOcean)
- ✅ FIREBASE_* keys (you have these)
- ✅ GOOGLE_PLACES_API_KEY (new)
- ✅ CLOUDFLARE_R2_* keys (you have these)
- ✅ TURNSTILE_SECRET_KEY (you have this)
- ✅ PADDLE_API_KEY (you have this)
- ✅ ADMIN_PORTAL_PATH (generate this)
- ✅ CLOUDFLARE_R2_ACCOUNT_ID (from Cloudflare)

---

## Testing Phase 0

Once you've completed the steps above, Phase 0 is done when:

1. **Database schema deployed:** Tables exist in DigitalOcean Postgres
2. **Backend can start:** `pnpm dev -F @nearby-vibes/backend` runs without errors
3. **Health check passes:** `GET /health` returns `{ status: 'ok', timestamp: '...' }`
4. **Firebase auth ready:** Can verify Firebase ID tokens

---

## Current Stack Status

| Component | Status | Notes |
|-----------|--------|-------|
| PostgreSQL | ⏳ Pending | Awaiting DigitalOcean setup |
| Firebase Auth | ✅ Ready | Project created, credentials stored |
| Firebase Messaging | ✅ Ready | Configured in Firebase project |
| Mapbox GL JS | ✅ Ready | Public token (domain-restricted) |
| Cloudflare R2 | ✅ Ready | Bucket created, credentials stored |
| Cloudflare Turnstile | ✅ Ready | Site key + secret configured |
| Paddle (Sandbox) | ✅ Ready | Sandbox account created |
| Vercel | ⏳ Pending | Authorization issue (will retry) |
| DigitalOcean App Platform | ✅ Ready | Dev project created |

---

## Phase 0 Exit Criteria (from PRD)

- [x] Monorepo set up per spec
- [x] Environment variables configured
- [x] Database schema defined
- [x] Auth foundation (Firebase + Passport) working
- [ ] Database deployed and accessible from backend
- [ ] Health check endpoint responds
- [ ] First TypeORM migration runs successfully

Once all checkmarks are done, Phase 1 (User Onboarding & Auth Endpoints) can begin.

---

## Commands to Remember

```bash
# Install dependencies
pnpm install

# Start backend dev server
pnpm dev -F @nearby-vibes/backend

# Start frontend dev server
pnpm dev -F @nearby-vibes/web

# Build all workspaces
pnpm build

# Run database migrations (happens automatically on app start)
# TypeORM will run migrations from src/database/migrations/*.ts
```

---

## Notes

- All secrets are in `.env.local` which is `.gitignore`'d — never commit them
- Database migrations live in `apps/backend/src/database/migrations/`
- TypeORM entities live in `apps/backend/src/entities/`
- Auth logic is in `apps/backend/src/auth/`
- Firebase Admin SDK is initialized on app startup — no manual setup needed

---

Once Phase 0 setup is complete, the build moves to **Phase 1: User Onboarding & Auth Endpoints**, which will implement:
- User signup/login flows
- Venue claim flow
- Profile setup endpoints
- Initial API routes

