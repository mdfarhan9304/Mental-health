"use client";

import { useEffect, useRef, useState } from "react";
import type { Exercise } from "@/lib/exercises";

export default function BreathingExercise({
  exercise,
}: {
  exercise: Exercise;
}) {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [remaining, setRemaining] = useState(exercise.phases[0].seconds);
  const [done, setDone] = useState(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset whenever the exercise changes.
  useEffect(() => {
    stop();
    setPhaseIdx(0);
    setCycle(0);
    setRemaining(exercise.phases[0].seconds);
    setDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  function stop() {
    if (tick.current) clearInterval(tick.current);
    tick.current = null;
    setRunning(false);
  }

  function start() {
    if (running) return;
    setDone(false);
    setRunning(true);
    tick.current = setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        // advance phase / cycle
        setPhaseIdx((pi) => {
          const nextPi = pi + 1;
          if (nextPi < exercise.phases.length) {
            setRemaining(exercise.phases[nextPi].seconds);
            return nextPi;
          }
          // phase wrapped — advance cycle
          setCycle((c) => {
            const nextC = c + 1;
            if (nextC >= exercise.cycles) {
              // finished
              if (tick.current) clearInterval(tick.current);
              tick.current = null;
              setRunning(false);
              setDone(true);
              return c;
            }
            setRemaining(exercise.phases[0].seconds);
            return nextC;
          });
          return 0;
        });
        return 1;
      });
    }, 1000);
  }

  useEffect(() => () => stop(), []);

  const phase = exercise.phases[phaseIdx];
  const scale = running ? phase.scale : 0.72;

  return (
    <div className="rounded-2xl border border-mint-mist/70 bg-card-mint p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl font-semibold text-pine-shadow">
          {exercise.title}
        </h2>
        <span className="font-mono text-xs uppercase tracking-wider text-deep-teal">
          {exercise.tagline}
        </span>
      </div>
      <p className="mt-1 text-sm text-charcoal-navy/70">{exercise.description}</p>

      <div className="relative mx-auto mt-6 grid h-60 w-60 place-items-center">
        <div
          className="absolute h-60 w-60 rounded-full bg-sage/25 transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${scale})` }}
        />
        <div
          className="absolute h-44 w-44 rounded-full bg-sage/35 transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${scale})` }}
        />
        <div
          className="grid h-32 w-32 place-items-center rounded-full bg-deep-teal text-paper-white transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="text-center">
            <div className="font-display text-2xl tabular-nums">{remaining}</div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center font-display text-lg text-pine-shadow">
        {done
          ? "Well done. Notice how you feel now. 🌿"
          : running
            ? phase.label
            : "Find a comfortable position when you're ready."}
      </p>
      {exercise.cycles > 1 && (
        <p className="mt-1 text-center font-mono text-xs text-charcoal-navy/55">
          Round {Math.min(cycle + 1, exercise.cycles)} of {exercise.cycles}
        </p>
      )}

      <div className="mt-5 flex justify-center gap-3">
        {!running ? (
          <button
            onClick={start}
            className="rounded-xl bg-deep-teal px-6 py-2.5 text-sm font-semibold text-paper-white transition hover:bg-forest-floor"
          >
            {done ? "Go again" : "Begin"}
          </button>
        ) : (
          <button
            onClick={stop}
            className="rounded-xl border border-mint-mist bg-paper-white px-6 py-2.5 text-sm font-semibold text-charcoal-navy/70 transition hover:text-pine-shadow"
          >
            Pause
          </button>
        )}
      </div>
    </div>
  );
}
