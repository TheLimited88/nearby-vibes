# Multi-stage build for Nearby Vibes API

# Build stage
FROM node:18-alpine AS builder

WORKDIR /build

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json apps/backend/
COPY packages/types/package.json packages/types/

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source
COPY apps/backend ./apps/backend
COPY packages/types ./packages/types
COPY tsconfig.json ./

# Build
WORKDIR /build/apps/backend
RUN pnpm build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files from builder
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json apps/backend/

# Install production dependencies only
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /build/apps/backend/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/main.js"]
