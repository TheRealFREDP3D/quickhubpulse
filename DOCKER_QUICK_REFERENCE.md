# Docker Quick Reference

Quick commands for building and running the GitHub Stats Dashboard with Docker.

## Build and Run with Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up --build

# Start without rebuilding
docker-compose up

# Stop the container
docker-compose down

# View logs
docker-compose logs -f

# Rebuild only
docker-compose build --no-cache
```

## Build and Run with Docker CLI

```bash
# Build the image
docker build -t github-stats-dashboard:latest .

# Run the container
docker run -p 3000:3000 \
  --name github-stats-dashboard \
  --restart unless-stopped \
  github-stats-dashboard:latest

# Run with custom port
docker run -p 8080:3000 github-stats-dashboard:latest

# Run in background
docker run -d -p 3000:3000 github-stats-dashboard:latest

# Stop the container
docker stop github-stats-dashboard

# Remove the container
docker rm github-stats-dashboard

# View logs
docker logs -f github-stats-dashboard

# View container stats
docker stats github-stats-dashboard
```

## Development with Hot Reload

Edit `docker-compose.yml` and uncomment the development configuration, then:

```bash
docker-compose up
```

## Image Management

```bash
# List images
docker images

# Remove image
docker rmi github-stats-dashboard:latest

# Tag image
docker tag github-stats-dashboard:latest myregistry/github-stats-dashboard:v1.0

# Push to registry
docker push myregistry/github-stats-dashboard:v1.0

# Pull from registry
docker pull myregistry/github-stats-dashboard:v1.0
```

## Container Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Inspect container
docker inspect github-stats-dashboard

# Execute command in container
docker exec -it github-stats-dashboard sh

# View container logs
docker logs github-stats-dashboard
docker logs --tail 50 github-stats-dashboard
docker logs -f github-stats-dashboard

# Check container health
docker inspect --format='{{.State.Health.Status}}' github-stats-dashboard
```

## Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove dangling images
docker image prune

# Remove unused volumes
docker volume prune

# Remove all unused resources
docker system prune -a

# Remove everything (careful!)
docker system prune -a --volumes
```

## Troubleshooting

```bash
# Check if Docker is running
docker ps

# View Docker version
docker --version

# Check Docker info
docker info

# Validate Dockerfile
docker build --dry-run -t test .

# Build with verbose output
docker build --progress=plain -t github-stats-dashboard:latest .

# Scan image for vulnerabilities
docker scan github-stats-dashboard:latest
```

## Environment Variables

```bash
# Run with environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  github-stats-dashboard:latest

# Set in docker-compose.yml
environment:
  - NODE_ENV=production
  - PORT=3000
```

## Networking

```bash
# Create custom network
docker network create github-stats-network

# Run container on custom network
docker run -p 3000:3000 \
  --network github-stats-network \
  --name github-stats-dashboard \
  github-stats-dashboard:latest

# Connect running container to network
docker network connect github-stats-network github-stats-dashboard

# List networks
docker network ls

# Inspect network
docker network inspect github-stats-network
```

## Resource Limits

```bash
# Limit memory
docker run -p 3000:3000 \
  --memory=512m \
  --memory-swap=512m \
  github-stats-dashboard:latest

# Limit CPU
docker run -p 3000:3000 \
  --cpus="1.5" \
  github-stats-dashboard:latest

# Limit both
docker run -p 3000:3000 \
  --memory=512m \
  --cpus="1" \
  github-stats-dashboard:latest
```

## Docker Compose Advanced

```bash
# Build specific service
docker-compose build github-stats-dashboard

# Run specific service
docker-compose up github-stats-dashboard

# Scale service (if applicable)
docker-compose up --scale github-stats-dashboard=3

# View services
docker-compose ps

# Execute command in service
docker-compose exec github-stats-dashboard sh

# View service logs
docker-compose logs -f github-stats-dashboard

# Validate compose file
docker-compose config

# Pull latest images
docker-compose pull
```

## Production Deployment

```bash
# Build for production
docker build -t github-stats-dashboard:v1.0 .

# Tag for registry
docker tag github-stats-dashboard:v1.0 myregistry/github-stats-dashboard:v1.0

# Push to registry
docker push myregistry/github-stats-dashboard:v1.0

# Deploy with Docker Swarm
docker stack deploy -c docker-compose.yml github-stats-dashboard

# Check stack status
docker stack ps github-stats-dashboard

# Remove stack
docker stack rm github-stats-dashboard
```

## Useful Aliases

Add to your `.bashrc` or `.zshrc`:

```bash
alias dc='docker-compose'
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'
alias dcps='docker-compose ps'
alias dps='docker ps'
alias dpsa='docker ps -a'
alias di='docker images'
alias dls='docker logs -f'
```

---

For more detailed information, see [DOCKER.md](./DOCKER.md)
