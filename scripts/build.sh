#!/bin/bash

set -e

echo "🐳 Building Docker images for Micro Livraria services..."
echo ""

# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Array of services to build
SERVICES=("frontend" "controller" "shipping" "inventory" "cart")

# Build each service
for service in "${SERVICES[@]}"; do
    if [ -f "services/$service/Dockerfile" ]; then
        echo "📦 Building micro-livraria/$service..."
        docker build -t "micro-livraria/$service" -f "services/$service/Dockerfile" .
        echo "✅ Successfully built micro-livraria/$service"
        echo ""
    else
        echo "⚠️  Dockerfile not found for $service, skipping..."
        echo ""
    fi
done

echo "🎉 All Docker images built successfully!"
echo ""
echo "Available images:"
docker images | grep "micro-livraria"
echo ""
echo "To run the services, use: docker-compose up"

