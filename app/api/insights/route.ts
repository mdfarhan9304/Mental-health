import { NextRequest, NextResponse } from "next/server";
import { getOpenAI, ANALYSIS_MODEL } from "@/lib/openai";
import { INSIGHTS_SYSTEM } from "@/lib/prompts";
import { MOOD_LABELS } from "@/lib/types";
import type { JournalEntry, MoodLog } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  moods: MoodLog[];
  entries: Pick<JournalEntry, "ts" | "text">[];
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { moods = [], entries = [] } = (await req.json()) as Body;

    if (moods.length === 0 && entries.length === 0) {
      return NextResponse.json({
        summary:
          "Not enough data yet. Log a few moods and write a journal entry or two, and patterns will start to show up here.",
      });
    }

    const moodLines = moods
      .slice(0, 21)
      .map(
        (m) =>
          `${fmtDate(m.ts)}: mood ${m.mood}/5 (${MOOD_LABELS[m.mood]}), energy ${m.energy}/5${m.note ? ` — ${m.note.slice(0, 200)}` : ""}`,
      )
      .join("\n");

    const entryLines = entries
      .slice(0, 8)
      .map((e) => `${fmtDate(e.ts)}: ${e.text.slice(0, 300)}`)
      .join("\n");

    const userContent = `Mood/energy logs (most recent first):\n${moodLines || "(none)"}\n\nJournal snippets (most recent first):\n${entryLines || "(none)"}`;

    const completion = await getOpenAI().chat.completions.create({
      model: ANALYSIS_MODEL,
      temperature: 0.6,
      messages: [
        { role: "system", content: INSIGHTS_SYSTEM },
        { role: "user", content: userContent },
      ],
    });

    const summary =
      completion.choices[0]?.message?.content?.trim() ||
      "Couldn't generate patterns just now — try again in a moment.";

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("insights error:", err);
    return NextResponse.json(
      { error: "Could not generate insights right now." },
      { status: 500 },
    );
  }
}
