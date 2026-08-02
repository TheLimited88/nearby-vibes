#!/bin/bash
source .env.local

# Extract connection info from DATABASE_URL
# Format: postgresql://user:password@host:port/database?sslmode=require

# Run migrations
psql "$DATABASE_URL" -f src/database/migrations/001_create_users_and_venues.sql
psql "$DATABASE_URL" -f src/database/migrations/002_create_posts_table.sql

echo "Migrations completed"
