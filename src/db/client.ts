import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import * as schema from "./schema";

const databasePath = process.env.DATABASE_PATH ?? "./.data/stripe.db";

type GlobalDb = {
  __stripeSqlite?: Database.Database;
  __stripeDb?: ReturnType<typeof drizzle<typeof schema>>;
};

const globalForDb = globalThis as typeof globalThis & GlobalDb;

function createConnection() {
  mkdirSync(dirname(databasePath), { recursive: true });
  const sqlite = new Database(databasePath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 5000");
  return sqlite;
}

const sqlite = globalForDb.__stripeSqlite ?? createConnection();
const db = globalForDb.__stripeDb ?? drizzle(sqlite, { schema });

globalForDb.__stripeSqlite = sqlite;
globalForDb.__stripeDb = db;

export { db, sqlite };
