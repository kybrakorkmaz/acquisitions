# 🐳 Acquisitions API - Docker Setup Guide

Complete Docker configuration for running the Acquisitions API with Neon Database in both development and production environments.

## 📚 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Configuration](#configuration)
- [Commands Reference](#commands-reference)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Acquisitions API is a secure, scalable Express.js backend with complete authentication features. This Docker setup provides:

| Environment | Database | Setup |
|-------------|----------|-------|
| **Development** | Neon Local (PostgreSQL) | `docker-compose.dev.yml` |
| **Production** | Neon Cloud | `docker-compose.prod.yml` |

### Key Features
✅ Multi-stage Docker builds (optimized images)  
✅ Local PostgreSQL with Neon Local for development  
✅ Neon Cloud integration for production  
✅ Environment variable management  
✅ Health checks and monitoring  
✅ Nginx reverse proxy for production  
✅ Comprehensive logging and debugging  

---

## Architecture

### Development Architecture

```
┌─────────────┐
│   Host      │
│  Machine    │
│             │
│ ┌─────────┐ │
│ │localhost│ │
│ │:3000    │ │
│ └────┬────┘ │
└──────┼──────┘
       │ (port forward)
       │
   Docker Compose Network
   ┌───────────────────┐
   │                   │
   │  ┌─────────────┐  │
   │  │ App Service │  │
   │  │   :3000     │  │
   │  └──────┬──────┘  │
   │         │         │
   │  ┌──────▼──────┐  │
   │  │ Neon Local  │  │
   │  │:5432 (PG)   │  │
   │  └─────────────┘  │
   │                   │
   └───────────────────┘
```

### Production Architecture

```
┌──────────────────────────────────┐
│          Internet                │
│    (HTTPS Traffic)               │
└──────────────────┬───────────────┘
                   │
          ┌────────▼────────┐
          │  Nginx Proxy    │
          │  (Reverse)      │
          │  :80, :443      │
          └────────┬────────┘
                   │
   Docker Compose Network
   ┌───────────────────────┐
   │                       │
   │   ┌───────────────┐   │
   │   │ App Service   │   │
   │   │    :3000      │   │
   │   └────────┬──────┘   │
   │            │          │
   │   (connects via)      │
   │   DATABASE_URL        │
   │            │          │
   └────────────┼──────────┘
                │
     ┌──────────▼──────────┐
     │   Neon Cloud        │
     │ (PostgreSQL)        │
     │ ep-xxx.neon.tech    │
     └─────────────────────┘
```

---

## Development Setup

### Prerequisites

- **Docker Desktop** with Compose enabled
- **Git** for cloning the repository
- **Optional**: PostgreSQL CLI (`psql`) for database debugging

### Quick Start (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/kybrakorkmaz/acquisitions.git
cd acquisitions

# 2. Start development environment
docker-compose -f docker-compose.dev.yml up -d

# 3. Initialize database
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# 4. Test the API
curl http://localhost:3000/health

# Done! 🎉
```

### Detailed Setup

#### Step 1: Clone and Navigate

```bash
git clone https://github.com/kybrakorkmaz/acquisitions.git
cd acquisitions
```

#### Step 2: Review Configuration

```bash
# Check development environment variables
cat .env.development

# Customize if needed
cp .env.development .env.development.local
nano .env.development.local  # Edit as needed
```

#### Step 3: Start Services

```bash
# Start all services in background
docker-compose -f docker-compose.dev.yml up -d

# Expected output:
# Creating acquisitions-neon-local ... done
# Creating acquisitions-app-dev   ... done
```

#### Step 4: Verify Services

```bash
# Check service status
docker-compose -f docker-compose.dev.yml ps

# Expected:
# NAME                         STATUS        PORTS
# acquisitions-neon-local      Up (healthy)  5432->5432
# acquisitions-app-dev         Up (healthy)  3000->3000
```

#### Step 5: Initialize Database

```bash
# Wait for database to be ready (about 10 seconds)
sleep 10

# Run migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Verify tables created
docker-compose -f docker-compose.dev.yml exec neon-local \
  psql -U acquisitions_user -d acquisitions_dev -c "\dt"

# Expected output:
#           List of relations
#  Schema |  Name | Type  |        Owner
# ────────┼───────┼───────┼─────────────────────
#  public | users | table | acquisitions_user
```

#### Step 6: Test API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Sign up (create user)
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "user"
  }'

# Sign in
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Database Access

#### Via Host Machine (localhost)

```bash
# Connect to PostgreSQL directly
psql postgresql://acquisitions_user:acquisitions_password@localhost:5432/acquisitions_dev

# Common commands:
\dt              # List tables
SELECT * FROM users;  # View users
\q              # Quit
```

#### Via Docker Container

```bash
# Execute psql inside container
docker-compose -f docker-compose.dev.yml exec neon-local \
  psql -U acquisitions_user -d acquisitions_dev

# Or as one-liner
docker-compose -f docker-compose.dev.yml exec neon-local \
  psql -U acquisitions_user -d acquisitions_dev -c "SELECT * FROM users;"
```

### Useful Development Commands

```bash
# View logs
docker-compose -f docker-compose.dev.yml logs -f

# View only app logs
docker-compose -f docker-compose.dev.yml logs app -f

# View only database logs
docker-compose -f docker-compose.dev.yml logs neon-local -f

# Restart services
docker-compose -f docker-compose.dev.yml restart

# Stop services
docker-compose -f docker-compose.dev.yml stop

# Start services
docker-compose -f docker-compose.dev.yml start

# Stop and remove everything
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (clean database)
docker-compose -f docker-compose.dev.yml down -v

# Execute commands inside container
docker-compose -f docker-compose.dev.yml exec app npm run lint
docker-compose -f docker-compose.dev.yml exec app npm run format
```

---

## Production Deployment

### Prerequisites

- **Docker** installed on production server
- **Neon Cloud account** with active project
- **Domain name** (optional but recommended)
- **SSL certificate** (for HTTPS)

### Step 1: Get Neon Cloud Connection String

1. Sign up at https://console.neon.tech/
2. Create a new project
3. Copy connection string:
   - Go to: Project Settings → Connection Details
   - Select PostgreSQL
   - Copy the URL

Example: `postgresql://user:password@ep-abc123.neon.tech/acquisitions_prod`

### Step 2: Create Production Environment File

```bash
# Create production config (DO NOT commit to Git)
cat > .env.production << EOF
NODE_ENV=production
PORT=3000
APP_PORT=3000

# Replace with your actual Neon URL
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/acquisitions_prod

# Generate strong secret: openssl rand -base64 32
JWT_SECRET=your_strong_random_secret_here

LOG_LEVEL=info
NODE_TLS_REJECT_UNAUTHORIZED=1
ARCJET_KEY=your_arcjet_key_optional
EOF

# Add to .gitignore (already done)
echo ".env.production" >> .gitignore
```

### Step 3: Build Docker Image

```bash
# Build image
docker build -t acquisitions:latest .

# Tag for registry (Docker Hub example)
docker tag acquisitions:latest myusername/acquisitions:latest

# Push to registry
docker push myusername/acquisitions:latest
```

### Step 4: Deploy

#### Option A: Using docker-compose (Single Server)

```bash
# Load production environment
export $(cat .env.production | xargs)

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Verify
curl http://localhost:3000/health

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Option B: AWS ECS

```bash
# Create ECS task definition with:
# - Image: your_registry/acquisitions:latest
# - Port: 3000
# - Environment: NODE_ENV=production, PORT=3000
# - Secrets: DATABASE_URL, JWT_SECRET (from AWS Secrets Manager)

# Deploy to ECS cluster
aws ecs create-service \
  --cluster acquisitions \
  --service-name acquisitions-api \
  --task-definition acquisitions:1 \
  --desired-count 2
```

#### Option C: Heroku

```bash
# Create app
heroku create acquisitions-api

# Set environment variables
heroku config:set DATABASE_URL="postgres://..."
heroku config:set JWT_SECRET="your_secret"

# Deploy
git push heroku main
```

#### Option D: Railway, Render, Fly.io

Most platforms support Dockerfile deployments. Set environment variables in the platform UI and link your Docker registry.

### Step 5: Initialize Production Database

```bash
# Run migrations on production database
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate

# Verify
docker-compose -f docker-compose.prod.yml exec app npm run db:studio
```

### Step 6: Setup SSL Certificate

```bash
# If using Nginx (included in docker-compose.prod.yml)
# Option A: Use Let's Encrypt with Certbot

# Install Certbot
apt-get install certbot python3-certbot-nginx

# Generate certificate
certbot certonly --standalone -d your-domain.com

# Copy certificates to ssl directory
mkdir -p ssl
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem

# Restart Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## Configuration

### Environment Variables

#### Development (.env.development)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://acquisitions_user:acquisitions_password@neon-local:5432/acquisitions_dev
JWT_SECRET=dev-secret-key
LOG_LEVEL=info
NODE_TLS_REJECT_UNAUTHORIZED=0
```

#### Production (.env.production)

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/acquisitions_prod
JWT_SECRET=your_strong_random_secret
LOG_LEVEL=info
NODE_TLS_REJECT_UNAUTHORIZED=1
ARCJET_KEY=your_optional_key
```

### Docker Compose Variables

Both compose files support `.env` file for easy customization:

```bash
# .env for development
APP_PORT=3000
POSTGRES_USER=acquisitions_user
POSTGRES_PASSWORD=acquisitions_password
POSTGRES_DB=acquisitions_dev

# .env for production
APP_PORT=3000
DATABASE_URL=postgres://...
JWT_SECRET=...
```

---

## Commands Reference

### Development Commands

```bash
# Start
docker-compose -f docker-compose.dev.yml up -d

# Stop
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Database migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Database UI
docker-compose -f docker-compose.dev.yml exec app npm run db:studio

# Linting
docker-compose -f docker-compose.dev.yml exec app npm run lint

# Formatting
docker-compose -f docker-compose.dev.yml exec app npm run format
```

### Production Commands

```bash
# Build image
docker build -t acquisitions:latest .

# Start
docker-compose -f docker-compose.prod.yml up -d

# Stop
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart
docker-compose -f docker-compose.prod.yml restart

# Update (pull latest image and restart)
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

---

## Troubleshooting

### Connection Issues

```bash
# Check if services are running
docker-compose -f docker-compose.dev.yml ps

# Check if ports are available
lsof -i :3000
lsof -i :5432

# Check network connectivity
docker-compose -f docker-compose.dev.yml exec app ping neon-local
```

### Database Issues

```bash
# Check database logs
docker-compose -f docker-compose.dev.yml logs neon-local

# Connect to database
docker-compose -f docker-compose.dev.yml exec neon-local \
  psql -U acquisitions_user -d acquisitions_dev

# Check if migrations ran
SELECT * FROM public."__drizzle_migrations__";
```

### App Issues

```bash
# Check app logs
docker-compose -f docker-compose.dev.yml logs app -f

# Check if DATABASE_URL is set correctly
docker-compose -f docker-compose.dev.yml exec app printenv | grep DATABASE_URL

# Test database connection from app
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

---

## File Structure

```
acquisitions/
├── Dockerfile                    # Multi-stage build
├── docker-compose.dev.yml        # Development setup
├── docker-compose.prod.yml       # Production setup
├── .env.development              # Dev variables
├── .env.production               # Prod variables (use secrets)
├── .env.example                  # Template
├── nginx.conf                    # Nginx config
├── DOCKER_DEPLOYMENT_GUIDE.md    # Detailed guide
├── README_DOCKER.md              # This file
├── src/
│   ├── config/
│   │   ├── database.js           # DB config
│   │   └── logger.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── drizzle/                      # Migrations
└── package.json
```

---

## Security Checklist

- ✅ Environment variables secured (not in version control)
- ✅ Production secrets from AWS Secrets Manager / CI/CD
- ✅ HTTPS/SSL enabled in production
- ✅ Strong JWT secret (32+ characters)
- ✅ Database credentials not in version control
- ✅ Rate limiting on authentication endpoints
- ✅ Security headers (Helmet, CORS)
- ✅ Regular dependency updates

---

## Support & Resources

- 📖 [DOCKER_DEPLOYMENT_GUIDE.md](./DOCKER_DEPLOYMENT_GUIDE.md) - Comprehensive guide
- 🐳 [Docker Docs](https://docs.docker.com/)
- 🌐 [Neon Docs](https://neon.com/docs/)
- 🚀 [Express.js Docs](https://expressjs.com/)
- 🔧 [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

---

**Last Updated:** April 2026  
**Docker Version:** 20.10+  
**Compose Version:** 2.0+  

