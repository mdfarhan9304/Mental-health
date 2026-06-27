import { describe, it, expect } from "vitest";
import { detectCrisis, HELPLINES, DISCLAIMER } from "@/lib/safety";

describe("detectCrisis", () => {
  it("flags explicit self-harm / suicidal language", () => {
    expect(detectCrisis("I want to kill myself")).toBe(true);
    expect(detectCrisis("sometimes I think about suicide")).toBe(true);
    expect(detectCrisis("I can't go on anymore")).toBe(true);
    expect(detectCrisis("there's no point in living")).toBe(true);
  });

  it("does not flag ordinary exam stress", () => {
    expect(detectCrisis("I'm so stressed about my NEET mock")).toBe(false);
    expect(detectCrisis("I keep comparing myself to my batchmates")).toBe(false);
    expect(detectCrisis("")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(detectCrisis("I WANT TO DIE")).toBe(true);
  });
});

describe("helpline data", () => {
  it("ships India crisis resources with contact numbers", () => {
    expect(HELPLINES.length).toBeGreaterThan(0);
    for (const h of HELPLINES) {
      expect(h.name).toBeTruthy();
      expect(h.contact).toBeTruthy();
    }
    expect(HELPLINES.some((h) => /tele-?manas/i.test(h.name))).toBe(true);
  });

  it("exposes a non-empty disclaimer", () => {
    expect(DISCLAIMER.length).toBeGreaterThan(10);
  });
});
