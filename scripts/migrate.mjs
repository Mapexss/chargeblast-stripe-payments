import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const databasePath = process.env.DATABASE_PATH ?? "./.data/stripe.db";
const migrationsFolder = join(dirname(fileURLToPath(import.meta.url)), "..", "drizzle");

mkdirSync(dirname(databasePath), { recursive: true });
const sqlite = new Database(databasePath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
sqlite.pragma("busy_timeout = 5000");

const db = drizzle(sqlite);
migrate(db, { migrationsFolder });
sqlite.close();
console.log(`migrated ${databasePath}`);
