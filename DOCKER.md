# Docker Setup Guide for GitHub Stats Dashboard

This guide explains how to build, run, and deploy the GitHub Stats Dashboard using Docker.

## Prerequisites

- **Docker**: Version 20.10 or higher ([install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: Version 1.29 or higher (included with Docker Desktop)
- **GitHub Personal Access Token**: For accessing repository data

## Quick Start with Docker Compose

The easiest way to run the application is using Docker Compose:

### 1. Build and Start the Container

```bash
docker-compose up --build
```

This command will:

- Build the Docker image
- Start the container
- Expose the application on `http://localhost:3000`

### 2. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

### 3. Stop the Container

```bash
docker-compose down
```

## Building the Docker Image Manually

If you prefer to build the image without Docker Compose:

### 1. Build the Image

```bash
docker build -t github-stats-dashboard:latest .
```

### 2. Run the Container

```bash
docker run -p 3000:3000 \
  --name github-stats-dashboard \
  --restart unless-stopped \
  github-stats-dashboard:latest
```

### 3. Access the Application

```
http://localhost:3000
```

### 4. Stop the Container

```bash
docker stop github-stats-dashboard
docker rm github-stats-dashboard
```

## Docker Image Details

### Base Image

- **Node.js 22 Alpine**: Lightweight Linux distribution optimized for Node.js applications
- **Size**: ~200 MB (compressed)

### Multi-Stage Build

The Dockerfile uses a two-stage build process:

1. **Builder Stage**: Installs dependencies and builds the application
2. **Runtime Stage**: Contains only the built application and runtime dependencies

This approach reduces the final image size by excluding build tools and source code.

### Build Time

- First build: ~2-3 minutes (depends on internet speed)
- Subsequent builds: ~30 seconds (with cached layers)

## Environment Variables

The application uses the following environment variables:

| Variable   | Default      | Description                    |
| ---------- | ------------ | ------------------------------ |
| `NODE_ENV` | `production` | Node.js environment mode       |
| `PORT`     | `3000`       | Port to expose the application |

### Setting Environment Variables

With Docker Compose, add to `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
```

With Docker CLI:

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  github-stats-dashboard:latest
```

## Development with Docker

For development with hot-reload, modify `docker-compose.yml`:

```yaml
services:
  github-stats-dashboard:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./client/src:/app/client/src
      - ./server:/app/server
    environment:
      - NODE_ENV=development
    command: pnpm dev
```

Then run:

```bash
docker-compose up
```

## Health Checks

The Docker container includes a health check that:

- Runs every 30 seconds
- Checks if the application is responding on port 3000
- Marks the container as unhealthy after 3 failed checks
- Waits 5 seconds before the first check

View health status:

```bash
docker ps
# Look for the STATUS column
```

## Networking

### Port Mapping

- **Container Port**: 3000 (internal)
- **Host Port**: 3000 (external, configurable)

### Accessing from Other Containers

If running other services in Docker, use the service name as the hostname:

```
http://github-stats-dashboard:3000
```

## Volumes and Persistence

The application doesn't require persistent storage as it:

- Fetches data from GitHub API on demand
- Stores user tokens in browser localStorage
- Doesn't maintain server-side state

However, you can mount volumes for logs or custom configurations:

```yaml
volumes:
  - ./logs:/app/logs
  - ./config:/app/config
```

## Production Deployment

### Using Docker Swarm

Initialize swarm:

```bash
docker swarm init
```

Deploy the stack:

```bash
docker stack deploy -c docker-compose.yml github-stats-dashboard
```

### Using Kubernetes

Create a deployment manifest (`k8s-deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: github-stats-dashboard
spec:
  replicas: 3
  selector:
    matchLabels:
      app: github-stats-dashboard
  template:
    metadata:
      labels:
        app: github-stats-dashboard
    spec:
      containers:
        - name: app
          image: github-stats-dashboard:latest
          ports:
            - containerPort: 3000
          livenessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: github-stats-dashboard
spec:
  selector:
    app: github-stats-dashboard
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

Deploy to Kubernetes:

```bash
kubectl apply -f k8s-deployment.yaml
```

### Using Docker Registry

Push to Docker Hub:

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag github-stats-dashboard:latest yourusername/github-stats-dashboard:latest

# Push the image
docker push yourusername/github-stats-dashboard:latest
```

## Troubleshooting

### Container Won't Start

Check logs:

```bash
docker logs github-stats-dashboard
```

### Port Already in Use

Change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8080:3000" # Access at http://localhost:8080
```

Or with Docker CLI:

```bash
docker run -p 8080:3000 github-stats-dashboard:latest
```

### High Memory Usage

The Node.js process may use significant memory. Limit it:

```bash
docker run -p 3000:3000 \
  --memory=512m \
  --memory-swap=512m \
  github-stats-dashboard:latest
```

### Build Fails

Clear Docker cache and rebuild:

```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

## Performance Optimization

### Image Size Optimization

Current image size: ~200 MB

To further reduce size, use a minimal base image:

```dockerfile
FROM node:22-alpine
# ... rest of Dockerfile
```

### Build Cache Optimization

Arrange Dockerfile commands to maximize cache hits:

1. Copy package files first (rarely changes)
2. Install dependencies
3. Copy source code (changes frequently)
4. Build application

### Runtime Performance

- The application uses Vite for fast builds
- React 19 with optimized rendering
- Client-side data processing for instant search and sort
- No database required

## Security Best Practices

1. **Use specific Node.js versions**: Avoid `latest` tag in production
2. **Run as non-root user**: Add to Dockerfile:

   ```dockerfile
   RUN addgroup -g 1001 -S nodejs
   RUN adduser -S nodejs -u 1001
   USER nodejs
   ```

3. **Scan for vulnerabilities**:

   ```bash
   docker scan github-stats-dashboard:latest
   ```

4. **Keep base image updated**:

   ```bash
   docker pull node:22-alpine
   docker build --no-cache -t github-stats-dashboard:latest .
   ```

5. **Use environment variables for secrets**: Never hardcode tokens or keys

## Monitoring and Logging

### View Logs

Real-time logs:

```bash
docker logs -f github-stats-dashboard
```

Last 100 lines:

```bash
docker logs --tail 100 github-stats-dashboard
```

### Container Stats

Monitor resource usage:

```bash
docker stats github-stats-dashboard
```

### Health Status

Check container health:

```bash
docker inspect --format='{{.State.Health.Status}}' github-stats-dashboard
```

## Cleanup

Remove stopped containers:

```bash
docker container prune
```

Remove unused images:

```bash
docker image prune
```

Remove all unused resources:

```bash
docker system prune -a
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

## Support

For issues or questions:

1. Check Docker logs: `docker logs github-stats-dashboard`
2. Verify GitHub token permissions
3. Ensure port 3000 is available
4. Check Docker and Docker Compose versions

---

**Happy containerizing!** The GitHub Stats Dashboard is now ready to run in Docker.
