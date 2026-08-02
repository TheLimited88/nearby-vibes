# Nearby Vibes Deployment Guide

## Quick Start: Local Development

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ and pnpm installed
- Git configured

### Running Locally

```bash
# Clone the repository
git clone https://github.com/nearby-vibes/nv-claude.git
cd nv-claude

# Install dependencies
pnpm install

# Copy environment files
cp .env.example .env.local
cp .env.production.example .env.production

# Start all services (DB, Redis, API, Web)
docker-compose up -d

# Run database migrations
docker-compose exec api npm run migrate

# Open application
# Frontend: http://localhost:3000
# API: http://localhost:3001/api
# Admin: http://localhost:3000/admin-[your-secret-path]
```

### Stopping Services

```bash
docker-compose down
docker-compose down -v  # Also remove data volumes
```

---

## Staging Deployment

### Infrastructure Setup (DigitalOcean)

```bash
# Create database cluster
# DigitalOcean → Manage → Databases → Create PostgreSQL Database
# - Size: db-s-1vcpu-1gb (staging)
# - Region: NYC3
# - Enable automated backups
# - Enable trusted sources (firewall)

# Create App Platform (or use Docker registry + VPS)
# - Connect GitHub repo
# - Build command: pnpm install && pnpm build
# - Run command: node dist/apps/backend/main.js
# - Set environment variables from .env.production

# Create Redis cluster
# DigitalOcean → Manage → Databases → Create Redis Database
```

### Deploy Staging

```bash
# Build and push Docker images
docker build -t nearby-vibes-api:staging ./apps/backend
docker build -t nearby-vibes-web:staging ./apps/web

# Push to registry (e.g., DigitalOcean Container Registry)
docker push registry.digitalocean.com/nearby-vibes/api:staging
docker push registry.digitalocean.com/nearby-vibes/web:staging

# Deploy using Docker Compose or Kubernetes
docker-compose -f docker-compose.prod.yml up -d

# Verify deployment
curl https://api-staging.nearby-vibes.com/health
curl https://staging.nearby-vibes.com/

# Run migrations
docker-compose -f docker-compose.prod.yml exec api npm run migrate
```

---

## Production Deployment

### Pre-Deployment Checklist

```bash
# 1. Run load tests
node load-test.js \
  --api-url=https://api-staging.nearby-vibes.com/api \
  --duration=300 \
  --rps=50 \
  --test-type=all

# 2. Verify backups
# DigitalOcean → Database → Backups → Restore (to staging, verify data)

# 3. Security audit
./scripts/security-audit.sh

# 4. Performance baseline
./scripts/baseline-performance.sh
```

### Production Rollout

```bash
# 1. Tag release
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0

# 2. Build production images
docker build -t nearby-vibes-api:v1.0.0 ./apps/backend
docker build -t nearby-vibes-web:v1.0.0 ./apps/web

# 3. Push to registry
docker push registry.digitalocean.com/nearby-vibes/api:v1.0.0
docker push registry.digitalocean.com/nearby-vibes/web:v1.0.0

# 4. Update deployment manifests
# Update docker-compose.prod.yml or Kubernetes YAML with new tags

# 5. Deploy to production (blue-green deployment)
# Spin up new containers alongside existing ones
docker-compose -f docker-compose.prod.yml --profile blue up -d

# 6. Run health checks
for i in {1..30}; do
  curl -f https://api.nearby-vibes.com/health && break
  sleep 2
done

# 7. Run smoke tests
./scripts/smoke-tests.sh

# 8. Verify metrics
# Check Datadog/Sentry dashboards for:
#   - Error rate: should be <1%
#   - Response time: P99 should be <2s
#   - Database connections: should be healthy
#   - Payment processing: transactions flowing

# 9. Switch traffic (if using load balancer)
# Update load balancer to point to blue-green (green) environment
# Keep blue running for quick rollback

# 10. Monitor for 1 hour
# Watch dashboards, check error logs, monitor user signups

# 11. Decommission old environment
# Stop blue containers, keep for 24 hours in case of rollback
docker-compose -f docker-compose.prod.yml --profile blue down
```

---

## Rollback Procedure

### Immediate Rollback (If Something Goes Wrong)

```bash
# 1. Stop new deployment
docker-compose -f docker-compose.prod.yml --profile green down

# 2. Restore traffic to previous version (blue)
# Update load balancer backend: blue environment

# 3. Verify
curl https://api.nearby-vibes.com/health

# 4. Investigate what went wrong
# Check Sentry for errors
# Check Datadog for performance issues
# Check logs: docker-compose logs api | tail -100
```

### Database Rollback (If Migration Fails)

```bash
# 1. Stop application
docker-compose -f docker-compose.prod.yml down

# 2. Restore from backup
# DigitalOcean → Database → Backups → Restore
# Choose backup from before migration

# 3. Verify restore
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"

# 4. Redeploy previous version
git checkout v1.0.0-rc1
docker build -t nearby-vibes-api:rollback ./apps/backend
docker-compose -f docker-compose.prod.yml up -d
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

```bash
# API Health
curl -s https://api.nearby-vibes.com/health | jq .

# Database connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# Error rate (Sentry)
# Dashboard → Issues → Unresolved

# Response time (Datadog)
# Metrics → Response Time P99

# Uptime (StatusPage.io)
# Check https://status.nearby-vibes.com
```

### Alert Configuration (Datadog)

```yaml
alerts:
  - name: "API Error Rate High"
    threshold: "error_rate > 1%"
    duration: "5 minutes"
    notify: ["#incidents", "ops@nearby-vibes.com"]

  - name: "API Response Time High"
    threshold: "p99_response_time > 2000ms"
    duration: "5 minutes"
    notify: ["#incidents", "ops@nearby-vibes.com"]

  - name: "Database Connection Pool Exhausted"
    threshold: "db_connections > 18"
    duration: "1 minute"
    notify: ["#incidents", "ops@nearby-vibes.com"]

  - name: "Payment Processing Failed"
    threshold: "paddle_errors > 5 in 10min"
    duration: "1 minute"
    notify: ["#incidents", "billing@nearby-vibes.com"]

  - name: "Backup Failed"
    threshold: "last_backup_age > 25 hours"
    duration: "1 minute"
    notify: ["#incidents", "ops@nearby-vibes.com"]
```

---

## Troubleshooting

### API Not Starting

```bash
# Check logs
docker-compose logs api

# Common issues:
# 1. Database not accessible
#    → Check DATABASE_URL in .env
#    → Verify database firewall rules

# 2. Port 3001 already in use
#    → lsof -i :3001
#    → docker-compose down

# 3. Migration failed
#    → Check migration logs
#    → Restore from backup if needed
```

### High Database Load

```bash
# Check slow queries
psql $DATABASE_URL -c "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"

# Check table sizes
psql $DATABASE_URL -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) FROM pg_tables WHERE schemaname != 'pg_catalog' ORDER BY pg_total_relation_size DESC;"

# Add indexes if needed
psql $DATABASE_URL -c "CREATE INDEX idx_posts_status ON posts(status);"
```

### High Error Rate

```bash
# Check error logs
docker-compose logs api | grep ERROR

# Check Sentry dashboard for common errors

# Check payment processing (Paddle)
# Verify webhook endpoints are receiving events

# Check external service status
# Firebase status: https://status.firebase.google.com
# Paddle status: https://status.paddle.com
```

---

## Maintenance Tasks

### Daily
- Check error rate (<1%)
- Verify backup completed
- Check database size growth

### Weekly
- Review slow queries
- Check fraud queue
- Review user feedback

### Monthly
- Analyze performance trends
- Plan capacity increases
- Review security logs
- Update dependencies

### Quarterly
- Full disaster recovery test
- Security audit
- Performance optimization
- Update documentation

---

## Contact & Escalation

**On-Call Rotation**: [Link to schedule]
**Incident Channel**: #incidents
**Status Page**: https://status.nearby-vibes.com
**Email**: ops@nearby-vibes.com
**PagerDuty**: [Link if applicable]
