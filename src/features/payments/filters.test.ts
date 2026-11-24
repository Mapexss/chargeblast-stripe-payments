import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseFilters, serializeFilters } from "./filters";

describe("parseFilters/serializeFilters", () => {
  it("round-trips defaults", () => {
    const parsed = parseFilters(new URLSearchParams());
    assert.deepEqual(parsed, {
      q: undefined,
      status: [],
      method: [],
      currency: undefined,
      range: undefined,
      from: undefined,
      to: undefined,
      amount_op: undefined,
      amount_value: undefined,
      amount_min: undefined,
      amount_max: undefined,
      sort: "created",
      direction: "desc",
      page: 1,
      page_size: 25,
    });
    assert.equal(serializeFilters(parsed).toString(), "");
  });

  it("round-trips a rich filter set", () => {
    const input = new URLSearchParams({
      q: "pay_00",
      status: "succeeded,failed",
      method: "card",
      currency: "usd",
      range: "custom",
      from: "100",
      to: "200",
      amount_op: "between",
      amount_min: "500",
      amount_max: "5000",
      sort: "amount",
      direction: "asc",
      page: "2",
      page_size: "50",
    });
    const parsed = parseFilters(input);
    const again = parseFilters(serializeFilters(parsed));
    assert.deepEqual(again, parsed);
  });

  it("swaps inverted from/to and drops invalid enums", () => {
    const parsed = parseFilters(
      new URLSearchParams({
        from: "200",
        to: "100",
        status: "succeeded,nope",
        page: "0",
        page_size: "12",
      }),
    );
    assert.equal(parsed.from, 100);
    assert.equal(parsed.to, 200);
    assert.deepEqual(parsed.status, ["succeeded"]);
    assert.equal(parsed.page, 1);
    assert.equal(parsed.page_size, 25);
  });
});
