import { NextRequest, NextResponse } from "next/server";
import { getOpenAI, ANALYSIS_MODEL } from "@/lib/openai";
import { JOURNAL_ANALYST_SYSTEM } from "@/lib/prompts";
import { detectCrisis } from "@/lib/safety";
import { LIMITS, validateText } from "@/lib/validation";
import type { Insight } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INSIGHT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    triggers: { type: "array", items: { type: "string" } },
    emotions: { type: "array", items: { type: "string" } },
    copingStrategies: { type: "array", items: { type: "string" } },
    encouragement: { type: "string" },
    riskFlag: { type: "boolean" },
  },
  required: [
    "summary",
    "triggers",
    "emotions",
    "copingStrategies",
    "encouragement",
    "riskFlag",
  ],
} as const;

export async function POST(req: NextRequest) {
  try {
    const { text } = (await req.json()) as { text?: string };
    const checked = validateText(text, LIMITS.journalText, "Entry");
    if (!checked.ok) {
      return NextResponse.json({ error: checked.error }, { status: checked.status });
    }
    const entry = checked.value;

    const clientFlag = detectCrisis(entry);

    const completion = await getOpenAI().chat.completions.create({
      model: ANALYSIS_MODEL,
      temperature: 0.6,
      messages: [
        { role: "system", content: JOURNAL_ANALYST_SYSTEM },
        { role: "user", content: entry },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "insight", schema: INSIGHT_SCHEMA, strict: true },
      },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const insight = JSON.parse(raw) as Insight;
    // Trust the safety net: if either the model or the keyword check flags risk, flag it.
    insight.riskFlag = Boolean(insight.riskFlag) || clientFlag;

    return NextResponse.json({ insight });
  } catch (err) {
    console.error("journal/analyze error:", err);
    return NextResponse.json(
      { error: "Could not analyze the entry right now." },
      { status: 500 },
    );
  }
}
