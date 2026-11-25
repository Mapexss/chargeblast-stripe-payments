import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPaymentsCsv, escapeCsvCell } from "./csv";

describe("escapeCsvCell", () => {
  it("prefixes formula-like values", () => {
    assert.equal(escapeCsvCell("=1+1"), "'=1+1");
    assert.equal(escapeCsvCell("+cmd"), "'+cmd");
    assert.equal(escapeCsvCell("-1"), "'-1");
    assert.equal(escapeCsvCell("@x"), "'@x");
  });

  it("quotes delimiter and newlines", () => {
    assert.equal(escapeCsvCell("a,b"), '"a,b"');
    assert.equal(escapeCsvCell('say "hi"'), '"say ""hi"""');
  });
});

describe("buildPaymentsCsv", () => {
  it("emits header and escaped rows", () => {
    const csv = buildPaymentsCsv([
      {
        id: "pay_1",
        created: 1,
        amount: 100,
        currency: "usd",
        status: "succeeded",
        description: "=HACK",
        customer_name: "Ada",
        customer_email: "a@b.com",
        payment_method_type: "card",
        brand: "visa",
        last4: "4242",
        refunded_amount: null,
        failure_code: null,
        failure_message: null,
      },
    ]);
    assert.match(csv, /^id,created,amount/);
    assert.match(csv, /'=HACK/);
  });
});
