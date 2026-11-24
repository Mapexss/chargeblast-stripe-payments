import "server-only";

import { asc, count } from "drizzle-orm";
import { db } from "@/db/client";
import { products } from "@/db/schema";

export function listProducts(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  return db
    .select()
    .from(products)
    .orderBy(asc(products.id))
    .limit(pageSize)
    .offset(offset)
    .all();
}

export function countProducts() {
  return db.select({ value: count() }).from(products).get()?.value ?? 0;
}
