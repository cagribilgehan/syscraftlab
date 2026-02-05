# 1. Base Image: Hafifletilmiş Node.js (Alpine)
FROM node:18-alpine AS base

# 2. Dependencies: Sadece gerekli kütüphaneleri yükle
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# 3. Builder: Uygulamayı derle (Build)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js Telemetry'yi kapat (Gizlilik ve Hız)
ENV NEXT_TELEMETRY_DISABLED 1

# Projeyi derle
RUN npm run build

# 4. Runner: Sadece çalışan dosyaları al (Production)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Sadece standalone çıktılarını kopyala (Boyutu küçültür)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Cloud Run için Port ayarı (Varsayılan 3000, ama ENV ile ezilebilir)
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
