import { describe, it, expect } from "vitest";
import { buildCompanionSystem } from "@/lib/prompts";

describe("buildCompanionSystem", () => {
  it("injects the chosen companion's name", () => {
    const s = buildCompanionSystem({ companionId: "priya", lang: "en-IN" });
    expect(s).toMatch(/Priya/);
    expect(s).toMatch(/English/);
  });

  it("switches language instruction", () => {
    expect(buildCompanionSystem({ companionId: "shruti", lang: "hi-IN" })).toMatch(
      /Hindi/,
    );
  });

  it("adds a crisis posture with helplines when flagged", () => {
    const s = buildCompanionSystem({ companionId: "shruti", crisis: true });
    expect(s).toMatch(/14416/); // Tele-MANAS
  });

  it("acknowledges completed tasks", () => {
    const s = buildCompanionSystem({
      companionId: "neha",
      completedTasks: ["Take a 10-minute walk"],
    });
    expect(s).toMatch(/Take a 10-minute walk/);
  });

  it("never claims to be a medical professional", () => {
    const s = buildCompanionSystem({ companionId: "kavya" });
    expect(s).toMatch(/NOT a medical professional/i);
  });
});
