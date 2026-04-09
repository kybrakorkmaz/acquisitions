# Base
FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./

# ======================
# DEVELOPMENT
# ======================
FROM base AS development

RUN npm install
COPY . .

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]

# ======================
# PRODUCTION
# ======================
FROM base AS production

RUN npm install --omit=dev
COPY . .

ENV NODE_ENV=production

CMD ["npm", "start"]