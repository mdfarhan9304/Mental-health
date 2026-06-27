import "server-only";
import { normalizeAudioType, ttsLang } from "./voice-utils";

// Server-only Sarvam AI client (Indian-language voice layer).
// STT = Saarika, TTS = Bulbul. The key never reaches the browser.
// Pure helpers (ttsLang, normalizeAudioType) live in ./voice-utils for testing.

const BASE = "https://api.sarvam.ai";

export { ttsLang };

function key(): string {
  const k = process.env.SARVAM_API_KEY;
  if (!k) {
    throw new Error(
      "SARVAM_API_KEY is not set. Add it to .env.local to enable voice features.",
    );
  }
  return k;
}

// Warmer, more expressive companion voice.
// bulbul:v3 is the more natural/expressive engine and supports `temperature`.
// v3 voices include shruti, priya, neha, kavya, … (v2 only: anushka, vidya, …)
export const SARVAM_TTS_MODEL = process.env.SARVAM_TTS_MODEL || "bulbul:v3";
export const SARVAM_SPEAKER = process.env.SARVAM_SPEAKER || "shruti";
// Pace < 1 sounds calmer/more caring; temperature adds expressiveness (v3 only).
const SARVAM_PACE = Number(process.env.SARVAM_TTS_PACE || "0.9");
const SARVAM_TEMPERATURE = Number(process.env.SARVAM_TTS_TEMPERATURE || "0.7");

export interface Transcription {
  transcript: string;
  languageCode: string | null;
}

/** Speech-to-text via Saarika. Accepts a Blob/File (webm/opus from the browser is fine). */
export async function transcribe(audio: Blob): Promise<Transcription> {
  const { mime, ext } = normalizeAudioType(audio.type);
  const clean = new Blob([await audio.arrayBuffer()], { type: mime });

  const form = new FormData();
  form.append("file", clean, `audio.${ext}`);
  form.append("model", "saarika:v2.5");
  form.append("language_code", "unknown"); // auto-detect

  const res = await fetch(`${BASE}/speech-to-text`, {
    method: "POST",
    headers: { "api-subscription-key": key() },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`Sarvam STT failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as {
    transcript?: string;
    language_code?: string;
  };
  return {
    transcript: data.transcript ?? "",
    languageCode: data.language_code ?? null,
  };
}

export interface Speech {
  /** base64-encoded WAV */
  audio: string;
  languageCode: string;
}

/** Text-to-speech via Bulbul. Returns base64 WAV the client can play. */
export async function synthesize(
  text: string,
  langCode?: string | null,
  speaker?: string | null,
): Promise<Speech> {
  const target = ttsLang(langCode);
  // Bulbul has per-request character limits; trim defensively.
  const clipped = text.slice(0, 1400);

  const body: Record<string, unknown> = {
    text: clipped,
    target_language_code: target,
    model: SARVAM_TTS_MODEL,
    speaker: speaker || SARVAM_SPEAKER,
    pace: SARVAM_PACE,
    enable_preprocessing: true,
  };
  // `temperature` (expressiveness) is bulbul:v3-only — sending it on v2 errors.
  if (SARVAM_TTS_MODEL.includes("v3")) body.temperature = SARVAM_TEMPERATURE;

  const res = await fetch(`${BASE}/text-to-speech`, {
    method: "POST",
    headers: {
      "api-subscription-key": key(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Sarvam TTS failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { audios?: string[] };
  const audio = data.audios?.[0];
  if (!audio) throw new Error("Sarvam TTS returned no audio.");
  return { audio, languageCode: target };
}
