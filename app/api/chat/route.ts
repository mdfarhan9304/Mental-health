import { NextRequest } from "next/server";
import { getOpenAI, CHAT_MODEL } from "@/lib/openai";
import { buildCompanionSystem } from "@/lib/prompts";
import { detectCrisis } from "@/lib/safety";
import { LIMITS, validateMessages, clampOptional } from "@/lib/validation";
import type { ChatMessage, MoodLog } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatBody {
  messages: Pick<ChatMessage, "role" | "content">[];
  recentMood?: MoodLog | null;
  lang?: string | null;
  companionId?: string | null;
  completedTasks?: string[];
  openTasks?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { messages, recentMood, lang, companionId, completedTasks, openTasks } =
      (await req.json()) as ChatBody;

    const validated = validateMessages(messages, {
      maxCount: LIMITS.chatMessages,
      maxLen: LIMITS.chatMessage,
    });
    if (!validated.ok) {
      return new Response(validated.error, { status: validated.status });
    }
    const turns = validated.value;

    const lastUser = [...turns].reverse().find((m) => m.role === "user");
    const crisis = lastUser ? detectCrisis(lastUser.content) : false;

    const system = buildCompanionSystem({
      companionId: clampOptional(companionId, 64) ?? null,
      lang: clampOptional(lang, 32) ?? null,
      recentMood,
      completedTasks,
      openTasks,
      crisis,
    });

    const stream = await getOpenAI().chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.8,
      stream: true,
      messages: [{ role: "system", content: system }, ...turns],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch (e) {
          console.error("chat stream error:", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Crisis": crisis ? "1" : "0",
      },
    });
  } catch (err) {
    console.error("chat error:", err);
    return new Response("Could not reach the companion right now.", {
      status: 500,
    });
  }
}
