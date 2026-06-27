import { NextRequest, NextResponse } from "next/server";
import { getOpenAI, CHAT_MODEL } from "@/lib/openai";
import { EXERCISE_SYSTEM } from "@/lib/prompts";
import { EXERCISES } from "@/lib/exercises";
import { LIMITS, clampOptional } from "@/lib/validation";
import type { ExerciseRec } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REC_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    id: {
      type: "string",
      enum: ["box-breathing", "478-breathing", "grounding-54321"],
    },
    rationale: { type: "string" },
  },
  required: ["id", "rationale"],
} as const;

export async function POST(req: NextRequest) {
  try {
    const { mood, energy, note } = (await req.json()) as {
      mood?: number;
      energy?: number;
      note?: string;
    };

    const safeNote = clampOptional(note, LIMITS.note);
    const userContent = `Current state — mood: ${mood ?? "unknown"}/5, energy: ${energy ?? "unknown"}/5${safeNote ? `, note: "${safeNote}"` : ""}.`;

    const completion = await getOpenAI().chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.5,
      messages: [
        { role: "system", content: EXERCISE_SYSTEM },
        { role: "user", content: userContent },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "recommendation", schema: REC_SCHEMA, strict: true },
      },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as { id: string; rationale: string };
    const ex = EXERCISES[parsed.id] ?? EXERCISES["box-breathing"];

    const rec: ExerciseRec = {
      id: ex.id,
      title: ex.title,
      rationale: parsed.rationale,
    };
    return NextResponse.json({ rec });
  } catch (err) {
    console.error("exercise/recommend error:", err);
    return NextResponse.json(
      { error: "Could not recommend an exercise right now." },
      { status: 500 },
    );
  }
}
