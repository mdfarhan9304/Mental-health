import { describe, it, expect } from "vitest";
import { ttsLang, normalizeAudioType, TTS_LANGS } from "@/lib/voice-utils";

describe("ttsLang", () => {
  it("passes through supported languages", () => {
    expect(ttsLang("hi-IN")).toBe("hi-IN");
    expect(ttsLang("bn-IN")).toBe("bn-IN");
  });
  it("falls back to en-IN for unknown/empty", () => {
    expect(ttsLang(null)).toBe("en-IN");
    expect(ttsLang(undefined)).toBe("en-IN");
    expect(ttsLang("fr-FR")).toBe("en-IN");
  });
  it("only lists India locales", () => {
    for (const code of TTS_LANGS) expect(code.endsWith("-IN")).toBe(true);
  });
});

describe("normalizeAudioType", () => {
  it("strips the MediaRecorder codec suffix", () => {
    expect(normalizeAudioType("audio/webm;codecs=opus")).toEqual({
      mime: "audio/webm",
      ext: "webm",
    });
  });
  it("maps common container types to extensions", () => {
    expect(normalizeAudioType("audio/mp4").ext).toBe("m4a");
    expect(normalizeAudioType("audio/ogg").ext).toBe("ogg");
    expect(normalizeAudioType("audio/wav").ext).toBe("wav");
    expect(normalizeAudioType("audio/mpeg").ext).toBe("mp3");
  });
  it("defaults to webm when type is missing", () => {
    expect(normalizeAudioType(undefined)).toEqual({
      mime: "audio/webm",
      ext: "webm",
    });
  });
});
