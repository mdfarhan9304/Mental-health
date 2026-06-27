"use client";

import { useRef, useState } from "react";

type State = "idle" | "recording" | "transcribing";

export default function MicButton({
  onResult,
  idleLabel = "Speak",
  className = "",
}: {
  onResult: (text: string, lang: string | null) => void;
  idleLabel?: string;
  className?: string;
}) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    setError(null);
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      setError("Mic not available in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, {
          type: rec.mimeType || "audio/webm",
        });
        setState("transcribing");
        try {
          const form = new FormData();
          form.append("file", blob, "audio.webm");
          const res = await fetch("/api/voice/transcribe", {
            method: "POST",
            body: form,
          });
          if (!res.ok) throw new Error("transcribe failed");
          const data = (await res.json()) as {
            transcript: string;
            languageCode: string | null;
          };
          if (data.transcript.trim()) {
            onResult(data.transcript.trim(), data.languageCode);
          } else {
            setError("Didn't catch that — try again.");
          }
        } catch {
          setError("Couldn't transcribe — try again.");
        } finally {
          setState("idle");
        }
      };
      rec.start();
      recorderRef.current = rec;
      setState("recording");
    } catch {
      setError("Mic permission denied.");
      setState("idle");
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
  };

  const onClick = () => {
    if (state === "recording") stop();
    else if (state === "idle") start();
  };

  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={onClick}
        disabled={state === "transcribing"}
        aria-label={state === "recording" ? "Stop recording" : "Start recording"}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
          state === "recording"
            ? "animate-pulse border-dusty-rose bg-dusty-rose/30 text-pine-shadow"
            : "border-mint-mist bg-paper-white text-charcoal-navy/80 hover:border-deep-teal"
        } ${state === "transcribing" ? "opacity-60" : ""} ${className}`}
      >
        {state === "recording" ? (
          <>
            <span className="inline-block h-2 w-2 rounded-full bg-dusty-rose" />
            Stop
          </>
        ) : state === "transcribing" ? (
          <>… listening</>
        ) : (
          <>🎙️ {idleLabel}</>
        )}
      </button>
      {error && (
        <span className="mt-1 text-xs text-dusty-rose">{error}</span>
      )}
    </div>
  );
}
