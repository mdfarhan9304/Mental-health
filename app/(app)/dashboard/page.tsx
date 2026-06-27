"use client";

import Link from "next/link";
import { useEntries, useMoods } from "@/lib/store";
import { useUser } from "@/lib/auth";
import { makeSeed } from "@/lib/seed";
import { MOOD_EMOJI, MOOD_LABELS } from "@/lib/types";
import MoodLogger from "@/components/MoodLogger";
import InsightCard from "@/components/InsightCard";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const QUICK = [
  { href: "/journal", icon: "📓", title: "Journal", desc: "Unpack today" },
  { href: "/companion", icon: "💬", title: "Talk it out", desc: "Chat with me" },
  { href: "/exercises", icon: "🧘", title: "Reset", desc: "Breathe & ground" },
  { href: "/trends", icon: "📊", title: "Trends", desc: "See patterns" },
];

export default function Dashboard() {
  const { moods, ready: moodsReady, setMoods } = useMoods();
  const { entries, ready: entriesReady, setEntries } = useEntries();
  const { user } = useUser();

  const latest = moods[0];
  const latestInsight = entries.find((e) => e.insight)?.insight;
  const hasData = moods.length > 0 || entries.length > 0;

  const loadSample = () => {
    const { moods: m, entries: e } = makeSeed();
    setMoods(m);
    setEntries(e);
  };
  const clearData = () => {
    setMoods([]);
    setEntries([]);
  };

  return (
    <div className="space-y-6">
      <section className="animate-fade-up">
        <p className="font-mono text-xs uppercase tracking-wider text-deep-teal">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-pine-shadow sm:text-4xl">
          {greeting()}. How&apos;s your head today?
        </h1>
        <p className="mt-2 max-w-xl text-charcoal-navy/70">
          A calm corner just for you, between the mock tests and the syllabus.
          Check in, write it out, or just breathe.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <MoodLogger />

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-mint-mist/70 bg-blush-sand p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-charcoal-navy/55">
              Last check-in
            </p>
            {moodsReady && latest ? (
              <div className="mt-2 flex items-center gap-3">
                <span className="text-4xl">{MOOD_EMOJI[latest.mood]}</span>
                <div>
                  <p className="font-display text-lg text-pine-shadow">
                    {MOOD_LABELS[latest.mood]} · energy {latest.energy}/5
                  </p>
                  <p className="text-xs text-charcoal-navy/60">
                    {new Date(latest.ts).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-charcoal-navy/60">
                No check-ins yet — log one on the left to begin.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {QUICK.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="rounded-2xl border border-mint-mist/70 bg-card-mint p-4 transition hover:border-deep-teal hover:shadow-sm"
              >
                <div className="text-2xl">{q.icon}</div>
                <p className="mt-2 font-display text-base font-semibold text-pine-shadow">
                  {q.title}
                </p>
                <p className="text-xs text-charcoal-navy/60">{q.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {entriesReady && latestInsight && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-pine-shadow">
            From your last reflection
          </h2>
          <InsightCard insight={latestInsight} />
        </section>
      )}

      <section className="rounded-2xl border border-mint-mist/60 bg-card-mint/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-charcoal-navy/70">
            {hasData
              ? `☁️ Synced to your account${user?.email ? ` (${user.email})` : ""}.`
              : "New here? Load a week of sample data to explore the demo."}
          </p>
          <div className="flex gap-2">
            <button
              onClick={loadSample}
              className="rounded-xl bg-deep-teal px-4 py-2 text-sm font-semibold text-paper-white transition hover:bg-forest-floor"
            >
              Load sample data
            </button>
            {hasData && (
              <button
                onClick={clearData}
                className="rounded-xl border border-mint-mist bg-paper-white px-4 py-2 text-sm text-charcoal-navy/60 transition hover:text-pine-shadow"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
