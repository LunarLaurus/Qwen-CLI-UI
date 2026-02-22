#!/bin/bash
# Qwen CLI UI - Automated Build Script for Linux/macOS
# Usage: ./scripts/build.sh [--environment production|development] [--skip-tests] [--clean] [--no-cache]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

info() { echo -e "${CYAN}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# Default values
ENVIRONMENT="production"
SKIP_TESTS=false
CLEAN=false
NO_CACHE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        --no-cache)
            NO_CACHE=true
            shift
            ;;
        *)
            echo "Usage: $0 [--environment production|development] [--skip-tests] [--clean] [--no-cache]"
            exit 1
            ;;
    esac
done

info "Qwen CLI UI Build Script"
info "========================"
info "Environment: $ENVIRONMENT"
info "Project Root: $(pwd)"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Check Node.js version
info "Checking Node.js version..."
NODE_VERSION=$(node --version)
info "Node.js version: $NODE_VERSION"

# Check if version is 20.19+ or 22.12+
REQUIRED_MAJOR=20
REQUIRED_MINOR=19

MAJOR_VERSION=$(echo "$NODE_VERSION" | sed 's/v\([0-9]*\)\..*/\1/')
MINOR_VERSION=$(echo "$NODE_VERSION" | sed 's/v[0-9]*\.\([0-9]*\)\..*/\1/')

if [ "$MAJOR_VERSION" -lt "$REQUIRED_MAJOR" ] || { [ "$MAJOR_VERSION" -eq "$REQUIRED_MAJOR" ] && [ "$MINOR_VERSION" -lt "$REQUIRED_MINOR" ]; }; then
    warning "Node.js 20.19+ or 22.12+ is recommended. Current: $NODE_VERSION"
fi

# Clean if requested
if [ "$CLEAN" = true ]; then
    info "Cleaning build artifacts..."
    [ -d "dist" ] && rm -rf dist && info "Removed dist/"
    [ -d "node_modules/.vite" ] && rm -rf node_modules/.vite && info "Removed node_modules/.vite/"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    info "Installing dependencies..."
    npm install
fi

# Run tests unless skipped
if [ "$SKIP_TESTS" = false ]; then
    info "Running tests..."
    if npm test; then
        success "All tests passed"
    else
        warning "Tests failed - continuing build anyway (use --skip-tests to skip)"
    fi
fi

# Build frontend
info "Building frontend..."
if [ "$NO_CACHE" = true ]; then
    export VITE_NO_CACHE=true
fi

if [ "$ENVIRONMENT" = "production" ]; then
    npm run build
else
    npm run build -- --mode development
fi

success "Build completed successfully!"
info "Output directory: dist/"

# Show build stats
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sm dist | cut -f1)
    info "Total build size: $BUILD_SIZE MB"
fi

success "Build ready for deployment!"
