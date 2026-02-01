import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// Route imports
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import volunteerRoutes from "./routes/volunteers";
import statsRoutes from "./routes/stats";
import { handleDemo } from "./routes/demo";

// Initialize database on startup
import { runMigrations } from "./db/migrate";

export function createServer() {
  const app = express();

  // Run database migrations
  try {
    runMigrations();
  } catch (error) {
    console.error("Database migration failed:", error);
  }

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check (relative to /api)
  app.get("/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Legacy demo route
  app.get("/demo", handleDemo);

  // API Routes (relative to /api)
  app.use("/auth", authRoutes);
  app.use("/projects", projectRoutes);
  app.use("/volunteers", volunteerRoutes);
  app.use("/stats", statsRoutes);

  console.log("✅ API Routes registered: /auth, /projects, /volunteers, /stats");

  // Error handling middleware
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  });

  return app;
}
