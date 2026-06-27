"use client";

import { useState } from "react";
import { useEntries } from "@/lib/store";
import JournalEditor from "@/components/JournalEditor";
import InsightCard from "@/components/InsightCard";

export default function JournalPage() {
  const { entries, ready } = useEntries();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-pine-shadow">
          Journal
        </h1>
        <p className="mt-1 text-charcoal-navy/70">
          Let it out. The AI looks beneath the words for the triggers a tracker
          would miss.
        </p>
      </header>

      <JournalEditor />

      {ready && entries.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-pine-shadow">
            Past entries
          </h2>
          <ul className="space-y-3">
            {entries.map((e) => {
              const open = openId === e.id;
              return (
                <li
                  key={e.id}
                  className="rounded-2xl border border-mint-mist/70 bg-card-mint/60 p-4"
                >
                  <button
                    onClick={() => setOpenId(open ? null : e.id)}
                    className="flex w-full items-start justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="font-mono text-xs text-charcoal-navy/55">
                        {new Date(e.ts).toLocaleString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {e.insight?.riskFlag && (
                          <span className="ml-2 text-dusty-rose">• support shown</span>
                        )}
                      </p>
                      <p className="mt-1 text-sm text-charcoal-navy/90">
                        {open ? e.text : `${e.text.slice(0, 120)}${e.text.length > 120 ? "…" : ""}`}
                      </p>
                    </div>
                    <span className="text-charcoal-navy/40">{open ? "▲" : "▼"}</span>
                  </button>
                  {open && e.insight && (
                    <div className="mt-4">
                      <InsightCard insight={e.insight} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
