// Crisis safety net. Runs a fast keyword/phrase check on the client for an
// instant response; the model also flags risk in its structured output.
// This is deliberately conservative — false positives just surface support
// resources, which is the safe failure mode for a wellness tool.

const CRISIS_PATTERNS: RegExp[] = [
  /\bkill (myself|me)\b/i,
  /\bkilling myself\b/i,
  /\bend (my|it all|my life)\b/i,
  /\bsuicid(e|al)\b/i,
  /\bwant to die\b/i,
  /\bdon'?t want to (live|be alive|be here)\b/i,
  /\bno (point|reason) (in|to) (living|life|going on)\b/i,
  /\b(self[- ]?harm|hurt myself|cut myself|cutting myself)\b/i,
  /\bbetter off (without me|dead)\b/i,
  /\bcan'?t (go on|do this anymore|take it anymore)\b/i,
  /\bnobody would (care|miss me|notice)\b/i,
  /\bgive up on (life|everything)\b/i,
];

/** Returns true if the text contains language suggesting crisis / self-harm risk. */
export function detectCrisis(text: string): boolean {
  if (!text) return false;
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

export interface Helpline {
  name: string;
  contact: string;
  detail: string;
  href?: string;
}

// India-focused crisis resources (the app targets NEET/JEE/CUET/CAT/GATE/UPSC aspirants).
export const HELPLINES: Helpline[] = [
  {
    name: "Tele-MANAS (Govt. of India)",
    contact: "14416 / 1-800-891-4416",
    detail: "Free 24×7 national mental health support, multiple languages.",
    href: "tel:14416",
  },
  {
    name: "KIRAN Helpline",
    contact: "1800-599-0019",
    detail: "24×7 toll-free mental health rehabilitation helpline.",
    href: "tel:18005990019",
  },
  {
    name: "iCall (TISS)",
    contact: "9152987821",
    detail: "Mon–Sat, 8am–10pm — counselling by trained professionals.",
    href: "tel:9152987821",
  },
  {
    name: "AASRA",
    contact: "9820466726",
    detail: "24×7 helpline for those in distress or feeling suicidal.",
    href: "tel:9820466726",
  },
];

export const DISCLAIMER =
  "A supportive companion, not a substitute for professional care. If you're in crisis, please reach out to a helpline or someone you trust.";
