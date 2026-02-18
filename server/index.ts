import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "..", "data");
const STATS_FILE = path.resolve(DATA_DIR, "repository-stats.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Save repository stats
  app.post("/api/stats", (req, res) => {
    try {
      ensureDataDir();
      const stats = req.body;
      const timestamp = new Date().toISOString();

      let existingData: { timestamp: string; stats: unknown }[] = [];
      if (fs.existsSync(STATS_FILE)) {
        const content = fs.readFileSync(STATS_FILE, "utf-8");
        existingData = JSON.parse(content);
      }

      existingData.push({ timestamp, stats });
      fs.writeFileSync(STATS_FILE, JSON.stringify(existingData, null, 2));

      res.json({ success: true, timestamp });
    } catch (err) {
      console.error("Error saving stats:", err);
      res.status(500).json({ success: false, error: "Failed to save stats" });
    }
  });

  // Get all historical stats
  app.get("/api/stats", (_req, res) => {
    try {
      if (!fs.existsSync(STATS_FILE)) {
        return res.json([]);
      }
      const content = fs.readFileSync(STATS_FILE, "utf-8");
      res.json(JSON.parse(content));
    } catch (err) {
      console.error("Error reading stats:", err);
      res.status(500).json({ success: false, error: "Failed to read stats" });
    }
  });

  // Get latest stats
  app.get("/api/stats/latest", (_req, res) => {
    try {
      if (!fs.existsSync(STATS_FILE)) {
        return res.json(null);
      }
      const content = fs.readFileSync(STATS_FILE, "utf-8");
      const data = JSON.parse(content);
      res.json(data[data.length - 1] || null);
    } catch (err) {
      console.error("Error reading latest stats:", err);
      res.status(500).json({ success: false, error: "Failed to read stats" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
