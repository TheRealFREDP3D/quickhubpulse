import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useState } from "react";
import { initiateGitHubLogin, createOAuthError, OAuthError } from "@/utils/oauth";

interface OAuthLoginButtonProps {
  onLoginStart?: () => void;
  onLoginSuccess?: (token: string) => void;
  onLoginError?: (error: OAuthError) => void;
  disabled?: boolean;
}

export function OAuthLoginButton({
  onLoginStart,
  onLoginSuccess,
  onLoginError,
  disabled = false,
}: OAuthLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [oauthError, setOauthError] = useState<OAuthError | null>(null);

  const handleOAuthLogin = async () => {
    setLoading(true);
    setOauthError(null);

    onLoginStart?.();

    try {
      const token = await initiateGitHubLogin();
      onLoginSuccess?.(token);
    } catch (error) {
      const safeError = createOAuthError(error);
      setOauthError(safeError);
      onLoginError?.(safeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleOAuthLogin}
        disabled={disabled || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Github className="w-4 h-4 mr-2" />
        {loading ? "Connecting to GitHub..." : "Login with GitHub"}
      </Button>

      {oauthError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{oauthError.message}</p>
        </div>
      )}
    </div>
  );
}
