import { Handler } from '@netlify/functions';

export const handler: Handler = async (event: any) => {
  console.log('github-login-url function called');
  console.log('Environment check:', {
    hasClientId: !!process.env.GITHUB_CLIENT_ID,
    hasRedirectUri: !!process.env.GITHUB_REDIRECT_URI,
  });

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    
    if (!clientId) {
      console.error('GITHUB_CLIENT_ID not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: "GitHub OAuth not configured. Please set GITHUB_CLIENT_ID environment variable." 
        }),
      };
    }

    const redirectUri = process.env.GITHUB_REDIRECT_URI || 'https://quickhubpulse.netlify.app/auth/github/callback';
    const state = Math.random().toString(36).substring(2, 15);
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user&state=${state}`;
    
    console.log('Generated auth URL successfully');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: authUrl }),
    };
  } catch (error) {
    console.error("Error generating OAuth URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate OAuth URL", details: String(error) }),
    };
  }
};
