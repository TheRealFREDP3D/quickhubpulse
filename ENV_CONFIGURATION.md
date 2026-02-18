# Environment Configuration Guide

This guide explains how to configure the GitHub Stats Dashboard using environment variables.

## Overview

The GitHub Stats Dashboard supports configuration through environment variables. This allows you to customize the application behavior without modifying source code, making it easy to deploy across different environments (development, staging, production).

## Environment Variable Categories

### Application Configuration

These variables control core application behavior.

| Variable   | Default      | Description                    | Type                                    |
| ---------- | ------------ | ------------------------------ | --------------------------------------- |
| `NODE_ENV` | `production` | Node.js environment mode       | `development` \| `production` \| `test` |
| `PORT`     | `3000`       | Port to expose the application | `number`                                |

**Example:**

```bash
NODE_ENV=production
PORT=3000
```

### GitHub API Configuration

Configure how the application communicates with GitHub's API.

| Variable                  | Default                  | Description               |
| ------------------------- | ------------------------ | ------------------------- |
| `VITE_GITHUB_API_URL`     | `https://api.github.com` | GitHub API base URL       |
| `VITE_GITHUB_API_VERSION` | `2022-11-28`             | GitHub API version header |

**Example:**

```bash
VITE_GITHUB_API_URL=https://api.github.com
VITE_GITHUB_API_VERSION=2022-11-28
```

### Application Features

Enable or disable specific features.

| Variable                  | Default  | Description                    | Type      |
| ------------------------- | -------- | ------------------------------ | --------- |
| `VITE_DEBUG`              | `false`  | Enable debug logging           | `boolean` |
| `VITE_CACHE_DURATION`     | `300000` | Cache duration in milliseconds | `number`  |
| `VITE_REPOS_PER_PAGE`     | `100`    | Repositories per API page      | `number`  |
| `VITE_SHOW_KEYBOARD_HINT` | `true`   | Show keyboard shortcuts hint   | `boolean` |

**Example:**

```bash
VITE_DEBUG=false
VITE_CACHE_DURATION=300000
VITE_REPOS_PER_PAGE=100
VITE_SHOW_KEYBOARD_HINT=true
```

### UI Configuration

Customize the user interface appearance and behavior.

| Variable                  | Default | Description              | Type              |
| ------------------------- | ------- | ------------------------ | ----------------- |
| `VITE_DEFAULT_THEME`      | `light` | Default theme            | `light` \| `dark` |
| `VITE_ENABLE_DARK_MODE`   | `true`  | Enable dark mode toggle  | `boolean`         |
| `VITE_ANIMATION_DURATION` | `300`   | Animation duration in ms | `number`          |

**Example:**

```bash
VITE_DEFAULT_THEME=light
VITE_ENABLE_DARK_MODE=true
VITE_ANIMATION_DURATION=300
```

### Analytics Configuration

Configure optional analytics tracking.

| Variable                    | Default | Description            |
| --------------------------- | ------- | ---------------------- | --------- |
| `VITE_ENABLE_ANALYTICS`     | `false` | Enable analytics       | `boolean` |
| `VITE_ANALYTICS_ENDPOINT`   | ``      | Analytics endpoint URL | `string`  |
| `VITE_ANALYTICS_WEBSITE_ID` | ``      | Analytics website ID   | `string`  |

**Example:**

```bash
VITE_ENABLE_ANALYTICS=false
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=abc123
```

### Development Configuration

Settings for development mode only.

| Variable           | Default     | Description                   |
| ------------------ | ----------- | ----------------------------- | --------- |
| `VITE_HMR_ENABLED` | `true`      | Enable Hot Module Replacement | `boolean` |
| `VITE_HMR_HOST`    | `localhost` | HMR host                      | `string`  |
| `VITE_HMR_PORT`    | `5173`      | HMR port                      | `number`  |

**Example:**

```bash
VITE_HMR_ENABLED=true
VITE_HMR_HOST=localhost
VITE_HMR_PORT=5173
```

### Security Configuration

Security-related settings.

| Variable            | Default                                       | Description                    |
| ------------------- | --------------------------------------------- | ------------------------------ | --------- |
| `VITE_CORS_ORIGINS` | `http://localhost:3000,http://localhost:5173` | CORS allowed origins           | `string`  |
| `VITE_CSP_ENABLED`  | `true`                                        | Enable Content Security Policy | `boolean` |

**Example:**

```bash
VITE_CORS_ORIGINS=http://localhost:3000,https://example.com
VITE_CSP_ENABLED=true
```

### Logging Configuration

Control logging behavior.

| Variable           | Default | Description            | Type                                              |
| ------------------ | ------- | ---------------------- | ------------------------------------------------- |
| `VITE_LOG_LEVEL`   | `info`  | Log level              | `error` \| `warn` \| `info` \| `debug` \| `trace` |
| `VITE_CONSOLE_LOG` | `true`  | Enable console logging | `boolean`                                         |

**Example:**

```bash
VITE_LOG_LEVEL=info
VITE_CONSOLE_LOG=true
```

### Feature Flags

Toggle individual features on or off.

| Variable                   | Default | Description                | Type      |
| -------------------------- | ------- | -------------------------- | --------- |
| `VITE_ENABLE_SEARCH`       | `true`  | Enable repository search   | `boolean` |
| `VITE_ENABLE_SORT`         | `true`  | Enable repository sorting  | `boolean` |
| `VITE_ENABLE_KEYBOARD_NAV` | `true`  | Enable keyboard navigation | `boolean` |
| `VITE_ENABLE_CHARTS`       | `true`  | Enable traffic charts      | `boolean` |
| `VITE_ENABLE_DETAIL_MODAL` | `true`  | Enable detail modal        | `boolean` |

**Example:**

```bash
VITE_ENABLE_SEARCH=true
VITE_ENABLE_SORT=true
VITE_ENABLE_KEYBOARD_NAV=true
VITE_ENABLE_CHARTS=true
VITE_ENABLE_DETAIL_MODAL=true
```

### API Rate Limiting

Configure GitHub API rate limiting behavior.

| Variable                       | Default | Description              | Type      |
| ------------------------------ | ------- | ------------------------ | --------- |
| `VITE_API_RATE_LIMIT`          | `60`    | Rate limit per hour      | `number`  |
| `VITE_SHOW_RATE_LIMIT_WARNING` | `true`  | Show rate limit warnings | `boolean` |

**Example:**

```bash
VITE_API_RATE_LIMIT=60
VITE_SHOW_RATE_LIMIT_WARNING=true
```

### Data Refresh Configuration

Control data caching and refresh behavior.

| Variable                     | Default | Description                 | Type      |
| ---------------------------- | ------- | --------------------------- | --------- |
| `VITE_AUTO_REFRESH_INTERVAL` | `0`     | Auto-refresh interval in ms | `number`  |
| `VITE_CACHE_REPOS`           | `true`  | Cache repositories data     | `boolean` |

**Example:**

```bash
VITE_AUTO_REFRESH_INTERVAL=0
VITE_CACHE_REPOS=true
```

### Build Configuration

Settings for the build process.

| Variable         | Default | Description            |
| ---------------- | ------- | ---------------------- | --------- |
| `BUILD_DIR`      | `dist`  | Build output directory | `string`  |
| `VITE_SOURCEMAP` | `false` | Generate source maps   | `boolean` |

**Example:**

```bash
BUILD_DIR=dist
VITE_SOURCEMAP=false
```

### Server Configuration

Backend server settings (for production builds).

| Variable      | Default   | Description | Type     |
| ------------- | --------- | ----------- | -------- |
| `SERVER_HOST` | `0.0.0.0` | Server host | `string` |
| `SERVER_PORT` | `3000`    | Server port | `number` |

**Example:**

```bash
SERVER_HOST=0.0.0.0
SERVER_PORT=3000
```

## Setting Environment Variables

### Local Development

Create a `.env.local` file in the project root:

```bash
# .env.local
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
VITE_DEFAULT_THEME=dark
```

### Development Environment

Create a `.env.development.local` file:

```bash
# .env.development.local
NODE_ENV=development
VITE_HMR_ENABLED=true
VITE_DEBUG=true
```

### Production Environment

Create a `.env.production.local` file:

```bash
# .env.production.local
NODE_ENV=production
VITE_DEBUG=false
VITE_SOURCEMAP=false
```

### Docker Deployment

Pass variables via docker-compose.yml:

```yaml
services:
  github-stats-dashboard:
    environment:
      - NODE_ENV=production
      - PORT=3000
      - VITE_DEFAULT_THEME=dark
      - VITE_ENABLE_ANALYTICS=true
```

Or via Docker CLI:

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e VITE_DEFAULT_THEME=dark \
  github-stats-dashboard:latest
```

### Kubernetes Deployment

Use ConfigMap for non-sensitive variables:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: github-stats-config
data:
  NODE_ENV: "production"
  VITE_DEFAULT_THEME: "dark"
  VITE_ENABLE_ANALYTICS: "true"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: github-stats-dashboard
spec:
  template:
    spec:
      containers:
        - name: app
          envFrom:
            - configMapRef:
                name: github-stats-config
```

## Variable Naming Convention

- **VITE\_ prefix**: Variables available in the browser (frontend)
- **No prefix**: Variables only available on the server (backend)
- **NEVER expose secrets with VITE\_ prefix** - they will be visible in the browser

## Important Notes

### Security Best Practices

1. **Never commit .env files** with real values to version control
2. **Don't expose secrets** in VITE\_ variables (they're visible in the browser)
3. **GitHub tokens** should be entered by users in the UI, not via environment variables
4. **Use .env.local** for local development with sensitive values
5. **Use .gitignore** to exclude .env files from git

### Variable Types

- **boolean**: Use `true` or `false` (case-sensitive)
- **number**: Use numeric values without quotes
- **string**: Use values with or without quotes

### Default Values

If a variable is not set, the application uses the default value. Check the source code or this guide for defaults.

### Overriding Variables

Variables can be overridden in this order (later overrides earlier):

1. Default values in code
2. `.env` file
3. `.env.local` file
4. `.env.{NODE_ENV}.local` file
5. Environment variables (system or Docker)

## Accessing Variables in Code

### Frontend (React)

```typescript
// Access VITE_ variables
const apiUrl = import.meta.env.VITE_GITHUB_API_URL;
const debug = import.meta.env.VITE_DEBUG === "true";
const cacheTime = parseInt(import.meta.env.VITE_CACHE_DURATION || "300000");
```

### Backend (Node.js)

```typescript
// Access any variables
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || "development";
```

## Environment Variable Validation

The application validates environment variables on startup:

```typescript
// Example validation
if (!process.env.PORT || isNaN(parseInt(process.env.PORT))) {
  console.warn("Invalid PORT, using default 3000");
  process.env.PORT = "3000";
}
```

## Troubleshooting

### Variables Not Loading

1. Check file naming: `.env.local` or `.env.{NODE_ENV}.local`
2. Restart development server after changing .env files
3. Verify variable names match exactly (case-sensitive)
4. Check for syntax errors in .env file

### VITE\_ Variables Undefined in Browser

1. Ensure variable name starts with `VITE_`
2. Restart dev server after adding variable
3. Check browser console for actual value
4. Use `import.meta.env.VITE_*` to access

### Docker Variables Not Applied

1. Use `-e` flag or `environment` section in docker-compose.yml
2. Rebuild image if variables changed in Dockerfile
3. Check container logs: `docker logs <container-id>`
4. Verify variable names in docker-compose.yml

## Example Configurations

### Minimal Configuration

```bash
NODE_ENV=production
PORT=3000
```

### Development Configuration

```bash
NODE_ENV=development
PORT=3000
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
VITE_DEFAULT_THEME=dark
VITE_HMR_ENABLED=true
```

### Production Configuration

```bash
NODE_ENV=production
PORT=3000
VITE_DEBUG=false
VITE_LOG_LEVEL=warn
VITE_SOURCEMAP=false
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
```

### Docker Configuration

```bash
NODE_ENV=production
PORT=3000
SERVER_HOST=0.0.0.0
SERVER_PORT=3000
VITE_DEFAULT_THEME=dark
VITE_ENABLE_ANALYTICS=true
```

## Support

For issues or questions about environment variables:

1. Check this guide for variable documentation
2. Review the application logs for error messages
3. Verify variable syntax and naming
4. Check Docker or system environment variables
5. Restart the application after changing variables

---

**Last Updated**: February 18, 2026
