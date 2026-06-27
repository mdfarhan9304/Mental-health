// Pure voice helpers — no framework/network/`server-only` imports, so they are
// safe to import anywhere and trivially unit-testable. Used by lib/sarvam.ts.

// Languages Sarvam Bulbul (TTS) can speak. STT auto-detects far more.
export const TTS_LANGS = new Set([
  "bn-IN", "en-IN", "gu-IN", "hi-IN", "kn-IN", "ml-IN",
  "mr-IN", "od-IN", "pa-IN", "ta-IN", "te-IN",
]);

/** Normalise a detected language code to one Bulbul can speak (fallback en-IN). */
export function ttsLang(code?: string | null): string {
  return code && TTS_LANGS.has(code) ? code : "en-IN";
}

/**
 * Browser MediaRecorder tags audio as e.g. "audio/webm;codecs=opus", but
 * Sarvam validates the exact MIME and rejects the codec suffix. Return the
 * bare MIME (which IS on its allowlist) and a matching file extension.
 */
export function normalizeAudioType(rawType?: string): {
  mime: string;
  ext: string;
} {
  const mime = (rawType || "audio/webm").split(";")[0] || "audio/webm";
  const ext =
    mime.includes("mp4") || mime.includes("m4a")
      ? "m4a"
      : mime.includes("ogg")
        ? "ogg"
        : mime.includes("wav") || mime.includes("wave")
          ? "wav"
          : mime.includes("mpeg") || mime.includes("mp3")
            ? "mp3"
            : "webm";
  return { mime, ext };
}
