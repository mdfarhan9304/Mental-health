
"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MoodLog } from "@/lib/types";

export default function TrendChart({ moods }: { moods: MoodLog[] }) {
  const data = [...moods]
    .sort((a, b) => a.ts - b.ts)
    .map((m) => ({
      label: new Date(m.ts).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      Mood: m.mood,
      Energy: m.energy,
    }));

  if (data.length === 0) {
    return (
      <div className="grid h-64 place-items-center rounded-2xl border border-mint-mist/70 bg-card-mint text-sm text-charcoal-navy/60">
        No check-ins yet — log a few moods to see your trends.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-mint-mist/70 bg-card-mint p-4">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#a2cbcd55" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#283338" }}
              stroke="#a2cbcd"
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 11, fill: "#283338" }}
              stroke="#a2cbcd"
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #a2cbcd",
                background: "#f2f8f7",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="Mood"
              stroke="#1c5d5f"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Energy"
              stroke="#d6aec1"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-center gap-5 text-xs text-charcoal-navy/70">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-deep-teal" /> Mood
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-dusty-rose" /> Energy
        </span>
      </div>
    </div>
  );
}
