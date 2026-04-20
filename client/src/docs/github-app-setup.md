# GitHub App Setup Guide

This project uses GitHub App web application flow for GitHub authentication. This guide walks you through setting up a GitHub App and configuring it with your Netlify deployment.

## Prerequisites

- A GitHub account
- A Netlify account
- Admin access to the Netlify project

## Step 1: Register GitHub App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "GitHub Apps" in the left sidebar
3. Click "New GitHub App"
4. Fill in the application details:
   - **GitHub App name**: QuickHubPulse (or your preferred name)
   - **Homepage URL**: Your Netlify site URL (e.g., `https://quickhubpulse.netlify.app`)
   - **Application description**: Optional
   - **Callback URL**: `https://your-site.netlify.app/auth/github/callback`
5. Under "Webhook", uncheck "Active" (not needed for OAuth)
6. Under "Account permissions", select the permissions you need:
   - For repository stats: `Contents: Read` or `Contents: Read and write`
   - For user info: `Account information: Read`
7. Click "Create GitHub App"
8. Copy the **Client ID** from the app settings page
9. Generate a **Client Secret** and copy it (you won't be able to see it again)

## Step 2: Configure Netlify Environment Variables

1. Go to your Netlify project dashboard
2. Navigate to **Site configuration** > **Environment variables**
3. Add the following environment variables:
   - `GITHUB_CLIENT_ID`: The Client ID from Step 1
   - `GITHUB_CLIENT_SECRET`: The Client Secret from Step 1
   - `GITHUB_REDIRECT_URI`: `https://your-site.netlify.app/auth/github/callback` (optional, will default to this)

## Step 3: Deploy and Test

1. Deploy your changes to Netlify
2. Navigate to your site
3. Click "Login with GitHub"
4. You should be redirected to GitHub's authorization page
5. Authorize the app
6. You should be redirected back to your site with an access token

## How It Works

1. User clicks "Login with GitHub"
2. Netlify function generates GitHub authorization URL
3. User is redirected to GitHub to authorize the app
4. GitHub redirects to your callback URL with an authorization code
5. Netlify function exchanges the code for an access token
6. User is redirected back to your app with the access token
7. Your app can use the token to make authenticated GitHub API requests

## Token Handling

The access token is returned via URL parameters after successful authentication:
- Extract token from URL: `?oauth=success&access_token=...`
- Store token securely in memory or secure storage
- Use token for GitHub API calls: `Authorization: Bearer <token>`

## OAuth Scopes

Current scopes configured in `netlify/functions/github-login-url.ts`:
- `repo`: Full control of private and public repositories
- `user`: Access user profile data

You can modify these scopes based on your application needs. See [GitHub App Scopes](https://docs.github.com/en/apps/creating-github-apps/setting-up-a-github-app/setting-permissions-for-github-apps) for more information.

## Troubleshooting

### "GitHub App configuration error"

- Ensure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set in Netlify environment variables
- Verify the GitHub App is properly registered
- Check that the Client ID matches your GitHub App

### "GitHub access was denied"

- User may have denied authorization
- Check that the GitHub App permissions match what the user expects
- Verify the callback URL matches exactly

### "Redirect URI mismatch"

- Ensure the callback URL in GitHub App settings matches your Netlify site URL exactly
- Check that `GITHUB_REDIRECT_URI` environment variable is set correctly (if using custom URL)

### Network errors

- Check your internet connection
- Verify Netlify functions are deployed correctly
- Check Netlify function logs for errors

## Security Best Practices

- **Never commit credentials** to version control
- **Use environment variables** for all secrets
- **Rotate secrets regularly** in GitHub App settings
- **Monitor GitHub App usage** in GitHub dashboard
- **Use minimal scopes** required for your application
- **Revoke access** when no longer needed

## Documentation

- [Building a "Login with GitHub" button with a GitHub App](https://docs.github.com/en/apps/creating-github-apps/writing-code-for-a-github-app/building-a-login-with-github-button-with-a-github-app)
- [GitHub App Scopes](https://docs.github.com/en/apps/creating-github-apps/setting-up-a-github-app/setting-permissions-for-github-apps)
- [OAuth Security Implementation](./oauth-security.md)
