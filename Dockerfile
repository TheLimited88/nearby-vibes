FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo files
COPY package.json pnpm-lock.yaml ./
COPY packages packages
COPY apps/api apps/api

# Install dependencies
RUN npm install --omit=dev

# Build API and types
RUN npm run build -w @nearby-vibes/types
RUN npm run build -w @nearby-vibes/api

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built application
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/.env.local.example ./.env

EXPOSE 3001

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
