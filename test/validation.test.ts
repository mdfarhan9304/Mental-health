import { describe, it, expect } from "vitest";
import { LIMITS, validateText, clampOptional } from "@/lib/validation";

describe("validateText", () => {
  it("accepts a normal trimmed string", () => {
    const r = validateText("  hello  ", 100, "Entry");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("hello");
  });

  it("rejects non-strings", () => {
    const r = validateText(42, 100);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(400);
  });

  it("rejects empty / whitespace-only input", () => {
    expect(validateText("", 100).ok).toBe(false);
    expect(validateText("   ", 100).ok).toBe(false);
  });

  it("rejects oversized input with 413", () => {
    const r = validateText("x".repeat(101), 100);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(413);
  });
});

describe("clampOptional", () => {
  it("returns undefined for blank / non-string", () => {
    expect(clampOptional("  ", 10)).toBeUndefined();
    expect(clampOptional(undefined, 10)).toBeUndefined();
    expect(clampOptional(5, 10)).toBeUndefined();
  });

  it("trims and clamps to max length", () => {
    expect(clampOptional("  hi ", 10)).toBe("hi");
    expect(clampOptional("abcdef", 3)).toBe("abc");
  });
});

describe("LIMITS", () => {
  it("defines sane positive bounds", () => {
    expect(LIMITS.journalText).toBeGreaterThan(0);
    expect(LIMITS.chatMessages).toBeGreaterThan(0);
    expect(LIMITS.audioBytes).toBeGreaterThan(1_000_000);
  });
});
