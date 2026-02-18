import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import TokenInput from "./pages/TokenInput";

function App() {
  const [token, setToken] = useState<string>("");

  const handleTokenSubmit = (submittedToken: string) => {
    setToken(submittedToken);
  };

  const handleLogout = () => {
    setToken("");
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          {!token ? (
            <TokenInput onSubmit={handleTokenSubmit} />
          ) : (
            <Dashboard token={token} onLogout={handleLogout} />
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
