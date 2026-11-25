import "server-only";

import { asc, count } from "drizzle-orm";
import { db } from "@/db/client";
import { balances } from "@/db/schema";

export function listBalances(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  return db
    .select()
    .from(balances)
    .orderBy(asc(balances.currency))
    .limit(pageSize)
    .offset(offset)
    .all();
}

export function countBalances() {
  return db.select({ value: count() }).from(balances).get()?.value ?? 0;
}
