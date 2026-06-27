import type { Insight } from "@/lib/types";
import HelplineBanner from "./HelplineBanner";

function Chips({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "trigger" | "emotion";
}) {
  if (!items?.length) return null;
  const cls =
    tone === "trigger"
      ? "border-dusty-rose/70 bg-blush-sand text-charcoal-navy"
      : "border-mint-mist bg-sea-foam/60 text-pine-shadow";
  return (
    <div>
      <p className="mb-1.5 font-mono text-xs uppercase tracking-wider text-charcoal-navy/55">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((t, i) => (
          <span
            key={i}
            className={`rounded-full border px-2.5 py-1 text-xs ${cls}`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className="animate-fade-up space-y-4">
      {insight.riskFlag && <HelplineBanner />}

      <div className="rounded-2xl border border-mint-mist/70 bg-card-mint p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-deep-teal">
          What I&apos;m noticing
        </p>
        <p className="mt-2 font-display text-lg leading-snug text-pine-shadow">
          {insight.summary}
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Chips label="Hidden triggers" items={insight.triggers} tone="trigger" />
          <Chips label="Emotions" items={insight.emotions} tone="emotion" />
        </div>

        {insight.copingStrategies?.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 font-mono text-xs uppercase tracking-wider text-charcoal-navy/55">
              Things that might help
            </p>
            <ul className="space-y-1.5">
              {insight.copingStrategies.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-charcoal-navy/90">
                  <span className="text-sage">›</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {insight.encouragement && (
          <p className="mt-4 rounded-xl bg-paper-white/70 p-3 font-display text-sm italic text-forest-floor">
            {insight.encouragement}
          </p>
        )}
      </div>
    </div>
  );
}
