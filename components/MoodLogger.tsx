"use client";

import { useState } from "react";
import { useMoods } from "@/lib/store";
import { MOOD_EMOJI, MOOD_LABELS } from "@/lib/types";
import type { MoodLog } from "@/lib/types";

const SCALE: MoodLog["mood"][] = [1, 2, 3, 4, 5];

export default function MoodLogger({ onLogged }: { onLogged?: () => void }) {
  const { addMood } = useMoods();
  const [mood, setMood] = useState<MoodLog["mood"]>(3);
  const [energy, setEnergy] = useState<MoodLog["energy"]>(3);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    addMood({ mood, energy, note: note.trim() || undefined });
    setSaved(true);
    setNote("");
    onLogged?.();
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="rounded-2xl border border-mint-mist/70 bg-card-mint p-5">
      <h2 className="font-display text-lg font-semibold text-pine-shadow">
        How are you right now?
      </h2>

      <div className="mt-4">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-charcoal-navy/60">
          Mood
        </p>
        <div className="flex gap-2">
          {SCALE.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              aria-label={MOOD_LABELS[m]}
              aria-pressed={mood === m}
              className={`flex-1 rounded-xl border py-2 text-2xl transition ${
                mood === m
                  ? "border-deep-teal bg-paper-white shadow-sm"
                  : "border-transparent bg-paper-white/50 hover:bg-paper-white"
              }`}
            >
              {MOOD_EMOJI[m]}
            </button>
          ))}
        </div>
        <p className="mt-1 text-center text-xs text-charcoal-navy/60">
          {MOOD_LABELS[mood]}
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-charcoal-navy/60">
          Energy — {energy}/5
        </p>
        <input
          type="range"
          min={1}
          max={5}
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value) as MoodLog["energy"])}
          aria-label="Energy level, 1 to 5"
          aria-valuetext={`${energy} of 5`}
          className="w-full accent-deep-teal"
        />
      </div>

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Anything on your mind? (optional)"
        aria-label="Optional note about your check-in"
        className="mt-4 w-full rounded-xl border border-mint-mist bg-paper-white px-3 py-2 text-sm outline-none placeholder:text-charcoal-navy/40 focus:border-deep-teal"
      />

      <button
        type="button"
        onClick={save}
        className="mt-4 w-full rounded-xl bg-deep-teal py-2.5 text-sm font-semibold text-paper-white transition hover:bg-forest-floor"
      >
        {saved ? "Saved ✓" : "Log check-in"}
      </button>
    </div>
  );
}
