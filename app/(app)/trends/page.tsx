"use client";

import { useState } from "react";
import { useEntries, useMoods } from "@/lib/store";
import TrendChart from "@/components/TrendChart";

export default function TrendsPage() {
  const { moods, ready } = useMoods();
  const { entries } = useEntries();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const avgMood =
    moods.length > 0
      ? (moods.reduce((s, m) => s + m.mood, 0) / moods.length).toFixed(1)
      : "—";
  const avgEnergy =
    moods.length > 0
      ? (moods.reduce((s, m) => s + m.energy, 0) / moods.length).toFixed(1)
      : "—";

  const generate = async () => {
    setLoading(true);
    setSummary(null);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moods,
          entries: entries.map((e) => ({ ts: e.ts, text: e.text })),
        }),
      });
      const data = (await res.json()) as { summary?: string };
      setSummary(data.summary ?? "Couldn't generate patterns just now.");
    } catch {
      setSummary("Couldn't reach the analyzer. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-pine-shadow">
          Your trends
        </h1>
        <p className="mt-1 text-charcoal-navy/70">
          The shape of your weeks — and what the AI notices across them.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Check-ins" value={ready ? String(moods.length) : "—"} />
        <Stat label="Avg mood" value={avgMood} />
        <Stat label="Avg energy" value={avgEnergy} />
      </div>

      <TrendChart moods={moods} />

      <section className="rounded-2xl border border-mint-mist/70 bg-blush-sand p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-pine-shadow">
            AI-surfaced patterns
          </h2>
          <button
            onClick={generate}
            disabled={loading || moods.length + entries.length === 0}
            className="rounded-xl bg-deep-teal px-4 py-2 text-sm font-semibold text-paper-white transition hover:bg-forest-floor disabled:opacity-50"
          >
            {loading ? "Reading…" : summary ? "Refresh" : "Find patterns"}
          </button>
        </div>

        {loading && (
          <div className="mt-4 animate-pulse space-y-2">
            <div className="h-3 w-full rounded bg-dusty-rose/30" />
            <div className="h-3 w-5/6 rounded bg-dusty-rose/30" />
            <div className="h-3 w-2/3 rounded bg-dusty-rose/30" />
          </div>
        )}
        {!loading && summary && (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-charcoal-navy/90">
            {summary}
          </p>
        )}
        {!loading && !summary && (
          <p className="mt-3 text-sm text-charcoal-navy/60">
            Tap “Find patterns” to have the AI read across your check-ins and
            journal entries.
          </p>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-mint-mist/70 bg-card-mint p-4 text-center">
      <p className="font-display text-2xl font-semibold text-pine-shadow">
        {value}
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-charcoal-navy/55">
        {label}
      </p>
    </div>
  );
}
