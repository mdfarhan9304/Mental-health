import { NextRequest, NextResponse } from "next/server";
import { transcribe } from "@/lib/sarvam";
import { LIMITS } from "@/lib/validation";
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
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No audio provided." }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Empty audio." }, { status: 400 });
    }
    if (file.size > LIMITS.audioBytes) {
      return NextResponse.json(
        { error: "Audio clip is too large." },
        { status: 413 },
      );
    }
    const { transcript, languageCode } = await transcribe(file);
    return NextResponse.json({ transcript, languageCode });
  } catch (err) {
    console.error("voice/transcribe error:", err);
    return NextResponse.json(
      { error: "Could not transcribe the audio right now." },
      { status: 500 },
    );
  }
}
