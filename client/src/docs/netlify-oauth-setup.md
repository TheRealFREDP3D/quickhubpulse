# Netlify OAuth Setup Guide

This project uses Netlify's built-in OAuth authentication for GitHub login. This eliminates the need for custom server functions and provides a more secure, managed OAuth flow.

## Prerequisites

- A Netlify account
- A GitHub account
- Admin access to the Netlify project

## Step 1: Register GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "Register a new application" or "New OAuth App"
3. Fill in the application details:
   - **Application name**: QuickHubPulse (or your preferred name)
   - **Homepage URL**: Your Netlify site URL (e.g., `https://quickhubpulse.netlify.app`)
   - **Application description**: Optional
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
4. Click "Register application"
5. Copy the **Client ID** from the application page
6. Generate a **Client Secret** and copy it (you won't be able to see it again)

## Step 2: Configure Netlify OAuth

1. Go to your Netlify project dashboard
2. Navigate to **Project configuration** > **Access & security** > **OAuth**
3. Click "Install Provider"
4. Select **GitHub**
5. Enter the **Client ID** and **Client Secret** from Step 1
6. Click "Save"

## Step 3: Usage in the Application

The OAuth login is handled by the `OAuthLoginButton` component:

```tsx
import { OAuthLoginButton } from "@/components/OAuthLoginButton";

function MyComponent() {
  const handleLoginSuccess = (token: string) => {
    // Store the token and use it for GitHub API calls
    console.log("Access token:", token);
  };

  return (
    <OAuthLoginButton
      onLoginSuccess={handleLoginSuccess}
      onLoginError={(error) => console.error(error)}
    />
  );
}
```

## How It Works

1. User clicks "Login with GitHub"
2. Netlify's authentication library opens a popup to GitHub
3. User authorizes the application
4. GitHub redirects to Netlify's OAuth endpoint (`https://api.netlify.com/auth/done`)
5. Netlify exchanges the authorization code for an access token
6. The access token is returned to your application
7. You can use the token to make authenticated GitHub API requests

## Token Storage

The access token is returned to your application via the `onLoginSuccess` callback. You should:

- Store the token securely (e.g., in memory or secure storage)
- Use it for GitHub API calls with the `Authorization: token <token>` header
- Implement token refresh logic if needed (GitHub tokens don't expire by default)

## OAuth Scopes

The current configuration requests the following scopes:
- `repo`: Full control of private and public repositories
- `user`: Access user profile data

You can modify the scopes in `client/src/utils/oauth.ts`:

```typescript
authenticator.authenticate(
  {
    provider: "github",
    scope: "repo,user", // Modify scopes here
  },
  callback
);
```

## Troubleshooting

### "GitHub authentication configuration error"

- Ensure you've configured the Client ID and Client Secret in Netlify UI
- Check that the GitHub OAuth App is properly registered

### "GitHub access was denied"

- User may have denied authorization
- Check that the OAuth scopes match what the user expects

### Network errors

- Check your internet connection
- Ensure Netlify's OAuth service is operational

## Documentation

- [Netlify OAuth Provider Tokens](https://docs.netlify.com/manage/security/secure-access-to-sites/oauth-provider-tokens/)
- [GitHub OAuth Scopes](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)
- [Netlify Auth Demo](https://github.com/netlify/netlify-auth-demo)
