# 🐳 Acquisitions API

A Node.js Express backend application with PostgreSQL support via Neon Database. Includes full CRUD operations, authentication, and authorization features.

**📖 [Türkçe Versiyon / Turkish Version →](README_TR.md)**

---

## 🚀 Quick Start

### Requirements

- Node.js 20.x+
- Docker & Docker Compose (for development)
- Git

### Local Setup

1. **Clone the repository**

```bash
git clone https://github.com/kybrakorkmaz/acquisitions.git
cd acquisitions
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.development
```

4. **Run in development mode**

```bash
# Run with Docker (Neon Local + App)
npm run dev:docker

# Or run app only
npm run dev
```

5. **Test the API**

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api
```

---

## 🐳 Docker Setup

### Development (Neon Local)

```bash
npm run dev:docker
```

This command:

- Starts Neon Local proxy (auto-creates ephemeral database branch)
- Runs Node.js app with hot-reload
- Runs PostgreSQL database locally

### Production

```bash
npm run prod:docker
```

This command:

- Uses Neon Cloud Database URL
- Runs optimized image in production environment

---

## 📦 Available npm Scripts

```bash
# Development
npm run dev                 # Start in watch mode
npm run start              # Start in production mode

# Testing
npm test                   # Run tests with coverage

# Linting & Formatting
npm run lint               # Run ESLint check
npm run lint:fix           # Auto-fix ESLint issues
npm run format             # Auto-format with Prettier
npm run format:check       # Check Prettier format

# Database
npm run db:generate        # Generate Drizzle migration
npm run db:migrate         # Apply migrations
npm run db:push            # Push schema
npm run db:studio          # Open Drizzle Studio

# Docker
npm run dev:docker         # Run dev with Docker (Neon Local)
npm run prod:docker        # Run prod with Docker
```

---

## 🔐 Environment Variables

### Development (.env.development)

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/neondb
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### Production (.env.production)

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...@...neon.tech/...
JWT_SECRET=your-secret-key
ARCJET_KEY=your-arcjet-key
```

---

## 🔗 API Endpoints

### Health Check

```
GET /health
```

### Users

```
GET /api/users              # Get all users
GET /api/users/:id          # Get user by ID
POST /api/users             # Create new user
PUT /api/users/:id          # Update user
DELETE /api/users/:id       # Delete user (Admin only)
```

### Authentication

```
POST /auth/signup           # Sign up
POST /auth/signin           # Sign in
POST /auth/signout          # Sign out
```

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Generate Coverage Report

```bash
npm test -- --coverage
```

Coverage reports are in the `coverage/` directory.

---

## 🚀 CI/CD Pipelines

This project includes 3 GitHub Actions workflows:

### 1. **Lint and Format** ✨

- **Trigger:** Push/PR to `main` and `staging` branches
- **Actions:** ESLint and Prettier checks
- **On Failure:** Posts suggestions on PR as comments

Details: [.github/workflows/lint-and-format.yml](.github/workflows/lint-and-format.yml)

### 2. **Tests** 🧪

- **Trigger:** Push/PR to `main` and `staging` branches
- **Actions:** Runs Jest tests and generates coverage report
- **Artifacts:** Coverage reports retained for 30 days

Details: [.github/workflows/tests.yml](.github/workflows/tests.yml)

### 3. **Docker Build and Push** 🐳

- **Trigger:** Push to `main` branch or manual trigger
- **Actions:** Builds multi-platform Docker image and pushes to Docker Hub
- **Platforms:** linux/amd64, linux/arm64

Details: [.github/workflows/docker-build-and-push.yml](.github/workflows/docker-build-and-push.yml)

### Workflow Setup

To run workflows, configure GitHub Secrets:

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub Personal Access Token

Setup guide: [.github/SECRETS_SETUP.md](.github/SECRETS_SETUP.md)

Workflow documentation: [.github/WORKFLOWS_README.md](.github/WORKFLOWS_README.md)

---

## 📊 Project Structure

```
acquisitions/
├── src/
│   ├── config/              # Configuration files
│   │   ├── arcjet.js       # Security config
│   │   ├── database.js     # Database connection
│   │   └── logger.js       # Winston logger
│   ├── controllers/         # HTTP request handlers
│   │   ├── auth.controller.js
│   │   └── users.controller.js
│   ├── middleware/          # Express middleware
│   │   ├── permissions.middleware.js
│   │   └── security.middleware.js
│   ├── models/              # Drizzle ORM models
│   │   └── user.model.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   └── users.routes.js
│   ├── services/            # Business logic
│   │   ├── auth.service.js
│   │   └── users.services.js
│   ├── utils/               # Utility functions
│   │   ├── cookies.js
│   │   ├── format.js
│   │   └── jwt.js
│   ├── validations/         # Zod validation schemas
│   │   ├── auth.validation.js
│   │   └── users.validation.js
│   ├── app.js              # Express app
│   └── index.js            # Entry point
├── tests/                   # Jest test files
├── drizzle/                 # Database migrations
├── .github/workflows/       # GitHub Actions CI/CD
├── scripts/                 # Bash scripts
├── docker-compose.dev.yml   # Development compose
├── docker-compose.prod.yml  # Production compose
├── Dockerfile              # Docker image config
└── package.json            # Dependencies
```

---

## 🔒 Security Features

- ✅ **Arcjet**: Rate limiting and bot protection
- ✅ **Helmet**: HTTP headers security
- ✅ **CORS**: Cross-origin control
- ✅ **JWT**: Secure token-based authentication
- ✅ **Bcrypt**: Password hashing
- ✅ **Morgan**: Request logging

---

## 📚 Guides

- [Permissions Guide](PERMISSIONS_GUIDE.md) - Authorization system
- [User CRUD Guide](USER_CRUD_GUIDE.md) - User CRUD operations
- [Windows Test Fix](WINDOWS_TEST_FIX.md) - Windows test issues

---

## 📝 Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js 5.x
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Validation:** Zod
- **Testing:** Jest + Supertest
- **Code Quality:** ESLint + Prettier
- **Logging:** Winston
- **Authentication:** JWT + Bcrypt
- **Security:** Helmet, Arcjet, CORS

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All PRs must pass the CI/CD pipeline:

- ✅ Linting
- ✅ Formatting
- ✅ Tests

---

## 📄 License

ISC

---

## 👨‍💻 Author

[kybrakorkmaz](https://github.com/kybrakorkmaz)

---

## 🔗 Links

- [GitHub Repository](https://github.com/kybrakorkmaz/acquisitions)
- [GitHub Issues](https://github.com/kybrakorkmaz/acquisitions/issues)
- [Neon Documentation](https://neon.com/docs)
- [Express.js Documentation](https://expressjs.com)

---

**Last Updated:** 2026-04-10

---

## 🌐 Language / Dil

- **English** - You are here
- **[Türkçe](README_TR.md)** - Türkçe versiyonu okumak için tıklayın
