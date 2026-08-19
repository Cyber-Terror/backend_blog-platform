# Stage 1: builder
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: production
FROM node:24-alpine AS production
RUN apk add --no-cache postgresql-client

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --chown=nestjs:nodejs public ./public
COPY --chown=nestjs:nodejs scripts/start.sh ./scripts/
COPY --from=builder --chown=nestjs:nodejs /app/healthcheck.js ./

RUN chmod +x ./scripts/start.sh

USER nestjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["./scripts/start.sh"]
