import { createHash } from "node:crypto";
import { mkdirSync, rmSync } from "node:fs";
import { faker } from "@faker-js/faker";
import { hashPassword } from "../features/auth/password";
import { db, sqlite } from "./client";
import {
  balances,
  customers,
  exportJobs,
  paymentEvents,
  payments,
  products,
  sessions,
  users,
} from "./schema";

const SEED = 20261123;
const SEED_NOW = Date.parse("2026-11-23T12:00:00.000Z") / 1000;
const EXPORT_DIR = process.env.EXPORT_DIR ?? "./.data/exports";
const DAY = 86400;

function pick<T>(items: [T, number][]): T {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0);
  let cursor = faker.number.float({ min: 0, max: total });
  for (const [value, weight] of items) {
    cursor -= weight;
    if (cursor <= 0) return value;
  }
  return items[items.length - 1]![0];
}

function pad(n: number, width = 4) {
  return String(n).padStart(width, "0");
}

function feeFor(amountMinor: number) {
  return Math.round(amountMinor * 0.029) + 30;
}

function clearExports() {
  mkdirSync(EXPORT_DIR, { recursive: true });
  rmSync(EXPORT_DIR, { recursive: true, force: true });
  mkdirSync(EXPORT_DIR, { recursive: true });
}

function resetAll() {
  db.delete(paymentEvents).run();
  db.delete(payments).run();
  db.delete(exportJobs).run();
  db.delete(balances).run();
  db.delete(products).run();
  db.delete(customers).run();
  db.delete(sessions).run();
  db.delete(users).run();
  clearExports();
}

async function seed() {
  const reset = process.argv.includes("--reset");
  const existing = sqlite.prepare("SELECT COUNT(*) AS c FROM payments").get() as {
    c: number;
  };
  if (existing.c > 0 && !reset) {
    console.error("payments already seeded; pass --reset to rebuild");
    process.exit(1);
  }
  if (reset) resetAll();

  faker.seed(SEED);
  const passwordHash = await hashPassword("demo1234");

  const customerRows = Array.from({ length: 150 }, (_, i) => {
    const id = `cus_${pad(i + 1)}`;
    return {
      id,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      createdAt: SEED_NOW - faker.number.int({ min: 0, max: 90 * DAY }),
    };
  });

  const productRows = Array.from({ length: 25 }, (_, i) => {
    const currency = pick([
      ["usd", 0.6],
      ["eur", 0.2],
      ["brl", 0.15],
      ["gbp", 0.05],
    ] as [string, number][]);
    return {
      id: `prod_${pad(i + 1)}`,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      priceMinor: faker.number.int({ min: 500, max: 50000 }),
      currency,
      active: true,
      createdAt: SEED_NOW - faker.number.int({ min: 0, max: 90 * DAY }),
    };
  });

  const paymentRows: (typeof payments.$inferInsert)[] = [];
  const eventRows: (typeof paymentEvents.$inferInsert)[] = [];
  let eventSeq = 1;

  for (let i = 0; i < 800; i++) {
    const id = `pay_${pad(i + 1)}`;
    let currency = pick([
      ["usd", 0.6],
      ["eur", 0.2],
      ["brl", 0.15],
      ["gbp", 0.05],
    ] as [string, number][]);
    const method = pick([
      ["card", 0.8],
      ["ach", 0.12],
      ["wallet", 0.08],
    ] as [string, number][]);
    if (method === "ach" && currency !== "usd") {
      currency = "usd";
    }
    const status = pick([
      ["succeeded", 0.78],
      ["pending", 0.1],
      ["failed", 0.08],
      ["refunded", 0.04],
    ] as [string, number][]);
    const amountMinor = pick([
      [faker.number.int({ min: 200, max: 2000 }), 0.5],
      [faker.number.int({ min: 2001, max: 15000 }), 0.35],
      [faker.number.int({ min: 15001, max: 250000 }), 0.15],
    ] as [number, number][]);
    const product = productRows[i % productRows.length]!;
    const customer = customerRows[i % customerRows.length]!;
    const createdAt = SEED_NOW - faker.number.int({ min: 0, max: 90 * DAY });
    const feeMinor = feeFor(amountMinor);
    const brands =
      currency === "brl"
        ? (["elo", "visa", "mastercard"] as const)
        : (["visa", "mastercard", "amex"] as const);
    const brand =
      method === "card" ? faker.helpers.arrayElement([...brands]) : method === "wallet" ? "visa" : null;
    const last4 =
      method === "ach" ? null : faker.string.numeric({ length: 4, allowLeadingZeros: true });
    let refundedAmountMinor: number | null = null;
    if (status === "refunded") {
      refundedAmountMinor = pick([
        [amountMinor, 0.5],
        [Math.max(1, Math.floor(amountMinor * 0.4)), 0.5],
      ] as [number, number][]);
    }
    const failureCode = status === "failed" ? "card_declined" : null;
    const failureMessage =
      status === "failed" ? "Your card was declined." : null;
    const netMinor =
      status === "pending" || status === "failed"
        ? 0
        : amountMinor - (refundedAmountMinor ?? 0) - feeMinor;

    paymentRows.push({
      id,
      amountMinor,
      currency,
      status,
      refundedAmountMinor,
      failureCode,
      failureMessage,
      description: product.name,
      createdAt,
      customerId: customer.id,
      paymentMethodType: method,
      brand,
      last4,
      funding: method === "card" ? pick([["credit", 0.7], ["debit", 0.3]] as [string, number][]) : null,
      expMonth: method === "ach" ? null : faker.number.int({ min: 1, max: 12 }),
      expYear: method === "ach" ? null : faker.number.int({ min: 2026, max: 2032 }),
      cvcCheck: method === "card" ? "pass" : null,
      wallet: method === "wallet" ? pick([["apple_pay", 0.5], ["google_pay", 0.5]] as [string, number][]) : null,
      feeMinor,
      netMinor,
      riskScore: faker.number.int({ min: 0, max: 100 }),
      declineCode: status === "failed" ? "generic_decline" : null,
      cardFingerprint: method === "ach" ? null : faker.string.alphanumeric(16),
      balanceTransactionId: status === "succeeded" || status === "refunded" ? `txn_${pad(i + 1)}` : null,
      paymentIntentId: `pi_${pad(i + 1)}`,
      receiptEmail: customer.email,
      metadata: JSON.stringify({ order_id: `ord_${pad(i + 1)}` }),
    });

    const terminal =
      status === "succeeded"
        ? "succeeded"
        : status === "failed"
          ? "failed"
          : status === "refunded"
            ? "refunded"
            : "processing";
    const count = faker.number.int({ min: 2, max: 5 });
    const types = ["created", "authorized", "captured", terminal].slice(0, count);
    if (!types.includes(terminal)) types[types.length - 1] = terminal;
    let t = createdAt;
    for (const type of types) {
      t += faker.number.int({ min: 1, max: 120 });
      eventRows.push({
        id: `evt_${pad(eventSeq++)}`,
        paymentId: id,
        type,
        createdAt: t,
        message: `${type} for ${id}`,
      });
    }
  }

  const balanceMap = new Map<string, { available: number; pending: number }>();
  for (const payment of paymentRows) {
    const entry = balanceMap.get(payment.currency) ?? { available: 0, pending: 0 };
    if (payment.status === "pending") {
      entry.pending += payment.amountMinor;
    } else if (payment.status === "succeeded" || payment.status === "refunded") {
      entry.available +=
        payment.amountMinor -
        (payment.refundedAmountMinor ?? 0) -
        payment.feeMinor;
    }
    balanceMap.set(payment.currency, entry);
  }

  db.transaction((tx) => {
    tx.insert(users)
      .values({
        id: "usr_0001",
        email: "demo@stripe.test",
        name: "Demo User",
        passwordHash,
        createdAt: SEED_NOW,
      })
      .run();

    for (let i = 0; i < customerRows.length; i += 100) {
      tx.insert(customers).values(customerRows.slice(i, i + 100)).run();
    }
    tx.insert(products).values(productRows).run();
    for (let i = 0; i < paymentRows.length; i += 100) {
      tx.insert(payments).values(paymentRows.slice(i, i + 100)).run();
    }
    for (let i = 0; i < eventRows.length; i += 100) {
      tx.insert(paymentEvents).values(eventRows.slice(i, i + 100)).run();
    }
    tx.insert(balances)
      .values(
        [...balanceMap.entries()].map(([currency, value]) => ({
          currency,
          availableMinor: value.available,
          pendingMinor: value.pending,
          updatedAt: SEED_NOW,
        })),
      )
      .run();
  });

  const counts = {
    users: sqlite.prepare("SELECT COUNT(*) AS c FROM users").get() as { c: number },
    customers: sqlite.prepare("SELECT COUNT(*) AS c FROM customers").get() as { c: number },
    products: sqlite.prepare("SELECT COUNT(*) AS c FROM products").get() as { c: number },
    payments: sqlite.prepare("SELECT COUNT(*) AS c FROM payments").get() as { c: number },
    events: sqlite.prepare("SELECT COUNT(*) AS c FROM payment_events").get() as { c: number },
    balances: sqlite.prepare("SELECT COUNT(*) AS c FROM balances").get() as { c: number },
  };

  const refundedMissing = sqlite
    .prepare(
      `SELECT p.id FROM payments p
       WHERE p.status = 'refunded'
       AND NOT EXISTS (
         SELECT 1 FROM payment_events e WHERE e.payment_id = p.id AND e.type = 'refunded'
       )`,
    )
    .all();

  if (counts.payments.c !== 800 || refundedMissing.length > 0) {
    console.error("seed verification failed", counts, refundedMissing);
    process.exit(1);
  }

  const dump = sqlite
    .prepare(
      "SELECT id, amount_minor, currency, status, created_at, customer_id FROM payments ORDER BY id",
    )
    .all();
  const hash = createHash("sha256").update(JSON.stringify(dump)).digest("hex");

  console.table({
    users: counts.users.c,
    customers: counts.customers.c,
    products: counts.products.c,
    payments: counts.payments.c,
    events: counts.events.c,
    balances: counts.balances.c,
  });
  console.log(`payments_sha256=${hash}`);
}

seed()
  .then(() => {
    sqlite.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    sqlite.close();
    process.exit(1);
  });
