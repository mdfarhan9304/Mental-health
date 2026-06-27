"use client";

// Client helper: play TTS audio from /api/voice/speak (Sarvam Bulbul).

let current: HTMLAudioElement | null = null;

export function stopSpeaking() {
  if (current) {
    current.pause();
    current = null;
  }
}

export async function speak(
  text: string,
  lang?: string | null,
  speaker?: string | null,
): Promise<void> {
  const res = await fetch("/api/voice/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, lang, speaker }),
  });
  if (!res.ok) throw new Error("tts failed");
  const { audio } = (await res.json()) as { audio: string };

  stopSpeaking();
  const el = new Audio(`data:audio/wav;base64,${audio}`);
  current = el;
  await el.play().catch(() => {});
  await new Promise<void>((resolve) => {
    el.onended = () => resolve();
    el.onerror = () => resolve();
  });
}
