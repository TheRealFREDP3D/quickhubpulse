# OAuth Security Implementation

This document outlines the secure OAuth implementation using Netlify's built-in authentication service.

## Overview

This project uses Netlify's managed OAuth service for GitHub authentication, which provides:
- No custom server functions needed
- Managed OAuth flow by Netlify
- Secure token handling
- Reduced attack surface

## Security Architecture

### Netlify's Managed OAuth

The implementation leverages Netlify's built-in OAuth provider tokens service:
- GitHub OAuth App callback: `https://api.netlify.com/auth/done`
- Credentials stored securely in Netlify UI
- Netlify handles token exchange and validation
- No sensitive credentials in code or environment variables

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
  ACCESS_DENIED: "GitHub access was denied. Please try again and ensure you grant the necessary permissions.",
  SERVER_ERROR: "GitHub is experiencing issues. Please try again in a few minutes.",
  TEMPORARILY_UNAVAILABLE: "GitHub services are temporarily unavailable. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred during GitHub authentication. Please try again.",
} as const;
```

## Security Benefits

1. **No Credential Exposure**: Client ID and Secret stored in Netlify UI, not in code
2. **Managed Token Flow**: Netlify handles secure token exchange
3. **Reduced Attack Surface**: No custom OAuth endpoints to secure
4. **Automatic Security Updates**: Netlify manages OAuth security patches
5. **Compliance**: Follows Netlify's security best practices

## Token Security

### Access Token Handling

The access token is returned to your application via the `onLoginSuccess` callback:
- Token is provided by Netlify after successful authentication
- Store token securely in memory or secure storage
- Use token for GitHub API calls with `Authorization: token <token>` header
- Never log or expose the token in client-side code
- Implement proper token lifecycle management

### Token Scope

Current OAuth scopes:
- `repo`: Full control of private and public repositories
- `user`: Access user profile data

Scopes can be modified in `client/src/utils/oauth.ts` based on application needs.

## Best Practices

### For Developers

- **Never commit credentials** to version control
- **Use Netlify UI** for OAuth configuration
- **Implement proper token storage** (avoid localStorage for sensitive tokens)
- **Log errors securely** (don't log tokens or sensitive data)
- **Use minimal scopes** required for your application
- **Monitor OAuth usage** in Netlify dashboard

### For Users

- **Review permissions** before authorizing
- **Revoke access** when no longer needed
- **Report suspicious activity** immediately

## Setup Security

See [netlify-oauth-setup.md](./netlify-oauth-setup.md) for secure setup instructions.

Key security points:
- GitHub OAuth App must use `https://api.netlify.com/auth/done` as callback
- Client Secret should be generated and stored securely in Netlify UI
- Never share Client ID or Secret
- Use HTTPS for all OAuth flows

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
- Netlify security guidelines
- GitHub OAuth best practices
- OWASP security recommendations
- Industry standard OAuth 2.0 flows

## Documentation

- [Netlify OAuth Provider Tokens](https://docs.netlify.com/manage/security/secure-access-to-sites/oauth-provider-tokens/)
- [GitHub OAuth Scopes](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)
- [OWASP OAuth 2.0 Security](https://cheatsheetseries.owasp.org/cheatsheets/OAuth_2_0_Security_Cheat_Sheet.html)

