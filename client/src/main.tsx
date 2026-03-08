import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { validateEnvironment } from "./lib/env";
import { initializeAnalytics } from "./lib/analytics";

// Validate environment configuration on startup
validateEnvironment();

// Initialize analytics if enabled
initializeAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
