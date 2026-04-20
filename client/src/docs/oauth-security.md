# OAuth Security Implementation

This document outlines the secure OAuth implementation using GitHub App web application flow.

## Overview

This project uses GitHub App web application flow for GitHub authentication, which provides:
- User access tokens for making authenticated API requests
- Proper permission management via GitHub App scopes
- Secure token exchange via server-side Netlify functions
- Reduced attack surface through secure error handling

## Security Architecture

### GitHub App Web Application Flow

The implementation uses GitHub App's web application flow:
- GitHub App Client ID and Secret stored in environment variables
- Netlify functions handle secure token exchange
- Callback URL configured in GitHub App settings
- User access tokens returned to frontend via URL parameters

### Netlify Functions

Two Netlify functions handle the OAuth flow:
1. `github-login-url`: Generates the GitHub authorization URL
2. `github-callback`: Exchanges authorization code for access token

### Error Handling

The `oauth.ts` utility implements secure error handling:
- Maps OAuth errors to user-friendly messages
- Logs detailed errors for debugging
- Never exposes sensitive error details to users
- Handles network, authorization, and server errors appropriately

## Secure Error Types

```typescript
const OAUTH_ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect to GitHub. Please check your internet connection and try again.",
  INVALID_CLIENT: "GitHub App configuration error. Please contact support.",
  ACCESS_DENIED: "GitHub access was denied. Please try again and ensure you grant the necessary permissions.",
  INVALID_SCOPE: "Requested permissions are not valid. Please contact support.",
  SERVER_ERROR: "GitHub is experiencing issues. Please try again in a few minutes.",
  TEMPORARILY_UNAVAILABLE: "GitHub services are temporarily unavailable. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred during GitHub authentication. Please try again.",
} as const;
```

## Security Benefits

1. **Server-Side Token Exchange**: Client secret never exposed to client-side code
2. **Secure Error Handling**: No sensitive information leaked to users
3. **GitHub App Scopes**: Fine-grained permission control
4. **Environment Variables**: Credentials stored securely in Netlify
5. **HTTPS Only**: All OAuth flows use secure connections

## Token Security

### Access Token Handling

The access token is returned to your application via URL parameters after successful authentication:
- Token is provided by GitHub after user authorization
- Extract token from URL parameters (`?oauth=success&access_token=...`)
- Store token securely in memory or secure storage
- Use token for GitHub API calls with `Authorization: Bearer <token>` header
- Never log or expose the token in client-side code
- Implement proper token lifecycle management

### Token Scope

Current OAuth scopes:
- `repo`: Full control of private and public repositories
- `user`: Access user profile data

Scopes can be modified in `netlify/functions/github-login-url.ts` based on application needs.

## Best Practices

### For Developers

- **Never commit credentials** to version control
- **Use environment variables** for Client ID and Secret
- **Implement proper token storage** (avoid localStorage for sensitive tokens)
- **Log errors securely** (don't log tokens or sensitive data)
- **Use minimal scopes** required for your application
- **Rotate secrets regularly** in GitHub App settings
- **Monitor GitHub App usage** in GitHub dashboard

### For Users

- **Review permissions** before authorizing
- **Revoke access** when no longer needed via GitHub settings
- **Report suspicious activity** immediately

## Setup Security

### GitHub App Configuration

1. Register a GitHub App in GitHub Developer Settings
2. Set callback URL to your Netlify site: `https://your-site.netlify.app/auth/github/callback`
3. Generate Client ID and Client Secret
4. Add credentials to Netlify environment variables:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GITHUB_REDIRECT_URI` (optional, defaults to site URL)

### Netlify Environment Variables

Add these environment variables in Netlify dashboard:
- `GITHUB_CLIENT_ID`: From GitHub App settings
- `GITHUB_CLIENT_SECRET`: From GitHub App settings
- `GITHUB_REDIRECT_URI`: Optional, defaults to `https://your-site.netlify.app/auth/github/callback`

## Testing Considerations

When testing OAuth security:
1. Verify no credentials in client-side code
2. Test error handling without exposing sensitive details
3. Confirm token is not logged or exposed
4. Test token revocation scenarios
5. Verify scope limitations are respected
6. Test with different permission scenarios

## Compliance

This implementation follows:
- GitHub App security guidelines
- OAuth 2.0 best practices
- OWASP security recommendations
- Industry standard web application flow

## Documentation

- [Building a "Login with GitHub" button with a GitHub App](https://docs.github.com/en/apps/creating-github-apps/writing-code-for-a-github-app/building-a-login-with-github-button-with-a-github-app)
- [GitHub App Scopes](https://docs.github.com/en/apps/creating-github-apps/setting-up-a-github-app/setting-permissions-for-github-apps)
- [OWASP OAuth 2.0 Security](https://cheatsheetseries.owasp.org/cheatsheets/OAuth_2_0_Security_Cheat_Sheet.html)


