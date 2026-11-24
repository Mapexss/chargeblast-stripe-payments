import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    createdAt: integer("created_at").notNull(),
    expiresAt: integer("expires_at").notNull(),
  },
  (table) => [uniqueIndex("sessions_token_hash_uidx").on(table.tokenHash)],
);

export const customers = sqliteTable(
  "customers",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [index("customers_email_idx").on(table.email)],
);

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priceMinor: integer("price_minor").notNull(),
  currency: text("currency").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at").notNull(),
});

export const payments = sqliteTable(
  "payments",
  {
    id: text("id").primaryKey(),
    amountMinor: integer("amount_minor").notNull(),
    currency: text("currency").notNull(),
    status: text("status").notNull(),
    refundedAmountMinor: integer("refunded_amount_minor"),
    failureCode: text("failure_code"),
    failureMessage: text("failure_message"),
    description: text("description").notNull(),
    createdAt: integer("created_at").notNull(),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    paymentMethodType: text("payment_method_type").notNull(),
    brand: text("brand"),
    last4: text("last4"),
    funding: text("funding"),
    expMonth: integer("exp_month"),
    expYear: integer("exp_year"),
    cvcCheck: text("cvc_check"),
    wallet: text("wallet"),
    feeMinor: integer("fee_minor").notNull(),
    netMinor: integer("net_minor").notNull(),
    riskScore: integer("risk_score"),
    declineCode: text("decline_code"),
    cardFingerprint: text("card_fingerprint"),
    balanceTransactionId: text("balance_transaction_id"),
    paymentIntentId: text("payment_intent_id"),
    receiptEmail: text("receipt_email"),
    metadata: text("metadata").notNull().default("{}"),
  },
  (table) => [
    index("payments_created_at_idx").on(table.createdAt),
    index("payments_status_idx").on(table.status),
    index("payments_payment_method_type_idx").on(table.paymentMethodType),
    index("payments_amount_minor_idx").on(table.amountMinor),
    index("payments_customer_id_idx").on(table.customerId),
    index("payments_last4_idx").on(table.last4),
  ],
);

export const paymentEvents = sqliteTable("payment_events", {
  id: text("id").primaryKey(),
  paymentId: text("payment_id")
    .notNull()
    .references(() => payments.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  createdAt: integer("created_at").notNull(),
  message: text("message").notNull(),
});

export const balances = sqliteTable("balances", {
  currency: text("currency").primaryKey(),
  availableMinor: integer("available_minor").notNull().default(0),
  pendingMinor: integer("pending_minor").notNull().default(0),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const exportJobs = sqliteTable("export_jobs", {
  id: text("id").primaryKey(),
  status: text("status").notNull().default("queued"),
  progress: integer("progress").notNull().default(0),
  filePath: text("file_path"),
  createdAt: integer("created_at").notNull(),
  filtersJson: text("filters_json").notNull(),
  scope: text("scope").notNull(),
  errorMessage: text("error_message"),
});
