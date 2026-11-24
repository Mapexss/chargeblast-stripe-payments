import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { lt } from "drizzle-orm";
import { db } from "@/db/client";
import { sessions } from "@/db/schema";
import {
  deleteSessionByTokenHash,
  findSessionUser,
  insertSession,
} from "./queries";

export const SESSION_COOKIE = "stripe_session";
const SESSION_MS = 604_800_000;

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  db.delete(sessions).where(lt(sessions.expiresAt, now)).run();
  insertSession({
    id: `ses_${randomBytes(8).toString("hex")}`,
    userId,
    tokenHash: hashToken(token),
    createdAt: now,
    expiresAt: now + SESSION_MS,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MS / 1000,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) deleteSessionByTokenHash(hashToken(token));
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function requireSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) throw new UnauthorizedError();
  const user = findSessionUser(hashToken(token), Date.now());
  if (!user) throw new UnauthorizedError();
  return user;
}

