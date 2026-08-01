# Deployment Guide - Nearby Vibes

Complete setup instructions for deploying the Nearby Vibes PWA to Vercel and Digital Ocean.

## Prerequisites

- Vercel account
- Digital Ocean account
- GitHub repository (public or private)
- Domain name (optional but recommended)

## Frontend Deployment (Vercel)

### 1. Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select "Import Git Repository"
4. Paste your GitHub repository URL
5. Select "Next.js" as the framework

### 2. Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_API_URL=https://api.nearbyvibes.com  # Or your API domain
NEXT_PUBLIC_APP_NAME=Nearby Vibes
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY
```

### 3. Configure Build Settings

- Framework: Next.js
- Root Directory: `./apps/web`
- Build Command: `cd ../.. && npm run build -w @nearby-vibes/web`
- Output Directory: `apps/web/.next`
- Install Command: `npm install`

### 4. Deploy

Click "Deploy" - Vercel will automatically build and deploy your PWA.

## Backend Deployment (Digital Ocean)

### Option 1: App Platform (Recommended)

#### Step 1: Create Container Registry

1. Go to Digital Ocean Control Panel
2. Click "Container Registry"
3. Create a new registry (e.g., `nearby-vibes`)
4. Save your registry name

#### Step 2: Set Up GitHub Actions Secrets

Go to your GitHub repository → Settings → Secrets and add:

```
DIGITALOCEAN_ACCESS_TOKEN=your_token
DIGITALOCEAN_REGISTRY=your_registry_name
DIGITALOCEAN_APP_ID=your_app_id
DIGITALOCEAN_USERNAME=your_username
```

How to get these:
- **ACCESS_TOKEN**: Digital Ocean → API → Tokens → Create New Token
- **APP_ID**: Found in your App Platform URL: `https://cloud.digitalocean.com/apps/{APP_ID}`
- **USERNAME**: `${DIGITALOCEAN_REGISTRY}/${USERNAME}`

#### Step 3: Create App Platform App

1. Go to Digital Ocean → App Platform
2. Click "Create App"
3. Connect your GitHub repository
4. Configure services:

**Service 1: API (Docker)**
- Name: `api`
- Source: Container Registry
- Registry: Select your registry
- Image: `nearby-vibes-api`
- Port: `3001`
- HTTP Routes: `/` → `api:3001`

**Service 2: PostgreSQL Database** (Optional - use managed database)
- Add engine: PostgreSQL 16
- Set credentials
- Connect to API service

5. Set environment variables:
```
DB_HOST=db.ondigitalocean.com
DB_PORT=25060
DB_USER=doadmin
DB_PASSWORD=your_password
DB_NAME=nearby_vibes
JWT_SECRET=generate_secure_key
CORS_ORIGIN=https://nearbyvibes.com
PADDLE_API_KEY=your_key
GOOGLE_PLACES_API_KEY=your_key
ADMIN_PORTAL_SECRET=generate_secure_key
```

6. Click "Create App"

#### Step 4: Configure GitHub Actions

GitHub Actions will automatically build and push to Docker Registry on each push to main.

### Option 2: Droplet Deployment

#### Step 1: Create Droplet

1. Click "Create" → "Droplets"
2. Choose:
   - Image: Ubuntu 24.04 LTS
   - Size: $12/month minimum (2GB RAM, 2 CPUs)
   - Region: Closest to your users
   - Add SSH key
   - Hostname: `api-nearby-vibes`

#### Step 2: SSH into Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

#### Step 3: Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### Step 4: Set Up Application

```bash
# Create app directory
mkdir -p /app/nearby-vibes
cd /app/nearby-vibes

# Create .env file
cat > .env << 'EOF'
DB_HOST=your_db_host
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=nearby_vibes
JWT_SECRET=your_secure_key
NODE_ENV=production
CORS_ORIGIN=https://nearbyvibes.com
PADDLE_API_KEY=your_key
GOOGLE_PLACES_API_KEY=your_key
ADMIN_PORTAL_SECRET=your_secret_key
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  api:
    image: your_registry/nearby-vibes-api:latest
    restart: always
    ports:
      - "3001:3001"
    env_file: .env
    environment:
      NODE_ENV: production
EOF

# Start container
docker-compose up -d
```

#### Step 5: Set Up Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt update
sudo apt install -y nginx

# Create config
sudo tee /etc/nginx/sites-available/api << 'EOF'
server {
    listen 80;
    server_name api.nearbyvibes.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx

# Enable auto-start
sudo systemctl enable nginx
```

#### Step 6: Set Up SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.nearbyvibes.com
```

### Step 3: Set Up Managed PostgreSQL

1. Go to Digital Ocean → Managed Databases
2. Click "Create Cluster"
3. Choose PostgreSQL 16
4. Set master credentials
5. Add trusted sources (your Droplet/App IP)
6. Note connection string

Use connection details in your `.env` file.

## Environment Variable Setup

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://api.nearbyvibes.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyD...
```

### Backend (.env)

```
# Database
DB_HOST=db-postgresql-nyc3-xxxxx.ondigitalocean.com
DB_PORT=25060
DB_USER=doadmin
DB_PASSWORD=xxxxxxxxxxxxx
DB_NAME=nearby_vibes

# Auth
JWT_SECRET=your_64_character_random_string_here

# API
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://nearbyvibes.com

# Paddle (Payment Processing)
PADDLE_API_KEY=test_xxxxx_live_xxxxx

# Google Places
GOOGLE_PLACES_API_KEY=AIzaSyD...

# Admin
ADMIN_PORTAL_SECRET=random_secret_key_here

# Email (optional)
SENDGRID_API_KEY=SG.xxxx
SENDER_EMAIL=noreply@nearbyvibes.com
```

## Monitoring & Logging

### Vercel
- Built-in analytics and logging
- Monitor at: https://vercel.com/dashboard

### Digital Ocean
- App Platform: Built-in logs and metrics
- Droplet: Use `docker logs -f container_name`
- Configure uptime monitoring in Digital Ocean Control Panel

## Database Backups

### Managed PostgreSQL
- Automatic backups (configure retention in settings)
- Restore via Digital Ocean console

### Droplet PostgreSQL
```bash
# Backup
pg_dump -h localhost -U postgres -d nearby_vibes > backup.sql

# Restore
psql -h localhost -U postgres -d nearby_vibes < backup.sql
```

## Domain Setup

### Vercel Frontend
1. In Vercel Project Settings → Domains
2. Add your domain (e.g., `nearbyvibes.com`)
3. Follow DNS instructions

### Digital Ocean API
1. Create A record pointing to your droplet/app IP
2. Add DNS record: `api.nearbyvibes.com` → Digital Ocean IP
3. Wait for DNS propagation

## SSL/TLS Certificates

### Vercel
- Automatic with domain setup

### Digital Ocean
- Use Let's Encrypt (see Droplet section)
- App Platform handles automatically

## Monitoring Checklist

- [ ] Frontend loads on https://nearbyvibes.com
- [ ] API responds on https://api.nearbyvibes.com/auth/signin
- [ ] Database connection working
- [ ] Login/signup flows functional
- [ ] Posts can be created
- [ ] Analytics tracking
- [ ] Paddle payment integration
- [ ] Admin portal login
- [ ] Push notifications (if enabled)
- [ ] Error logging configured

## Troubleshooting

### 502 Bad Gateway
- Check if API is running: `docker ps`
- Check logs: `docker logs container_name`
- Verify environment variables set correctly
- Check firewall/security groups

### Database Connection Failed
- Verify DB host/port/credentials
- Check firewall allows connection
- Confirm database exists and is running

### Build Failures
- Check build logs in Vercel/App Platform
- Ensure all dependencies installed
- Verify TypeScript compiles: `npm run type-check`

### SSL Certificate Issues
- Renew: `sudo certbot renew`
- Debug: `sudo certbot renew --dry-run`

## Post-Deployment

1. Run database migrations
2. Set up admin accounts
3. Configure Paddle webhook
4. Test payment flow
5. Set up monitoring alerts
6. Configure backup schedule
7. Document support procedures

## Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Digital Ocean Docs](https://docs.digitalocean.com)
- [NestJS Deployment](https://docs.nestjs.com/deployment/introduction)
- [Next.js PWA Guide](https://nextjs.org/docs/app-build/rendering/static-rendering)
