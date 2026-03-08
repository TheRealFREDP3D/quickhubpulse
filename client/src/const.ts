export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = async () => {
  const { env } = await import("./lib/env");
  const oauthPortalUrl = env.OAUTH_PORTAL_URL;
  const appId = env.APP_ID;

  // Validate OAuth configuration before building URL
  if (!oauthPortalUrl) {
    throw new Error("OAuth portal URL is not configured. Please set VITE_OAUTH_PORTAL_URL environment variable.");
  }

  if (!appId) {
    throw new Error("OAuth app ID is not configured. Please set VITE_APP_ID environment variable.");
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    throw new Error(`Failed to construct OAuth login URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
