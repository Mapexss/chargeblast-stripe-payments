#!/bin/sh
set -eu

node scripts/migrate.mjs

COUNT="$(node -e "
const Database = require('better-sqlite3');
const db = new Database(process.env.DATABASE_PATH || './.data/stripe.db');
try {
  const row = db.prepare('SELECT COUNT(*) AS c FROM payments').get();
  process.stdout.write(String(row.c));
} catch {
  process.stdout.write('0');
} finally {
  db.close();
}
")"

if [ "$COUNT" = "0" ]; then
  echo "payments empty; seeding"
  node --import tsx src/db/seed.ts --reset
fi

exec node server.js
