import { describe, it, expect } from "vitest";
import {
  COMPANIONS,
  LANGUAGES,
  findCompanion,
  langInstruction,
  langLabel,
} from "@/lib/companions";

describe("companions", () => {
  it("each companion maps to a Sarvam voice (id === speaker)", () => {
    expect(COMPANIONS.length).toBeGreaterThanOrEqual(2);
    for (const c of COMPANIONS) {
      expect(c.id).toBe(c.speaker);
      expect(c.name).toBeTruthy();
      expect(c.persona).toBeTruthy();
    }
  });

  it("findCompanion returns the match, or a stable default", () => {
    expect(findCompanion("priya").id).toBe("priya");
    expect(findCompanion("does-not-exist").id).toBe(COMPANIONS[0].id);
    expect(findCompanion(null).id).toBe(COMPANIONS[0].id);
  });
});

describe("languages", () => {
  it("instructs the model in the chosen language", () => {
    expect(langInstruction("hi-IN")).toMatch(/Hindi/);
    expect(langInstruction("bn-IN")).toMatch(/Bengali/);
    expect(langInstruction("en-IN")).toMatch(/English/);
    expect(langInstruction(undefined)).toMatch(/English/);
  });

  it("labels languages in their native script", () => {
    expect(langLabel("hi-IN")).toBe("हिन्दी");
    expect(LANGUAGES.some((l) => l.code === "en-IN")).toBe(true);
  });
});
