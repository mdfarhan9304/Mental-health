"use client";

import ChatWindow from "@/components/ChatWindow";

export default function CompanionPage() {
  return (
    <div className="space-y-4">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-pine-shadow">
          Your companion
        </h1>
        <p className="mt-1 text-charcoal-navy/70">
          An always-available, judgment-free ear — with small, doable nudges
          when you want them.
        </p>
      </header>
      <ChatWindow />
    </div>
  );
}
