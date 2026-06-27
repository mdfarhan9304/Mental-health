// Shared input-validation limits and guards for the public API routes.
// Centralising the bounds keeps them auditable and lets the test suite assert
// them. Caps are generous for real use but block cost/DoS abuse and oversized
// payloads from ever reaching the model providers. This module is pure (no
// framework or network imports) so it is trivially unit-testable.

export const LIMITS = {
  /** Max characters for a single journal entry analysed in one request. */
  journalText: 8_000,
  /** Max characters for a single chat message kept from the client. */
  chatMessage: 4_000,
  /** Max chat messages accepted in one request (history is trimmed client-side too). */
  chatMessages: 50,
  /** Max characters of text sent to text-to-speech in one request. */
  ttsText: 2_000,
  /** Max characters for a free-text note (mood / exercise context). */
  note: 1_000,
  /** Max bytes for an uploaded audio clip (~10 MB). */
  audioBytes: 10 * 1024 * 1024,
} as const;

export interface Ok<T> {
  ok: true;
  value: T;
}
export interface Err {
  ok: false;
  error: string;
  status: number;
}
export type Result<T> = Ok<T> | Err;

const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
const err = (error: string, status = 400): Err => ({ ok: false, error, status });

/** Require a non-empty string within `max` characters. Trims first. */
export function validateText(
  input: unknown,
  max: number,
  field = "text",
): Result<string> {
  if (typeof input !== "string") return err(`${field} must be a string.`);
  const trimmed = input.trim();
  if (!trimmed) return err(`${field} is empty.`);
  if (trimmed.length > max)
    return err(`${field} is too long (max ${max} characters).`, 413);
  return ok(trimmed);
}

/** Optional free text: undefined when absent/blank, else trimmed and clamped to `max`. */
export function clampOptional(input: unknown, max: number): string | undefined {
  if (typeof input !== "string") return undefined;
  const t = input.trim();
  if (!t) return undefined;
  return t.slice(0, max);
}

export type Role = "user" | "assistant";
export interface ChatTurn {
  role: Role;
  content: string;
}

/**
 * Validate a chat message array: shape, count, and per-message length. Returns
 * normalised turns with content clamped to `maxLen` so an oversized client
 * payload can't inflate a prompt. Requires at least one non-empty message.
 */
export function validateMessages(
  input: unknown,
  opts: { maxCount: number; maxLen: number },
): Result<ChatTurn[]> {
  if (!Array.isArray(input) || input.length === 0) {
    return err("messages must be a non-empty array.");
  }
  if (input.length > opts.maxCount) {
    return err(`Too many messages (max ${opts.maxCount}).`, 413);
  }
  const out: ChatTurn[] = [];
  for (const m of input) {
    if (!m || typeof m !== "object") return err("Each message must be an object.");
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") {
      return err("Each message role must be 'user' or 'assistant'.");
    }
    if (typeof content !== "string") {
      return err("Each message content must be a string.");
    }
    out.push({ role, content: content.slice(0, opts.maxLen) });
  }
  if (!out.some((m) => m.content.trim())) {
    return err("messages contain no usable content.");
  }
  return ok(out);
}
