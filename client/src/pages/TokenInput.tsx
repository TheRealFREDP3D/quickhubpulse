import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Key } from "lucide-react";
import { useState } from "react";

interface TokenInputProps {
  onSubmit: (token: string) => void;
}

export default function TokenInput({ onSubmit }: TokenInputProps) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      setLoading(true);
      // Small delay to show loading state
      setTimeout(() => {
        onSubmit(token.trim());
        setLoading(false);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
            <Github className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            GitHub Stats Dashboard
          </h1>
          <p className="text-slate-600">
            Quick overview of all your repositories in one place
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="space-y-2">
            <label
              htmlFor="token"
              className="text-sm font-semibold text-slate-700"
            >
              Personal Access Token
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={e => setToken(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-slate-500">
              Your token is stored locally and never sent to any server except
              GitHub API.
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load Repositories"}
          </Button>
        </form>

        {/* Instructions */}
        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            How to get a Personal Access Token:
          </h3>
          <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
            <li>
              Go to GitHub Settings → Developer settings → Personal access
              tokens
            </li>
            <li>Click "Generate new token (classic)"</li>
            <li>
              Select scopes:{" "}
              <code className="bg-slate-100 px-1 rounded text-slate-700">
                repo
              </code>{" "}
              (for private repos) or{" "}
              <code className="bg-slate-100 px-1 rounded text-slate-700">
                public_repo
              </code>
            </li>
            <li>Copy the generated token and paste it above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
