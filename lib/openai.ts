import "server-only";
import OpenAI from "openai";

// Server-only OpenAI client. The "server-only" import above makes the build
// fail if this module is ever imported into a client component, so the key
// can never leak into the browser bundle.

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Copy .env.local.example to .env.local and add your key.",
    );
  }
  if (!client) {
    client = new OpenAI({ apiKey });
  }
  return client;
}

export const CHAT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
export const ANALYSIS_MODEL =
  process.env.OPENAI_ANALYSIS_MODEL || process.env.OPENAI_MODEL || "gpt-4o";
