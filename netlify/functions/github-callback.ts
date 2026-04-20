import type { Handler } from "@netlify/functions";

const handler: Handler = async (event, _context) => {
  try {
    const { code, state } = event.queryStringParameters || {};

    if (!code) {
      return {
        statusCode: 400,
        body: "Authorization code not provided",
      };
    }

    // TODO: Exchange code for access token using GitHub API
    // For now, redirect with success message
    return {
      statusCode: 302,
      headers: {
        Location: `/?oauth=success&code=${code}&state=${state}`,
      },
      body: "Redirecting...",
    };
  } catch (error) {
    console.error("OAuth callback error:", error);
    return {
      statusCode: 302,
      headers: {
        Location: "/?oauth=error",
      },
      body: "Redirecting...",
    };
  }
};

export { handler };
