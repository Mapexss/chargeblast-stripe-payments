import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listEnvelope, serializePayment, type PaymentRecord } from "./api";

const sample: PaymentRecord = {
  id: "pay_0001",
  amountMinor: 1234,
  currency: "usd",
  status: "succeeded",
  refundedAmountMinor: null,
  failureCode: null,
  failureMessage: null,
  description: "Widget",
  createdAt: 1_700_000_000,
  customerId: "cus_0001",
  paymentMethodType: "card",
  brand: "visa",
  last4: "4242",
  funding: "credit",
  expMonth: 12,
  expYear: 2030,
  cvcCheck: "pass",
  wallet: null,
  feeMinor: 66,
  netMinor: 1168,
  riskScore: 10,
  declineCode: null,
  cardFingerprint: "fp",
  balanceTransactionId: "txn_0001",
  paymentIntentId: "pi_0001",
  receiptEmail: "a@b.com",
  metadata: "{}",
  customerName: "Ada Lovelace",
  customerEmail: "ada@example.com",
};

describe("serializePayment", () => {
  it("maps minor units and nulls for the wire shape", () => {
    const wire = serializePayment(sample);
    assert.equal(wire.object, "payment");
    assert.equal(wire.amount, 1234);
    assert.equal(wire.created, 1_700_000_000);
    assert.equal(wire.refunded_amount, null);
    assert.equal(wire.failure_code, null);
    assert.equal(wire.payment_method.wallet, null);
    assert.deepEqual(wire.customer, {
      id: "cus_0001",
      name: "Ada Lovelace",
      email: "ada@example.com",
    });
  });
});

describe("listEnvelope", () => {
  it("computes has_more from offset pagination", () => {
    const envelope = listEnvelope({
      data: [1, 2],
      totalCount: 30,
      page: 1,
      pageSize: 25,
      url: "/api/stripe/v1/payments?page=1",
    });
    assert.equal(envelope.has_more, true);
    assert.equal(envelope.total_count, 30);
    assert.equal(envelope.page_size, 25);
  });
});
