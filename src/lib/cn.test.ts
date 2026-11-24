import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cn } from "./cn";

describe("cn", () => {
  it("merges class names", () => {
    assert.equal(cn("px-2", "py-1"), "px-2 py-1");
  });

  it("resolves conflicting tailwind classes", () => {
    assert.equal(cn("px-2", "px-4"), "px-4");
  });
});
