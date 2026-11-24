import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeNextPath } from "./safe-next";

describe("safeNextPath", () => {
  it("defaults to payments", () => {
    assert.equal(safeNextPath(undefined), "/payments");
  });

  it("accepts relative paths", () => {
    assert.equal(safeNextPath("/customers"), "/customers");
  });

  it("rejects protocol-relative and absolute URLs", () => {
    assert.equal(safeNextPath("//evil.com"), "/payments");
    assert.equal(safeNextPath("https://evil.com"), "/payments");
  });
});
