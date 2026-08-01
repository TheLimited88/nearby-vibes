# Quick Start Guide - Nearby Vibes

Get the Nearby Vibes PWA running locally in 5 minutes.

## 1. Installation

```bash
cd /Users/brettwilliams/Desktop/nearby-vibes
npm install
```

## 2. Start Database

```bash
docker-compose up -d postgres
```

## 3. Configure Environment

```bash
# Frontend
cp apps/web/.env.local.example apps/web/.env.local

# Backend
cp apps/api/.env.local.example apps/api/.env.local
```

Update `apps/api/.env.local` with your database info:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=nearby_vibes
JWT_SECRET=dev-secret-key-change-in-prod
```

## 4. Run Development Servers

```bash
npm run dev
```

This starts both:
- Frontend: http://localhost:3000
- API: http://localhost:3001

## 5. Test the App

### Customer Flow
1. Visit http://localhost:3000
2. Click "Sign Up"
3. Create a customer account
4. Browse home page
5. Explore posts and venues

### Venue Flow
1. Click "Become a Venue"
2. Create venue account
3. Visit `/venue/dashboard`
4. Create a post via `/venue/create-post`
5. View analytics at `/venue/analytics`

### Admin Flow
1. Visit `/admin/login`
2. Use test credentials (configure in API)
3. Access admin dashboard
4. Review report queue

## Project Structure

```
nearby-vibes/
├── apps/
│   ├── web/              # Next.js PWA (port 3000)
│   │   └── app/          # App Router with pages
│   └── api/              # NestJS API (port 3001)
│       └── src/          # Core modules
├── packages/
│   └── types/            # Shared TypeScript types
└── Configuration files
```

## Key Pages

### Customer
- `/` - Home/landing
- `/home` - Feed
- `/posts/[id]` - Post detail
- `/venues/[id]` - Venue profile
- `/account` - Settings

### Venue
- `/venue/dashboard` - Main dashboard
- `/venue/create-post` - Post creation wizard
- `/venue/analytics` - Performance metrics

### Admin
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/reports` - Content reports
- `/admin/network-dashboard` - Platform analytics

## API Endpoints

### Auth
- `POST /auth/signup` - Create account
- `POST /auth/signin` - Sign in

### Venues
- `GET /venues/nearby?lat=X&lon=Y` - Find nearby venues
- `POST /venues` - Create venue
- `GET /venues/:id` - Get venue details

### Posts
- `POST /posts` - Create post
- `GET /posts/live` - Get active posts
- `GET /posts/:id` - Get post detail

### Subscriptions
- `POST /subscriptions/:venueId/trial` - Start trial
- `GET /subscriptions/:venueId` - Get status

## Useful Commands

```bash
# Build everything
npm run build

# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Run tests (when added)
npm run test

# View logs
docker-compose logs -f postgres

# Stop services
docker-compose down

# Clean everything
docker-compose down -v
rm -rf node_modules dist .next
```

## Database

Postgres runs in Docker on `localhost:5432`.

**Credentials:**
- User: `postgres`
- Password: `password`
- Database: `nearby_vibes`

To access:
```bash
docker exec -it nearby-vibes-postgres psql -U postgres -d nearby_vibes
```

## Troubleshooting

### Port already in use
```bash
# Find what's using port
lsof -i :3000  # frontend
lsof -i :3001  # api
lsof -i :5432  # database

# Kill process (replace PID)
kill -9 PID
```

### Database connection failed
```bash
# Check if postgres is running
docker ps | grep postgres

# View logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

### Build errors
```bash
# Clean install
rm -rf node_modules
npm install

# Check TypeScript
npm run type-check

# Check linting
npm run lint
```

### Module not found errors
```bash
# Rebuild shared types
npm run build -w @nearby-vibes/types

# Reinstall dependencies
npm install

# Clear Next.js cache
rm -rf apps/web/.next
```

## Next Steps

1. **Review the design handoff** - See `/tmp/design_handoff_nearby_vibes/` for reference designs
2. **Implement remaining screens** - Each design file in the handoff has UI/UX specifications
3. **Connect to APIs** - Wire up frontend components to backend endpoints
4. **Add authentication** - Implement password reset, email verification
5. **Configure Paddle** - Set up subscription processing
6. **Test thoroughly** - Complete user flows end-to-end
7. **Deploy** - Follow DEPLOYMENT.md for Vercel + Digital Ocean setup

## Support Files

- `README.md` - Complete project documentation
- `DEPLOYMENT.md` - Step-by-step deployment guide
- `CLAUDE.md` - Project guidelines for Claude Code
- Design handoff in `/tmp/design_handoff_nearby_vibes/`

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Digital Ocean Docs](https://docs.digitalocean.com)

Happy coding! 🚀
