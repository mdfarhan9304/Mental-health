import { NextRequest, NextResponse } from "next/server";
import { synthesize } from "@/lib/sarvam";
import { LIMITS, validateText, clampOptional } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, { limit: 60 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
      );
    }
    const { text, lang, speaker } = (await req.json()) as {
      text?: string;
      lang?: string;
      speaker?: string;
    };
    const checked = validateText(text, LIMITS.ttsText, "Text");
    if (!checked.ok) {
      return NextResponse.json({ error: checked.error }, { status: checked.status });
    }
    const { audio, languageCode } = await synthesize(
      checked.value,
      clampOptional(lang, 32),
      clampOptional(speaker, 64),
    );
    return NextResponse.json({ audio, languageCode });
  } catch (err) {
    console.error("voice/speak error:", err);
    return NextResponse.json(
      { error: "Could not generate speech right now." },
      { status: 500 },
    );
  }
}
