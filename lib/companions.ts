// Companion characters + supported languages for the chat experience.
// The chosen character gives the AI a name + persona and selects a Sarvam
// Bulbul voice; the chosen language drives both the reply text and the TTS.

export interface Language {
  code: string; // Sarvam / BCP-47 style code
  label: string; // English name
  native: string; // shown in the picker
}

// Mental-health support in English, Hindi and Bengali (all spoken by Bulbul).
export const LANGUAGES: Language[] = [
  { code: "en-IN", label: "English", native: "English" },
  { code: "hi-IN", label: "Hindi", native: "हिन्दी" },
  { code: "bn-IN", label: "Bengali", native: "বাংলা" },
];

export function langLabel(code?: string | null): string {
  return LANGUAGES.find((l) => l.code === code)?.native ?? "English";
}

/** A short instruction the model gets so it replies in the chosen language. */
export function langInstruction(code?: string | null): string {
  switch (code) {
    case "hi-IN":
      return "Reply ONLY in Hindi, written in Devanagari script. Keep it natural and warm.";
    case "bn-IN":
      return "Reply ONLY in Bengali (বাংলা), written in Bengali script. Keep it natural and warm.";
    default:
      return "Reply in clear, warm English.";
  }
}

export interface Companion {
  id: string;
  name: string;
  emoji: string;
  blurb: string; // one line, shown in the picker
  persona: string; // injected into the system prompt
  speaker: string; // Sarvam Bulbul speaker id
}

// Characters ARE the real Sarvam Bulbul (bulbul:v3) voices, so the name the
// student picks is exactly the voice that speaks back. `id` === `speaker`.
export const COMPANIONS: Companion[] = [
  {
    id: "shruti",
    name: "Shruti",
    emoji: "🌸",
    blurb: "Warm & nurturing — like a caring elder sister.",
    persona:
      "You are Shruti — warm, gentle and deeply nurturing, like a caring elder sister (didi). You hold space with patience and soft reassurance.",
    speaker: "shruti",
  },
  {
    id: "priya",
    name: "Priya",
    emoji: "☀️",
    blurb: "Bright & reassuring — a cheerful companion.",
    persona:
      "You are Priya — bright, light and reassuring, bringing gentle warmth and a little hope to heavy moments.",
    speaker: "priya",
  },
  {
    id: "neha",
    name: "Neha",
    emoji: "🌿",
    blurb: "Calm & steady — a grounded, soothing presence.",
    persona:
      "You are Neha — calm, steady and grounding. You bring a settled, reassuring presence to heavy moments.",
    speaker: "neha",
  },
  {
    id: "kavya",
    name: "Kavya",
    emoji: "🔆",
    blurb: "Encouraging & motivating — a supportive friend.",
    persona:
      "You are Kavya — an upbeat, encouraging friend who believes in the student and gently motivates them without ever pushing too hard.",
    speaker: "kavya",
  },
];

export function findCompanion(id?: string | null): Companion {
  return COMPANIONS.find((c) => c.id === id) ?? COMPANIONS[0];
}
