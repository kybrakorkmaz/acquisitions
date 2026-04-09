# ============================================
# Base Image
# ============================================
FROM node:20-alpine AS base

WORKDIR /app
RUN apk add --no-cache libc6-compat

# ============================================
# Development Stage
# ============================================
FROM base AS development

ENV NODE_ENV=development

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# ============================================
# Production Stage
# ============================================
FROM base AS production

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Non-root user for security
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

COPY . .
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["npm", "start"]