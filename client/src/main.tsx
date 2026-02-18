import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { validateEnvironment } from "./lib/env";

// Validate environment configuration on startup
validateEnvironment();

createRoot(document.getElementById("root")!).render(<App />);
