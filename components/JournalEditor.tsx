"use client";

import { useState } from "react";
import { useEntries, uid } from "@/lib/store";
import { detectCrisis } from "@/lib/safety";
import type { Insight } from "@/lib/types";
import InsightCard from "./InsightCard";
import HelplineBanner from "./HelplineBanner";
import MicButton from "./MicButton";

export default function JournalEditor() {
  const { addEntry } = useEntries();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [instantCrisis, setInstantCrisis] = useState(false);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError(null);
    setInsight(null);
    // Instant client-side safety check while the model runs.
    setInstantCrisis(detectCrisis(trimmed));

    try {
      const res = await fetch("/api/journal/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) throw new Error("analyze failed");
      const { insight: ai } = (await res.json()) as { insight: Insight };
      setInsight(ai);
      addEntry({ id: uid(), ts: Date.now(), text: trimmed, insight: ai });
      setText("");
    } catch {
      setError("Couldn't analyze that just now. Your words are safe — try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-mint-mist/70 bg-card-mint p-5">
        <div className="flex items-start justify-between gap-3">
          <label className="font-display text-lg font-semibold text-pine-shadow">
            Today&apos;s journal
          </label>
          <MicButton
            idleLabel="Speak it"
            onResult={(t) =>
              setText((prev) => (prev.trim() ? `${prev.trim()} ${t}` : t))
            }
          />
        </div>
        <p className="mt-1 text-sm text-charcoal-navy/70">
          Write freely — or tap the mic and speak in English, Hindi, or
          Hinglish. I&apos;ll gently reflect back what I notice.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="It's been one of those days..."
          className="mt-3 w-full resize-y rounded-xl border border-mint-mist bg-paper-white px-3 py-2.5 text-sm leading-relaxed outline-none placeholder:text-charcoal-navy/40 focus:border-deep-teal"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-xs text-charcoal-navy/50">
            {text.trim().length} chars · stays on your device
          </span>
          <button
            onClick={submit}
            disabled={loading || !text.trim()}
            className="rounded-xl bg-deep-teal px-5 py-2.5 text-sm font-semibold text-paper-white transition hover:bg-forest-floor disabled:opacity-50"
          >
            {loading ? "Reflecting…" : "Reflect on this"}
          </button>
        </div>
      </div>

      {instantCrisis && !insight && <HelplineBanner />}
      {error && (
        <p className="rounded-xl border border-dusty-rose bg-blush-sand p-3 text-sm text-charcoal-navy">
          {error}
        </p>
      )}
      {loading && (
        <div className="animate-pulse rounded-2xl border border-mint-mist/70 bg-card-mint p-5">
          <div className="h-3 w-1/3 rounded bg-mint-mist/70" />
          <div className="mt-3 h-5 w-3/4 rounded bg-mint-mist/50" />
          <div className="mt-4 h-3 w-1/2 rounded bg-mint-mist/40" />
        </div>
      )}
      {insight && <InsightCard insight={insight} />}
    </div>
  );
}
