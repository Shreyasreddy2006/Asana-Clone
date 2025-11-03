#!/bin/bash

echo "=========================================="
echo "Docker Setup Validation Script"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Docker installation
echo "1. Checking Docker installation..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓${NC} Docker is installed: $DOCKER_VERSION"
else
    echo -e "${RED}✗${NC} Docker is not installed"
    echo "   Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check Docker Compose
echo ""
echo "2. Checking Docker Compose..."
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version)
    else
        COMPOSE_VERSION=$(docker compose version)
    fi
    echo -e "${GREEN}✓${NC} Docker Compose is available: $COMPOSE_VERSION"
else
    echo -e "${RED}✗${NC} Docker Compose is not available"
    exit 1
fi

# Check if Docker daemon is running
echo ""
echo "3. Checking Docker daemon..."
if docker info &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker daemon is running"
else
    echo -e "${RED}✗${NC} Docker daemon is not running"
    echo "   Please start Docker Desktop"
    exit 1
fi

# Check required files
echo ""
echo "4. Checking required Docker files..."
FILES=("client/Dockerfile" "server/Dockerfile" "docker-compose.yml" "client/nginx.conf")
ALL_FILES_EXIST=true

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} Found: $file"
    else
        echo -e "${RED}✗${NC} Missing: $file"
        ALL_FILES_EXIST=false
    fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
    echo -e "${RED}Some required files are missing!${NC}"
    exit 1
fi

# Check ports availability
echo ""
echo "5. Checking port availability..."
PORTS=(80 5000 27017)
PORTS_FREE=true

for port in "${PORTS[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -ano | grep ":$port " &> /dev/null; then
        echo -e "${YELLOW}⚠${NC}  Port $port is in use"
        PORTS_FREE=false
    else
        echo -e "${GREEN}✓${NC} Port $port is available"
    fi
done

if [ "$PORTS_FREE" = false ]; then
    echo -e "${YELLOW}Warning: Some ports are in use. You may need to stop those services or change ports in docker-compose.yml${NC}"
fi

# Check disk space
echo ""
echo "6. Checking disk space..."
AVAILABLE_SPACE=$(df -h . | awk 'NR==2 {print $4}')
echo "   Available disk space: $AVAILABLE_SPACE"
echo -e "${GREEN}✓${NC} Disk space check complete"

# Summary
echo ""
echo "=========================================="
echo "Validation Summary"
echo "=========================================="

if [ "$ALL_FILES_EXIST" = true ] && [ "$PORTS_FREE" = true ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "You can now run:"
    echo "  docker-compose up --build"
    echo ""
    echo "Or use the Makefile:"
    echo "  make build"
    echo "  make up"
    exit 0
elif [ "$ALL_FILES_EXIST" = true ]; then
    echo -e "${YELLOW}⚠ Setup is ready but some ports are in use${NC}"
    echo ""
    echo "You can still proceed with:"
    echo "  docker-compose up --build"
    echo ""
    echo "Or modify ports in docker-compose.yml"
    exit 0
else
    echo -e "${RED}✗ Setup validation failed${NC}"
    echo "Please fix the issues above before proceeding"
    exit 1
fi
