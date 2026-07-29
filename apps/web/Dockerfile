# Multi-stage build for Nearby Vibes Web

# Build stage
FROM node:18-alpine AS builder

WORKDIR /build

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source
COPY apps/web ./apps/web
COPY tsconfig.json ./

# Build Next.js
WORKDIR /build/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/

# Install production dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# Copy built Next.js app from builder
COPY --from=builder /build/apps/web/.next ./apps/web/.next
COPY --from=builder /build/apps/web/public ./apps/web/public
COPY apps/web/next.config.js ./apps/web/

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["pnpm", "start", "--", "-p", "3000"]
