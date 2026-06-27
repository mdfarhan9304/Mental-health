import { HELPLINES } from "@/lib/safety";

export default function HelplineBanner({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="animate-fade-up rounded-2xl border border-dusty-rose bg-blush-sand p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl">💛</span>
        <div className="flex-1">
          <h3 className="font-display text-base font-semibold text-pine-shadow">
            You don&apos;t have to carry this alone
          </h3>
          <p className="mt-1 text-sm text-charcoal-navy/80">
            What you&apos;re feeling matters. If things feel like too much,
            please reach out right now — to someone you trust, or one of these
            free, confidential helplines.
          </p>

          <ul
            className={`mt-3 grid gap-2 ${
              compact ? "grid-cols-1" : "sm:grid-cols-2"
            }`}
          >
            {HELPLINES.map((h) => (
              <li
                key={h.name}
                className="rounded-xl border border-dusty-rose/60 bg-paper-white/70 p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-charcoal-navy">
                    {h.name}
                  </span>
                  {h.href ? (
                    <a
                      href={h.href}
                      className="font-mono text-sm font-semibold text-deep-teal hover:underline"
                    >
                      {h.contact}
                    </a>
                  ) : (
                    <span className="font-mono text-sm font-semibold text-deep-teal">
                      {h.contact}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-charcoal-navy/70">{h.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
