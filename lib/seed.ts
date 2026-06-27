"use client";

import type { JournalEntry, MoodLog } from "./types";
import { uid } from "./store";

// A week of believable sample data so the dashboard, trends, and insights
// look alive instantly during a demo.

const DAY = 24 * 60 * 60 * 1000;

export function makeSeed(): { moods: MoodLog[]; entries: JournalEntry[] } {
  const now = Date.now();
  const day = (n: number, h: number) => now - n * DAY + h * 60 * 60 * 1000 - now % DAY;

  const moods: MoodLog[] = [
    { id: uid(), ts: day(6, 21), mood: 3, energy: 3, note: "Started revision" },
    { id: uid(), ts: day(5, 22), mood: 2, energy: 2, note: "Mock test tomorrow" },
    { id: uid(), ts: day(4, 20), mood: 2, energy: 2, note: "Mock went badly" },
    { id: uid(), ts: day(3, 21), mood: 1, energy: 2, note: "Saw rank list" },
    { id: uid(), ts: day(2, 19), mood: 3, energy: 3, note: "Talked to a friend" },
    { id: uid(), ts: day(1, 20), mood: 4, energy: 4, note: "Good study day" },
    { id: uid(), ts: day(0, 18), mood: 3, energy: 3, note: "Steady" },
  ].sort((a, b) => b.ts - a.ts) as MoodLog[];

  const entries: JournalEntry[] = [
    {
      id: uid(),
      ts: day(4, 20),
      text: "My mock test score dropped again and everyone in my batch seems to be doing better than me. I stayed up till 3am cramming but it didn't even help. I keep thinking I'm going to let my parents down after everything they've spent on coaching.",
      insight: {
        summary:
          "You're carrying a lot right now — a tough mock result on top of comparison and the weight of your family's hopes. That's genuinely heavy.",
        triggers: [
          "Mock test score dropping",
          "Comparing yourself to batchmates",
          "All-nighters before tests",
          "Fear of disappointing parents",
        ],
        emotions: ["anxiety", "self-doubt", "guilt"],
        copingStrategies: [
          "Swap one all-nighter for a fixed 11pm wind-down — sleep makes recall better, not worse.",
          "Review one mistake from the mock instead of the whole score; pick one thing to fix.",
          "Mute the rank chatter for a day; one comparison is one too many right now.",
        ],
        encouragement:
          "One low mock is a data point, not a verdict on you. You're still in this.",
        riskFlag: false,
      },
    },
    {
      id: uid(),
      ts: day(1, 20),
      text: "Tried studying in 50-minute blocks today with small breaks and it actually felt manageable. Still nervous about the next test but a bit more in control.",
      insight: {
        summary:
          "A calmer day — you found a rhythm that worked and noticed it. That self-awareness matters.",
        triggers: ["Anticipating the next test"],
        emotions: ["hope", "mild anxiety", "relief"],
        copingStrategies: [
          "Keep the 50/10 block rhythm — it's clearly suiting you.",
          "Jot one line each night on what went well; it builds evidence against the self-doubt.",
        ],
        encouragement:
          "You just proved you can find control even mid-prep. That's a real skill.",
        riskFlag: false,
      },
    },
  ].sort((a, b) => b.ts - a.ts);

  return { moods, entries };
}
