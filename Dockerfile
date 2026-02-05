# Root Dockerfile that builds the UI from ui/ subdirectory
# This is a wrapper for Cloud Run's automatic deployment

FROM node:20-alpine AS base

# Builder stage - single stage for simplicity
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files from ui/
COPY ui/package.json ui/package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY ui/ .

# Build the application using npx to avoid symlink issues
ENV NEXT_TELEMETRY_DISABLED 1
RUN npx next build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
