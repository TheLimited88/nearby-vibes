# Nearby Vibes - Time-Limited Special Marketplace

A progressive web app (PWA) that connects customers with time-limited drink and food specials at nearby venues.

## Project Structure

```
nearby-vibes/
├── apps/
│   ├── web/              # Next.js PWA frontend
│   └── api/              # NestJS REST API backend
├── packages/
│   └── types/            # Shared TypeScript types
├── docker-compose.yml    # Local development setup
├── Dockerfile            # Production API container
└── vercel.json           # Vercel deployment config
```

## Tech Stack

### Frontend (PWA)
- **Next.js 14** - React framework with SSR/SSG
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **TypeScript** - Type safety

### Backend (API)
- **NestJS** - Progressive Node.js framework
- **TypeORM** - SQL ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Paddle** - Payment processing
- **Socket.io** - Real-time updates (optional)

### Deployment
- **Vercel** - Frontend hosting (PWA)
- **Digital Ocean** - API server (Docker container)
- **PostgreSQL** - Managed database

## Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Local Development

1. **Clone and install dependencies**
   ```bash
   cd nearby-vibes
   npm install
   ```

2. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d postgres
   ```

3. **Set up environment variables**
   ```bash
   # Frontend
   cp apps/web/.env.local.example apps/web/.env.local

   # Backend
   cp apps/api/.env.local.example apps/api/.env.local
   ```

4. **Run development servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - API: http://localhost:3001

### Database Migrations

```bash
# Create initial schema
npm run build -w @nearby-vibes/api
npm run start -w @nearby-vibes/api
```

## Deployment

### Frontend (Vercel)

1. Connect repository to Vercel
2. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: API endpoint (e.g., `https://api.nearbyvibes.com`)
3. Deploy automatically on push to main

### Backend (Digital Ocean)

1. **Create App Platform or Droplet**
   ```bash
   # Option 1: Docker container on App Platform
   # Push image to container registry and deploy

   # Option 2: Droplet with Docker
   docker build -t nearby-vibes-api .
   docker tag nearby-vibes-api your-registry/nearby-vibes-api:latest
   docker push your-registry/nearby-vibes-api:latest
   ```

2. **Set up environment variables**
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_SECRET`
   - `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET`
   - `GOOGLE_PLACES_API_KEY`
   - `ADMIN_PORTAL_SECRET`

3. **Set up PostgreSQL**
   - Create managed PostgreSQL database on Digital Ocean
   - Update `DB_*` environment variables

## API Documentation

### Authentication

#### Sign Up
```bash
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "userType": "customer" | "venue"
}
```

#### Sign In
```bash
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Venues

#### Get Nearby Venues
```bash
GET /venues/nearby?lat=40.7128&lon=-74.0060&radius=5
```

#### Create Venue
```bash
POST /venues
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "The Local Bar",
  "googlePlaceId": "ChIJN1blbX...",
  "address": "123 Main St",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### Posts

#### Create Post
```bash
POST /posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "venueId": "uuid",
  "title": "Happy Hour Special",
  "description": "50% off all drinks",
  "startTime": "2024-08-01T17:00:00Z",
  "endTime": "2024-08-01T20:00:00Z",
  "isPremium": false
}
```

#### Get Live Posts
```bash
GET /posts/live
```

### Subscriptions

#### Start Free Trial
```bash
POST /subscriptions/{venueId}/trial
Authorization: Bearer {token}
```

## Features Implemented

### Phase 0-1: Foundation & Auth
- ✅ Monorepo setup (Next.js + NestJS)
- ✅ User authentication (JWT)
- ✅ Database schema
- ✅ PWA configuration
- ✅ Basic UI components

### Phase 2-3: Posts & Venue Management
- ⏳ Post creation wizard
- ⏳ Post lifecycle (draft → live → expired)
- ⏳ Timer bar component
- ⏳ Venue profile pages

### Phase 4-5: Discovery & Trial Follow
- ⏳ Nearby venues discovery
- ⏳ QR code scanning
- ⏳ 48-hour trial follow
- ⏳ Trial expiry notifications

### Phase 5.5-6.5: Subscriptions & Billing
- ⏳ Paddle integration
- ⏳ 14-day free trial
- ⏳ Free/Premium plans
- ⏳ Founding Venue Program
- ⏳ Trial & re-claim abuse prevention

### Phase 7: Analytics
- ⏳ Venue dashboard
- ⏳ Post performance metrics
- ⏳ Network-wide analytics
- ⏳ Push notification funnel

### Phase 8-9: Admin & Launch
- ⏳ Admin portal
- ⏳ Report queue
- ⏳ User management
- ⏳ Security & SEO hardening
- ⏳ Load testing

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Environment Variables

See `.env.local.example` files in each workspace for required variables.

## Support

For issues or questions, contact the Nearby Vibes team.

## License

Proprietary - © 2024 Nearby Vibes Inc.
