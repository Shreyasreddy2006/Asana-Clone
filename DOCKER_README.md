# Docker Deployment Guide for Asana Clone

This guide will help you deploy the Asana Clone application using Docker and Docker Compose.

## Prerequisites

1. **Install Docker Desktop** (includes Docker and Docker Compose)
   - **Windows**: Download from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - **Mac**: Download from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - **Linux**: Follow instructions at [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

2. **Verify Installation**
   ```bash
   docker --version
   docker-compose --version
   ```

## Project Structure

```
Asana-Clone/
├── client/                 # React frontend
│   ├── Dockerfile         # Client Docker configuration
│   ├── nginx.conf         # Nginx configuration
│   └── .dockerignore
├── server/                # Node.js backend
│   ├── Dockerfile         # Server Docker configuration
│   └── .dockerignore
├── docker-compose.yml     # Multi-container orchestration
└── .env.example          # Environment variables template
```

## Quick Start

### 1. Build and Run All Services

```bash
# Navigate to project directory
cd Asana-Clone

# Build and start all containers
docker-compose up --build
```

The application will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### 2. Run in Detached Mode (Background)

```bash
docker-compose up -d --build
```

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f client
docker-compose logs -f server
docker-compose logs -f mongodb
```

### 4. Stop Services

```bash
# Stop containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (deletes database data)
docker-compose down -v
```

## Service Details

### Frontend (client)
- **Port**: 80
- **Technology**: React + Vite + Nginx
- **Build**: Multi-stage Docker build
  - Stage 1: Build React application
  - Stage 2: Serve with Nginx

### Backend (server)
- **Port**: 5000
- **Technology**: Node.js + Express
- **Features**:
  - Health check endpoint
  - Non-root user for security
  - Signal handling with dumb-init

### Database (mongodb)
- **Port**: 27017
- **Version**: MongoDB 8.0
- **Credentials**:
  - Username: `admin`
  - Password: `password123` (change in production!)
  - Database: `asana_clone`
- **Data Persistence**: Docker volumes

## Environment Configuration

### Development

For development, you can override environment variables:

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your configuration

3. Update `docker-compose.yml` to use the env file:
   ```yaml
   services:
     server:
       env_file:
         - .env
   ```

### Production

For production deployment:

1. **Change default passwords** in `docker-compose.yml`:
   ```yaml
   MONGO_INITDB_ROOT_PASSWORD: your-strong-password
   JWT_SECRET: your-unique-secret-key
   ```

2. **Update CORS settings** to match your domain:
   ```yaml
   CORS_ORIGIN: https://yourdomain.com
   ```

3. **Use secrets management** instead of plain text passwords

## Common Commands

### Build Specific Service

```bash
# Build only client
docker-compose build client

# Build only server
docker-compose build server
```

### Rebuild Without Cache

```bash
docker-compose build --no-cache
```

### Access Container Shell

```bash
# Client container
docker-compose exec client sh

# Server container
docker-compose exec server sh

# MongoDB container
docker-compose exec mongodb mongosh
```

### View Container Status

```bash
docker-compose ps
```

### Check Health Status

```bash
docker-compose ps
# Look for "healthy" status in the State column
```

## Volume Management

### List Volumes

```bash
docker volume ls
```

### Backup MongoDB Data

```bash
# Create backup
docker-compose exec mongodb mongodump --out /data/backup --username admin --password password123 --authenticationDatabase admin

# Copy backup to host
docker cp asana-mongodb:/data/backup ./mongodb-backup
```

### Restore MongoDB Data

```bash
# Copy backup to container
docker cp ./mongodb-backup asana-mongodb:/data/restore

# Restore data
docker-compose exec mongodb mongorestore /data/restore --username admin --password password123 --authenticationDatabase admin
```

## Troubleshooting

### Port Already in Use

If you get "port already allocated" error:

```bash
# Check what's using the port
# Windows
netstat -ano | findstr :80
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :80
lsof -i :5000

# Change port in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead of 80
```

### Container Won't Start

```bash
# Check logs
docker-compose logs service-name

# Remove and rebuild
docker-compose down
docker-compose up --build --force-recreate
```

### Database Connection Issues

1. Ensure MongoDB is healthy:
   ```bash
   docker-compose ps mongodb
   ```

2. Check server logs:
   ```bash
   docker-compose logs server
   ```

3. Verify network:
   ```bash
   docker network ls
   docker network inspect asana-clone_asana-network
   ```

### Clear Everything and Start Fresh

```bash
# Stop and remove everything
docker-compose down -v

# Remove all images
docker-compose down --rmi all -v

# Rebuild and restart
docker-compose up --build
```

## Performance Optimization

### Build Optimization

The Dockerfiles use:
- **Multi-stage builds** to reduce image size
- **Layer caching** for faster rebuilds
- **.dockerignore** to exclude unnecessary files

### Production Best Practices

1. **Use alpine images** (smaller size)
2. **Enable gzip compression** (nginx.conf)
3. **Set proper cache headers** (nginx.conf)
4. **Run as non-root user** (server Dockerfile)
5. **Health checks** for all services

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build and test
        run: |
          docker-compose build
          docker-compose up -d
          # Add your tests here
          docker-compose down
```

## Monitoring

### Resource Usage

```bash
# Container stats
docker stats

# Specific container
docker stats asana-client asana-server asana-mongodb
```

### Health Checks

All services have built-in health checks:
- **Client**: HTTP GET on /
- **Server**: HTTP GET on /health
- **MongoDB**: mongosh ping command

## Security Notes

⚠️ **Important for Production**:

1. Change default MongoDB password
2. Use a strong JWT secret
3. Enable HTTPS (add SSL certificates to nginx)
4. Use Docker secrets for sensitive data
5. Limit container resources
6. Regular security updates

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review container logs
3. Consult Docker documentation
4. Open an issue in the repository
