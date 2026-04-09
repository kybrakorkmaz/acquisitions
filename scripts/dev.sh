#!/bin/bash

# Development startup script for Acquisition App with Neon Cloud
# This script starts the application in development mode

echo "🚀 Starting Acquisition App in Development Mode"
echo "================================================"

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "❌ Error: .env.development file not found!"
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

echo "📦 Starting development container..."
echo "   - Application will run with hot reload enabled"
echo "   - Database: Neon Cloud"
echo ""

# Start development environment
docker compose -f docker-compose.dev.yml up --build

echo ""
echo "🎉 Development environment started!"
echo "   Application: http://localhost:${PORT:-3000}"
echo ""
echo "To stop, press Ctrl+C or run: docker compose down"
