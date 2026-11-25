import "server-only";

import { and, eq } from "drizzle-orm";
import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { randomBytes } from "node:crypto";
import { db } from "@/db/client";
import { exportJobs } from "@/db/schema";
import { buildPaymentsCsv } from "@/features/exports/csv";
import type { ExportRequest } from "@/features/exports/schema";
import { listPayments } from "@/features/payments/queries";
import type { PaymentFilters } from "@/features/payments/schema";

export const EXPORT_DIR = process.env.EXPORT_DIR ?? "./.data/exports";

export function createExportJob(payload: ExportRequest) {
  const id = `exp_${randomBytes(8).toString("hex")}`;
  const createdAt = Date.now();
  db.insert(exportJobs)
    .values({
      id,
      status: "queued",
      progress: 0,
      createdAt,
      filtersJson: JSON.stringify(payload.filters),
      scope: payload.scope,
    })
    .run();
  return { id, createdAt };
}

export function getExportJob(id: string) {
  return db.select().from(exportJobs).where(eq(exportJobs.id, id)).get();
}

export function claimExportJob(id: string) {
  const result = db
    .update(exportJobs)
    .set({ status: "processing" })
    .where(and(eq(exportJobs.id, id), eq(exportJobs.status, "queued")))
    .run();
  return result.changes === 1;
}

export function completeExportJob(id: string, filePath: string) {
  db.update(exportJobs)
    .set({ status: "completed", progress: 100, filePath })
    .where(eq(exportJobs.id, id))
    .run();
}

export function failExportJob(id: string, errorMessage: string) {
  db.update(exportJobs)
    .set({ status: "failed", errorMessage })
    .where(eq(exportJobs.id, id))
    .run();
}

export function writeExportCsv(jobId: string, filters: PaymentFilters, scope: "view" | "all") {
  mkdirSync(EXPORT_DIR, { recursive: true });
  const queryFilters: PaymentFilters =
    scope === "all"
      ? { ...filters, page: 1, page_size: 100 }
      : filters;

  const rows = [];
  if (scope === "all") {
    let page = 1;
    for (;;) {
      const batch = listPayments({ ...queryFilters, page, page_size: 100 });
      rows.push(...batch);
      if (batch.length < 100 || rows.length >= 10_000) break;
      page += 1;
    }
  } else {
    rows.push(...listPayments(queryFilters));
  }

  const csv = buildPaymentsCsv(
    rows.map((row) => ({
      id: row.id,
      created: row.createdAt,
      amount: row.amountMinor,
      currency: row.currency,
      status: row.status,
      description: row.description,
      customer_name: row.customerName,
      customer_email: row.customerEmail,
      payment_method_type: row.paymentMethodType,
      brand: row.brand,
      last4: row.last4,
      refunded_amount: row.refundedAmountMinor,
      failure_code: row.failureCode,
      failure_message: row.failureMessage,
    })),
  );

  const relative = `${jobId}.csv`;
  const tmp = join(EXPORT_DIR, `${jobId}.csv.tmp`);
  const finalPath = join(EXPORT_DIR, relative);
  writeFileSync(tmp, csv, "utf8");
  renameSync(tmp, finalPath);
  return relative;
}

export function resolveExportPath(relative: string) {
  const base = resolve(EXPORT_DIR);
  const full = resolve(EXPORT_DIR, relative);
  if (!full.startsWith(base + "/") && full !== base) {
    throw new Error("invalid export path");
  }
  return full;
}
