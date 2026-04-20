/**
 * OAuth utilities using Netlify's built-in authentication
 * https://docs.netlify.com/manage/security/secure-access-to-sites/oauth-provider-tokens/
 */

import netlify from "netlify-auth-providers";

// Known OAuth error types with user-friendly messages
const OAUTH_ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect to GitHub. Please check your internet connection and try again.",
  ACCESS_DENIED: "GitHub access was denied. Please try again and ensure you grant the necessary permissions.",
  SERVER_ERROR: "GitHub is experiencing issues. Please try again in a few minutes.",
  TEMPORARILY_UNAVAILABLE: "GitHub services are temporarily unavailable. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred during GitHub authentication. Please try again.",
} as const;

type OAuthErrorType = keyof typeof OAUTH_ERROR_MESSAGES;

/**
 * Maps raw OAuth errors to user-friendly messages
 */
export function handleOAuthError(error: unknown): string {
  console.error("OAuth error occurred:", error);

  if (!(error instanceof Error)) {
    return OAUTH_ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
    return OAUTH_ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (errorMessage.includes("access_denied")) {
    return OAUTH_ERROR_MESSAGES.ACCESS_DENIED;
  }

  if (errorMessage.includes("server_error") || errorMessage.includes("internal server error")) {
    return OAUTH_ERROR_MESSAGES.SERVER_ERROR;
  }

  if (errorMessage.includes("temporarily_unavailable")) {
    return OAUTH_ERROR_MESSAGES.TEMPORARILY_UNAVAILABLE;
  }

  return OAUTH_ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Initiates GitHub OAuth login using Netlify's built-in authentication
 * Returns the access token on success
 */
export async function initiateGitHubLogin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const authenticator = new netlify.default({});

    authenticator.authenticate(
      {
        provider: "github",
        scope: "repo,user",
      },
      (error: Error | null, data: { token: string } | null) => {
        if (error) {
          console.error("OAuth authentication failed:", error);
          reject(new Error(handleOAuthError(error)));
          return;
        }

        if (!data || !data.token) {
          reject(new Error(OAUTH_ERROR_MESSAGES.UNKNOWN_ERROR));
          return;
        }

        console.log("OAuth authentication successful");
        resolve(data.token);
      }
    );
  });
}

/**
 * Type for OAuth error handling in components
 */
export interface OAuthError {
  message: string;
  type: OAuthErrorType;
  originalError?: unknown;
}

/**
 * Creates a safe OAuth error object for React state
 */
export function createOAuthError(error: unknown): OAuthError {
  const message = handleOAuthError(error);
  const type = determineErrorType(error);

  return {
    message,
    type,
    originalError: error,
  };
}

/**
 * Determines the error type based on the error content
 */
function determineErrorType(error: unknown): OAuthErrorType {
  if (!(error instanceof Error)) {
    return "UNKNOWN_ERROR";
  }

  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
    return "NETWORK_ERROR";
  }

  if (errorMessage.includes("access_denied")) {
    return "ACCESS_DENIED";
  }

  if (errorMessage.includes("server_error") || errorMessage.includes("internal server error")) {
    return "SERVER_ERROR";
  }

  if (errorMessage.includes("temporarily_unavailable")) {
    return "TEMPORARILY_UNAVAILABLE";
  }

  return "UNKNOWN_ERROR";
}
