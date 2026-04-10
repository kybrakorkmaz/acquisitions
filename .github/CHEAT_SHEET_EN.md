# 🚀 GitHub Actions CI/CD Cheat Sheet

Quick reference guide

**📖 [Türkçe Versiyon / Turkish Version →](CHEAT_SHEET.md)**

---

## 📁 File Locations

```
acquisitions/
├── .github/
│   ├── workflows/
│   │   ├── lint-and-format.yml
│   │   ├── tests.yml
│   │   └── docker-build-and-push.yml
│   ├── SETUP_SUMMARY.md (This guide)
│   ├── WORKFLOWS_README.md
│   └── SECRETS_SETUP.md
```

---

## ⚡ Quick Commands

### Local Test

```bash
npm run lint          # ESLint check
npm run lint:fix      # ESLint fix
npm run format        # Prettier format
npm run format:check  # Prettier check
npm test              # Run tests
npm test -- --coverage  # Tests with coverage
```

### Docker

```bash
npm run dev:docker    # Development (Neon Local)
npm run prod:docker   # Production
```

### Database

```bash
npm run db:generate   # Create migration
npm run db:migrate    # Apply migration
npm run db:push       # Push schema
npm run db:studio     # Open Drizzle Studio
```

---

## 🔐 GitHub Secrets Setup

```
Repository Settings → Secrets and variables → Actions

DOCKER_USERNAME = your-docker-username
DOCKER_PASSWORD = your-docker-pat-token
```

**How to create token:**

1. Docker Hub → Account Settings → Security
2. New Access Token → Generate
3. Copy token → Paste to GitHub Secrets

---

## 📊 Workflow Matrix

| File                      | Trigger                | Node | Cache | Cache? |
| ------------------------- | ---------------------- | ---- | ----- | ------ |
| lint-and-format.yml       | push/PR (main,staging) | 20.x | npm   | ✅     |
| tests.yml                 | push/PR (main,staging) | 20.x | npm   | ✅     |
| docker-build-and-push.yml | push (main) + manual   | -    | gha   | ✅     |

---

## 🎯 What Each Workflow Does

### 1. lint-and-format.yml

```
ESLint → Prettier → PR Comment → Fail/Pass
```

### 2. tests.yml

```
PostgreSQL ↓
npm test --coverage → Artifacts → Summary → Comment → Fail/Pass
```

### 3. docker-build-and-push.yml

```
Docker Buildx → amd64 + arm64 → Docker Hub → Summary
```

---

## 🔍 Debugging a Workflow

### GitHub Actions Dashboard

```
1. Repository → Actions
2. Select workflow → Select run
3. Check logs
```

### View PR Comments

```
PR → Conversation tab → Bot comments
```

### Download Artifacts

```
Run details → Artifacts → Download coverage-report
```

---

## 🆘 Common Issues

### Docker Push Failed

```
Check:
- DOCKER_USERNAME secret correct?
- DOCKER_PASSWORD secret correct?
- Token not expired?
- Push permissions on Docker Hub?
```

### Tests Failed

```
1. Run locally: npm test
2. Check coverage: coverage/
3. Read PR comment
```

### Lint/Format Failed

```
1. Fix: npm run lint:fix
2. Format: npm run format
3. Commit and push
```

---

## 📈 Docker Image Tags

Which tags are created?

```
your-username/acquisitions:main              ← Branch name
your-username/acquisitions:main-abc123def    ← Commit SHA
your-username/acquisitions:latest            ← Latest version
your-username/acquisitions:prod-20260410-093045  ← Timestamp
```

---

## ✅ Pre-Push Checklist

Before pushing, run:

```bash
npm run lint:fix      # Fix linting
npm run format        # Fix formatting
npm test              # Run tests
```

Then push:

```bash
git add .
git commit -m "descriptive message"
git push origin main
```

---

## 🔗 Useful Links

- [Workflow Documentation](WORKFLOWS_README.md)
- [Secrets Setup](SECRETS_SETUP.md)
- [Setup Summary](SETUP_SUMMARY.md)
- [Main README](../README.md)

---

## 🎯 Which Branch to Push?

- **main** → All 3 workflows run (Docker also uploads)
- **staging** → lint-and-format + tests run (Docker doesn't upload)
- **Other** → Workflows don't run

---

## 💡 Pro Tips

1. **Test Locally First** - Run `npm test` and `npm run lint` before push
2. **Review Coverage** - Run `npm test -- --coverage` then open `coverage/lcov-report/index.html`
3. **Token Security** - Token is masked in logs (not visible)
4. **Cache Speed** - Repeated workflow runs are faster
5. **Multi-Platform** - Docker image built for both amd64 and arm64

---

## 🚨 Cancel Workflow

In GitHub Actions UI:

```
1. Actions → Active workflow
2. Right menu "..."
3. Select "Cancel workflow"
```

---

## 📞 Support

If issues occur:

1. Check GitHub Actions logs
2. Read WORKFLOWS_README.md
3. Check SECRETS_SETUP.md
4. Run same command locally and debug

---

**Last Updated:** 2026-04-10
