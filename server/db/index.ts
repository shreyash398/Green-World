import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

// Create database connection
const sqlite = new Database(path.join(process.cwd(), "greenworld.db"));

// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");

// Create Drizzle ORM instance
export const db = drizzle(sqlite, { schema });

export { sqlite };
