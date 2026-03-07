import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import TokenInput from "./pages/TokenInput";

function App() {
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handleTokenSubmit = (submittedToken: string, submittedUsername?: string) => {
    setToken(submittedToken);
    setUsername(submittedUsername || "");
  };

  const handleLogout = () => {
    setToken("");
    setUsername("");
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {!(token || username) ? (
            <TokenInput onSubmit={handleTokenSubmit} />
          ) : (
            <Dashboard token={token} username={username} onLogout={handleLogout} />
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default App;
