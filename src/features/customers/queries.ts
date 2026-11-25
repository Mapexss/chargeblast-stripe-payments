import "server-only";

import { asc, count } from "drizzle-orm";
import { db } from "@/db/client";
import { customers } from "@/db/schema";

export function listCustomers(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  return db
    .select()
    .from(customers)
    .orderBy(asc(customers.id))
    .limit(pageSize)
    .offset(offset)
    .all();
}

export function countCustomers() {
  return db.select({ value: count() }).from(customers).get()?.value ?? 0;
}
