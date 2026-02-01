import { sqlite } from "./index";

// Migration script - creates all tables
const migrations = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('corporate', 'ngo', 'volunteer', 'admin')),
  organization_name TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  location TEXT NOT NULL,
  funding_goal INTEGER NOT NULL DEFAULT 0,
  funding_received INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed')),
  impact_type TEXT,
  impact_value TEXT,
  carbon_offset TEXT,
  image TEXT,
  ngo_id INTEGER NOT NULL REFERENCES users(id),
  created_at INTEGER DEFAULT (unixepoch())
);

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Registrations table (volunteers registering for projects)
CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  hours_contributed INTEGER NOT NULL DEFAULT 0,
  registered_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(user_id, project_id)
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  hours INTEGER NOT NULL,
  issued_at INTEGER DEFAULT (unixepoch())
);

-- Project photos table
CREATE TABLE IF NOT EXISTS project_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  uploaded_at INTEGER DEFAULT (unixepoch())
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_ngo_id ON projects(ngo_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_project_id ON registrations(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
`;

export function runMigrations() {
  console.log("🔄 Running database migrations...");

  try {
    sqlite.exec(migrations);
    console.log("✅ Database migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run if executed directly
import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations();
}
