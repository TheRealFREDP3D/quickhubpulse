# Environment Files Git Ignore Configuration

This document explains how to properly configure git to ignore environment files while tracking the example file.

## Why Ignore Environment Files?

Environment files contain sensitive information such as:

- API keys and tokens
- Database credentials
- Authentication secrets
- Configuration specific to your machine or deployment

These should **never** be committed to version control.

## Git Ignore Configuration

The project's `.gitignore` file should include the following entries to exclude environment files:

```gitignore
# Environment variables - DO NOT COMMIT
.env
.env.local
.env.*.local
.env.production
.env.development
.env.test
.env.staging
```

## Checking Current Configuration

To verify that environment files are properly ignored:

```bash
# Check if .env files are in git index
git status

# List all ignored files
git check-ignore -v .env*

# Show what would be tracked
git ls-files | grep -i env
```

## Adding Environment Files to Git Ignore

If environment files are not yet ignored:

```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore

# Remove from git tracking if already committed
git rm --cached .env
git rm --cached .env.local
git commit -m "Remove environment files from version control"
```

## Tracking Environment Examples

The `.env.example` file (or documentation like `ENV_CONFIGURATION.md`) **should** be committed to help developers understand what environment variables are needed.

```bash
# These SHOULD be tracked
git add ENV_CONFIGURATION.md
git add .env.example  # if using traditional .env.example file
git commit -m "Add environment configuration documentation"
```

## Local Development Setup

When cloning the repository for development:

```bash
# 1. Clone the repository
git clone <repository-url>
cd github-stats-dashboard-simplified

# 2. Create local environment file
cp .env.example .env.local
# or create manually based on ENV_CONFIGURATION.md

# 3. Edit with your local values
nano .env.local  # or your preferred editor

# 4. Verify it's ignored
git status  # Should not show .env.local
```

## Docker Environment Files

For Docker deployments, environment variables can be passed via:

1. **docker-compose.yml** (for non-sensitive values)

```yaml
environment:
  - NODE_ENV=production
  - VITE_DEFAULT_THEME=dark
```

2. **Docker CLI** (for sensitive values)

```bash
docker run -e SENSITIVE_VAR=value ...
```

3. **Secrets management** (for production)

- Docker Secrets
- Kubernetes Secrets
- Cloud provider secret managers

## CI/CD Pipeline

For continuous integration, set environment variables in your CI/CD platform:

### GitHub Actions

```yaml
env:
  NODE_ENV: production
  VITE_DEBUG: false
```

### GitLab CI

```yaml
variables:
  NODE_ENV: production
  VITE_DEBUG: false
```

### Jenkins

Use Jenkins credentials and inject as environment variables

## Best Practices

1. **Never commit .env files** with real values
2. **Always use .env.local** for local development
3. **Document all variables** in ENV_CONFIGURATION.md or .env.example
4. **Use different files** for different environments (.env.development.local, .env.production.local)
5. **Rotate secrets** regularly, especially if accidentally exposed
6. **Use secret managers** in production (AWS Secrets Manager, HashiCorp Vault, etc.)
7. **Review .gitignore** before committing to ensure no secrets are exposed

## Recovering from Accidental Commits

If you accidentally committed a .env file with secrets:

```bash
# 1. Remove from git history (requires force push)
git filter-branch --tree-filter 'rm -f .env' HEAD

# 2. Or use git-filter-repo (recommended)
git filter-repo --path .env --invert-paths

# 3. Force push to remote (be careful!)
git push --force-with-lease

# 4. Rotate all exposed secrets immediately
```

## Verification Checklist

- [ ] `.gitignore` includes `.env` and `.env.*.local`
- [ ] `.env` files are not in git history (`git log --all -- .env`)
- [ ] `ENV_CONFIGURATION.md` or `.env.example` is tracked
- [ ] Local `.env.local` file is created from example
- [ ] Development team knows to use `.env.local` for local values
- [ ] CI/CD pipeline has environment variables configured
- [ ] Production secrets are managed securely
- [ ] `.gitignore` is committed to repository

## Additional Resources

- [Git Documentation - gitignore](https://git-scm.com/docs/gitignore)
- [GitHub - Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP - Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Important**: Always verify that sensitive files are properly ignored before pushing to a public repository.
