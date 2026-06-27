import { NextRequest, NextResponse } from "next/server";
import { getOpenAI, CHAT_MODEL } from "@/lib/openai";
import { TASK_SUGGEST_SYSTEM } from "@/lib/prompts";
import { langInstruction } from "@/lib/companions";
import { LIMITS, validateMessages } from "@/lib/validation";
import type { ChatMessage, TaskSuggestion } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SuggestBody {
  messages: Pick<ChatMessage, "role" | "content">[];
  lang?: string | null;
}

const TASKS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    tasks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
        },
        required: ["title", "detail"],
      },
    },
  },
  required: ["tasks"],
} as const;

export async function POST(req: NextRequest) {
  try {
    const { messages, lang } = (await req.json()) as SuggestBody;
    const validated = validateMessages(messages, {
      maxCount: LIMITS.chatMessages,
      maxLen: LIMITS.chatMessage,
    });
    // Suggestions are best-effort: a malformed/oversized payload just yields none.
    if (!validated.ok) {
      return NextResponse.json({ tasks: [] });
    }

    // Only the tail matters for suggesting next steps.
    const tail = validated.value.slice(-8);
    const transcript = tail
      .map((m) => `${m.role === "user" ? "Student" : "Companion"}: ${m.content}`)
      .join("\n");

    const completion = await getOpenAI().chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `${TASK_SUGGEST_SYSTEM}\n\nLanguage: ${langInstruction(lang)}`,
        },
        { role: "user", content: transcript },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "tasks", schema: TASKS_SCHEMA, strict: true },
      },
    });

    const raw = completion.choices[0]?.message?.content ?? '{"tasks":[]}';
    const parsed = JSON.parse(raw) as { tasks?: TaskSuggestion[] };
    const tasks = (parsed.tasks ?? [])
      .filter((t) => t && t.title && t.title.trim())
      .slice(0, 3)
      .map((t) => ({ title: t.title.trim(), detail: t.detail?.trim() || undefined }));

    return NextResponse.json({ tasks });
  } catch (err) {
    console.error("tasks/suggest error:", err);
    // Suggestions are best-effort; never block the chat on them.
    return NextResponse.json({ tasks: [] });
  }
}
