import "server-only";

import { and, asc, count, desc, eq, gte, inArray, lte, sql, type SQL } from "drizzle-orm";
import { db } from "@/db/client";
import { customers, paymentEvents, payments } from "@/db/schema";
import type { PaymentFilters } from "./schema";
import type { PaymentRecord } from "./api";

const statusRank = sql<number>`CASE ${payments.status}
  WHEN 'succeeded' THEN 0
  WHEN 'pending' THEN 1
  WHEN 'failed' THEN 2
  WHEN 'refunded' THEN 3
  ELSE 4 END`;

function buildConditions(filters: PaymentFilters): SQL[] {
  const conditions: SQL[] = [];

  if (filters.status?.length) {
    conditions.push(inArray(payments.status, filters.status));
  }
  if (filters.method?.length) {
    conditions.push(inArray(payments.paymentMethodType, filters.method));
  }
  if (filters.currency) {
    conditions.push(eq(payments.currency, filters.currency));
  }
  if (filters.from !== undefined) {
    conditions.push(gte(payments.createdAt, filters.from));
  }
  if (filters.to !== undefined) {
    conditions.push(lte(payments.createdAt, filters.to));
  }
  if (filters.amount_op && filters.currency) {
    if (filters.amount_op === "eq" && filters.amount_value !== undefined) {
      conditions.push(eq(payments.amountMinor, filters.amount_value));
    } else if (filters.amount_op === "gt" && filters.amount_value !== undefined) {
      conditions.push(sql`${payments.amountMinor} > ${filters.amount_value}`);
    } else if (filters.amount_op === "lt" && filters.amount_value !== undefined) {
      conditions.push(sql`${payments.amountMinor} < ${filters.amount_value}`);
    } else if (
      filters.amount_op === "between" &&
      filters.amount_min !== undefined &&
      filters.amount_max !== undefined
    ) {
      conditions.push(gte(payments.amountMinor, filters.amount_min));
      conditions.push(lte(payments.amountMinor, filters.amount_max));
    }
  }
  if (filters.q) {
    const prefix = `${filters.q}%`;
    conditions.push(
      sql`(
        ${payments.id} LIKE ${prefix}
        OR ${customers.email} LIKE ${prefix}
        OR ${payments.last4} LIKE ${prefix}
      )`,
    );
  }

  return conditions;
}

function orderClauses(filters: PaymentFilters) {
  const direction = filters.direction === "asc" ? asc : desc;
  if (filters.sort === "amount") {
    return [direction(payments.amountMinor), asc(payments.id)];
  }
  if (filters.sort === "status") {
    return [direction(statusRank), asc(payments.id)];
  }
  return [direction(payments.createdAt), asc(payments.id)];
}

const paymentSelect = {
  id: payments.id,
  amountMinor: payments.amountMinor,
  currency: payments.currency,
  status: payments.status,
  refundedAmountMinor: payments.refundedAmountMinor,
  failureCode: payments.failureCode,
  failureMessage: payments.failureMessage,
  description: payments.description,
  createdAt: payments.createdAt,
  customerId: payments.customerId,
  paymentMethodType: payments.paymentMethodType,
  brand: payments.brand,
  last4: payments.last4,
  funding: payments.funding,
  expMonth: payments.expMonth,
  expYear: payments.expYear,
  cvcCheck: payments.cvcCheck,
  wallet: payments.wallet,
  feeMinor: payments.feeMinor,
  netMinor: payments.netMinor,
  riskScore: payments.riskScore,
  declineCode: payments.declineCode,
  cardFingerprint: payments.cardFingerprint,
  balanceTransactionId: payments.balanceTransactionId,
  paymentIntentId: payments.paymentIntentId,
  receiptEmail: payments.receiptEmail,
  metadata: payments.metadata,
  customerName: customers.name,
  customerEmail: customers.email,
};

export function listPayments(filters: PaymentFilters): PaymentRecord[] {
  const conditions = buildConditions(filters);
  const where = conditions.length ? and(...conditions) : undefined;
  const offset = (filters.page - 1) * filters.page_size;

  return db
    .select(paymentSelect)
    .from(payments)
    .innerJoin(customers, eq(payments.customerId, customers.id))
    .where(where)
    .orderBy(...orderClauses(filters))
    .limit(filters.page_size)
    .offset(offset)
    .all() as PaymentRecord[];
}

export function countPayments(filters: PaymentFilters): number {
  const conditions = buildConditions(filters);
  const where = conditions.length ? and(...conditions) : undefined;
  const row = db
    .select({ value: count() })
    .from(payments)
    .innerJoin(customers, eq(payments.customerId, customers.id))
    .where(where)
    .get();
  return row?.value ?? 0;
}

export function getPaymentById(id: string): PaymentRecord | undefined {
  return db
    .select(paymentSelect)
    .from(payments)
    .innerJoin(customers, eq(payments.customerId, customers.id))
    .where(eq(payments.id, id))
    .get() as PaymentRecord | undefined;
}

export function listPaymentEvents(paymentId: string) {
  return db
    .select()
    .from(paymentEvents)
    .where(eq(paymentEvents.paymentId, paymentId))
    .orderBy(asc(paymentEvents.createdAt))
    .all();
}
