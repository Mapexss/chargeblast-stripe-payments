import type { balances, customers, payments, products } from "@/db/schema";

type PaymentRow = typeof payments.$inferSelect;
type CustomerRow = typeof customers.$inferSelect;
type ProductRow = typeof products.$inferSelect;
type BalanceRow = typeof balances.$inferSelect;

export type PaymentRecord = PaymentRow & {
  customerName: string;
  customerEmail: string;
};

export function serializePayment(row: PaymentRecord) {
  return {
    id: row.id,
    object: "payment" as const,
    amount: row.amountMinor,
    currency: row.currency,
    status: row.status,
    description: row.description,
    created: row.createdAt,
    customer: {
      id: row.customerId,
      name: row.customerName,
      email: row.customerEmail,
    },
    payment_method: {
      type: row.paymentMethodType,
      brand: row.brand ?? null,
      last4: row.last4 ?? null,
      funding: row.funding ?? null,
      exp_month: row.expMonth ?? null,
      exp_year: row.expYear ?? null,
      cvc_check: row.cvcCheck ?? null,
      wallet: row.wallet ?? null,
    },
    refunded_amount: row.refundedAmountMinor ?? null,
    failure_code: row.failureCode ?? null,
    failure_message: row.failureMessage ?? null,
  };
}

export function serializeCustomer(row: CustomerRow) {
  return {
    id: row.id,
    object: "customer" as const,
    name: row.name,
    email: row.email,
    created: row.createdAt,
  };
}

export function serializeProduct(row: ProductRow) {
  return {
    id: row.id,
    object: "product" as const,
    name: row.name,
    description: row.description,
    price: row.priceMinor,
    currency: row.currency,
    active: row.active,
    created: row.createdAt,
  };
}

export function serializeBalance(row: BalanceRow) {
  return {
    object: "balance" as const,
    currency: row.currency,
    available: row.availableMinor,
    pending: row.pendingMinor,
    updated: row.updatedAt,
  };
}

export function listEnvelope<T>(args: {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  url: string;
}) {
  return {
    object: "list" as const,
    data: args.data,
    has_more: args.page * args.pageSize < args.totalCount,
    total_count: args.totalCount,
    page: args.page,
    page_size: args.pageSize,
    url: args.url,
  };
}
