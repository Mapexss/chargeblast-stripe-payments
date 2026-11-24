import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { sessions, users } from "@/db/schema";

export function findUserByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email)).get();
}

export function insertSession(row: typeof sessions.$inferInsert) {
  db.insert(sessions).values(row).run();
}

export function deleteSessionByTokenHash(tokenHash: string) {
  db.delete(sessions).where(eq(sessions.tokenHash, tokenHash)).run();
}

export function findSessionUser(tokenHash: string, nowMs: number) {
  const row = db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.tokenHash, tokenHash))
    .get();
  if (!row || row.expiresAt < nowMs) return null;
  return { id: row.id, email: row.email, name: row.name };
}
