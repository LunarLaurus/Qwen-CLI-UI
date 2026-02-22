# Qwen CLI UI - Build Guide

Comprehensive guide for building, testing, and deploying Qwen CLI UI.

## Table of Contents

- [Quick Start](#quick-start)
- [Build Requirements](#build-requirements)
- [Build Commands](#build-commands)
- [Automated Build Scripts](#automated-build-scripts)
- [CI/CD Setup](#cicd-setup)
- [Deployment Options](#deployment-options)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Build and start server
npm start
```

---

## Build Requirements

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | 20.19+ or 22.12+ | Runtime environment |
| **npm** | Latest | Package manager |
| **Git** | Latest | Version control |

### Recommended System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 2GB free space
- **OS**: Windows 10+, macOS 11+, Linux (Ubuntu 20.04+)

### Verify Installation

```bash
# Check Node.js version
node --version  # Should be v20.19+ or v22.12+

# Check npm version
npm --version

# Check Git version
git --version
```

---

## Build Commands

### Development Builds

```bash
# Start development server (hot reload)
npm run dev

# Build for development (unminified)
npm run build:dev

# Build with cache bypass
npm run build:clean
```

### Production Builds

```bash
# Standard production build
npm run build

# Build and start production server
npm start

# Full rebuild (clean + install + build)
npm run rebuild
```

### Testing

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Code Quality

```bash
# Run linter
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Type checking (if TypeScript enabled)
npm run typecheck
```

### Cleanup

```bash
# Remove build artifacts
npm run clean
```

---

## Automated Build Scripts

### Windows (PowerShell)

**Location**: `scripts/build.ps1`

```powershell
# Standard production build
.\scripts\build.ps1

# Development build
.\scripts\build.ps1 -Environment development

# Skip tests
.\scripts\build.ps1 -SkipTests

# Clean build
.\scripts\build.ps1 -Clean

# No cache
.\scripts\build.ps1 -NoCache

# Combined options
.\scripts\build.ps1 -Environment production -Clean -NoCache
```

**Parameters**:
- `-Environment`: `production` (default) or `development`
- `-SkipTests`: Skip test execution
- `-Clean`: Remove build artifacts before building
- `-NoCache`: Disable Vite cache

### Linux/macOS (Bash)

**Location**: `scripts/build.sh`

```bash
# Make script executable (first time only)
chmod +x scripts/build.sh

# Standard production build
./scripts/build.sh

# Development build
./scripts/build.sh --environment development

# Skip tests
./scripts/build.sh --skip-tests

# Clean build
./scripts/build.sh --clean

# No cache
./scripts/build.sh --no-cache

# Combined options
./scripts/build.sh --environment production --clean --no-cache
```

**Options**:
- `--environment`: `production` (default) or `development`
- `--skip-tests`: Skip test execution
- `--clean`: Remove build artifacts before building
- `--no-cache`: Disable Vite cache

### npm Script Shortcuts

```bash
# Windows
npm run build:win

# Linux/macOS
npm run build:unix
```

---

## CI/CD Setup

### GitHub Actions

Two workflows are provided:

#### 1. CI Workflow (`.github/workflows/ci.yml`)

Triggers on:
- Push to `main` or `develop` branches
- Pull requests to `main`
- Manual trigger via workflow_dispatch

Jobs:
1. **Lint**: Code linting and type checking
2. **Test**: Run test suite with coverage
3. **Build**: Production build
4. **Docker**: Build Docker image (main branch only)
5. **Deploy**: Deployment placeholder

#### 2. Release Workflow (`.github/workflows/release.yml`)

Triggers on:
- Git tag push (e.g., `v1.6.0`)
- Manual trigger with version input

Jobs:
1. **Release Build**: Full build and test
2. **GitHub Release**: Create release with artifacts
3. **npm Publish**: Optional npm package publishing

### Setting Up GitHub Actions

1. **Enable Actions**: Go to repository Settings → Actions → Enable

2. **Configure Secrets** (for deployment):
   ```
   Settings → Secrets and variables → Actions → New repository secret
   ```

3. **Required Secrets** (customize based on deployment target):
   - `VERCEL_TOKEN`: Vercel deployment token
   - `VERCEL_ORG_ID`: Vercel organization ID
   - `VERCEL_PROJECT_ID`: Vercel project ID
   - `NPM_TOKEN`: npm publishing token (optional)

4. **Manual Trigger**:
   - Go to Actions tab
   - Select workflow
   - Click "Run workflow"
   - Select branch/environment

### Custom CI/CD Integration

#### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Deploy') {
            steps {
                // Add deployment commands
            }
        }
    }
}
```

#### GitLab CI

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm test

build:
  stage: build
  image: node:20
  script:
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - echo "Deploy to your platform"
```

---

## Deployment Options

### Option 1: Node.js Server (Self-Hosted)

```bash
# Build
npm run build

# Start server
npm start

# Server runs on http://localhost:5008
# Frontend served on http://localhost:5009
```

### Option 2: Static Hosting (Vercel, Netlify, etc.)

```bash
# Build static files
npm run build

# Deploy dist/ folder
# Vercel: vercel deploy dist/
# Netlify: netlify deploy --dir=dist
```

### Option 3: Docker

```bash
# Build image
docker build -t qwen-cli-ui:latest .

# Run container
docker run -p 5008:5008 -p 5009:5009 qwen-cli-ui:latest

# Or use docker-compose
docker-compose up -d
```

### Option 4: Cloud Storage (S3, Azure Blob, etc.)

```bash
# Build
npm run build

# AWS S3
aws s3 sync dist/ s3://your-bucket-name

# Azure Blob
az storage blob upload-batch -d container-name -s dist/

# Enable static website hosting on the storage service
```

---

## Build Output Structure

After a successful build, the `dist/` directory contains:

```
dist/
├── index.html              # Main HTML entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── assets/
│   ├── index-*.js         # Main application bundle
│   ├── vendor-*.js        # Third-party dependencies
│   ├── editor-*.js        # Code editor bundle
│   ├── terminal-*.js      # Terminal emulator bundle
│   ├── markdown-*.js      # Markdown renderer bundle
│   ├── index-*.css        # Application styles
│   └── *.svg              # Icons and images
└── icons/                  # PWA icons
```

### Bundle Sizes (Typical)

| File | Size (gzipped) |
|------|----------------|
| Main JS | ~50 KB |
| Vendor JS | ~66 KB |
| Editor JS | ~230 KB |
| Terminal JS | ~100 KB |
| CSS | ~15 KB |
| **Total** | **~460 KB** |

---

## Troubleshooting

### Build Fails with Node.js Version Error

**Error**: `Vite requires Node.js version 20.19+`

**Solution**:
```bash
# Check current version
node --version

# Update Node.js (Windows - use installer from nodejs.org)
# Update Node.js (macOS - using Homebrew)
brew update && brew upgrade node

# Update Node.js (Linux - using nvm)
nvm install 20
nvm use 20
nvm alias default 20
```

### Out of Memory During Build

**Error**: `JavaScript heap out of memory`

**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"  # Linux/macOS
set NODE_OPTIONS=--max-old-space-size=4096       # Windows

# Then run build
npm run build
```

### Build Succeeds But App Doesn't Load

**Check**:
1. Server is running: `netstat -ano | findstr :5008`
2. No CORS errors in browser console
3. `.env` file has correct settings
4. Database initialized: check `~/.qwen/database.sqlite` exists

**Solution**:
```bash
# Clean rebuild
npm run rebuild

# Clear browser cache (hard refresh)
# Windows/Linux: Ctrl+Shift+R
# macOS: Cmd+Shift+R
```

### Tests Fail Randomly

**Common causes**:
1. Database not reset between tests
2. Port conflicts
3. Async timing issues

**Solution**:
```bash
# Run tests in isolation
npm run test -- --runInBand

# Check for open handles
npm run test -- --detectOpenHandles

# Run with verbose output
npm run test -- --verbose
```

### Docker Build Fails

**Error**: `Cannot find module` or `ENOENT`

**Solution**:
```dockerfile
# Ensure Dockerfile has correct build steps:
# 1. Install dependencies
# 2. Build frontend
# 3. Copy build to runtime image

# Rebuild without cache
docker build --no-cache -t qwen-cli-ui:latest .
```

---

## Performance Optimization

### Build Time Optimization

1. **Enable caching**:
   ```bash
   # Don't use --no-cache unless necessary
   npm run build
   ```

2. **Use development mode for testing**:
   ```bash
   npm run dev
   ```

3. **Split builds** (CI/CD):
   - Run lint, test, build in parallel jobs

### Runtime Optimization

1. **Enable gzip compression** (server)
2. **Use CDN for static assets**
3. **Enable HTTP/2**
4. **Configure browser caching headers**

---

## Environment Variables

### Build-Time Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_PORT` | Frontend dev server port | 5009 |
| `VITE_NO_CACHE` | Disable Vite cache | false |
| `NODE_ENV` | Build mode | production |

### Runtime Variables (`.env`)

See `.env.example` for all available options.

---

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Last Updated**: 2026-02-22  
**Version**: 1.6.0
