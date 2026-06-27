import { DISCLAIMER } from "@/lib/safety";

export default function Disclaimer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-mint-mist/60 bg-paper-white/90 backdrop-blur">
      <p className="mx-auto max-w-5xl px-4 py-2 text-center font-mono text-[11px] leading-snug tracking-wide text-charcoal-navy/60 sm:px-6">
        {DISCLAIMER}
      </p>
    </footer>
  );
}
