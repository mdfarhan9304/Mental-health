"use client";

import { useState } from "react";
import { useMoods } from "@/lib/store";
import { EXERCISE_LIST, EXERCISES } from "@/lib/exercises";
import type { Exercise } from "@/lib/exercises";
import type { ExerciseRec } from "@/lib/types";
import BreathingExercise from "@/components/BreathingExercise";

export default function ExercisesPage() {
  const { moods } = useMoods();
  const [selected, setSelected] = useState<Exercise>(EXERCISES["box-breathing"]);
  const [rec, setRec] = useState<ExerciseRec | null>(null);
  const [loading, setLoading] = useState(false);

  const recommend = async () => {
    setLoading(true);
    setRec(null);
    const latest = moods[0];
    try {
      const res = await fetch("/api/exercise/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: latest?.mood,
          energy: latest?.energy,
          note: latest?.note,
        }),
      });
      const data = (await res.json()) as { rec?: ExerciseRec };
      if (data.rec) {
        setRec(data.rec);
        setSelected(EXERCISES[data.rec.id] ?? EXERCISES["box-breathing"]);
      }
    } catch {
      /* keep current selection */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-pine-shadow">
          Reset & breathe
        </h1>
        <p className="mt-1 text-charcoal-navy/70">
          A two-minute pause can change a whole study session. Let the AI pick
          one for how you feel, or choose your own.
        </p>
      </header>

      <section className="rounded-2xl border border-mint-mist/70 bg-blush-sand p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-pine-shadow">
              Not sure what you need?
            </h2>
            <p className="text-sm text-charcoal-navy/70">
              I&apos;ll suggest one based on your latest check-in.
            </p>
          </div>
          <button
            onClick={recommend}
            disabled={loading}
            className="rounded-xl bg-deep-teal px-4 py-2 text-sm font-semibold text-paper-white transition hover:bg-forest-floor disabled:opacity-50"
          >
            {loading ? "Thinking…" : "Recommend for me"}
          </button>
        </div>
        {rec && (
          <p className="mt-3 rounded-xl bg-paper-white/70 p-3 text-sm text-charcoal-navy/90">
            <span className="font-semibold text-pine-shadow">{rec.title}</span> —{" "}
            {rec.rationale}
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        {EXERCISE_LIST.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelected(ex)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              selected.id === ex.id
                ? "border-deep-teal bg-deep-teal text-paper-white"
                : "border-mint-mist bg-paper-white text-charcoal-navy/70 hover:border-deep-teal"
            }`}
          >
            {ex.title}
          </button>
        ))}
      </div>

      <BreathingExercise exercise={selected} />
    </div>
  );
}
