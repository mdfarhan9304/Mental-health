"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/auth";

// Requires authentication for all app pages. The /login route is always allowed
// through. When Supabase isn't configured, shows a clear setup message.

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, enabled } = useUser();

  // Login page is always reachable.
  if (pathname === "/login") return <>{children}</>;

  if (!enabled) {
    return (
      <Centered>
        <h1 className="font-display text-2xl font-semibold text-pine-shadow">
          Cloud sync isn&apos;t configured yet
        </h1>
        <p className="mt-2 text-sm text-charcoal-navy/75">
          This app stores your data in Supabase. Add{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
          <code className="font-mono">.env.local</code> and restart, then sign
          in.
        </p>
      </Centered>
    );
  }

  if (loading) {
    return (
      <Centered>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mint-mist border-t-deep-teal" />
        <p className="mt-3 text-sm text-charcoal-navy/60">Loading…</p>
      </Centered>
    );
  }

  if (!user) {
    return (
      <Centered>
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-deep-teal text-2xl text-paper-white">
          🌿
        </div>
        <h1 className="font-display text-2xl font-semibold text-pine-shadow">
          Sign in to continue
        </h1>
        <p className="mt-2 max-w-sm text-sm text-charcoal-navy/75">
          Your journal, moods, and chats are saved securely to your account.
          Log in or create one to begin.
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            href="/login"
            className="rounded-full bg-deep-teal px-5 py-2.5 text-sm font-semibold text-paper-white transition hover:bg-forest-floor"
          >
            Log in
          </Link>
          <Link
            href="/login?mode=signup"
            className="rounded-full border border-pine-shadow px-5 py-2.5 text-sm font-semibold text-pine-shadow transition hover:bg-card-mint"
          >
            Create account
          </Link>
        </div>
      </Centered>
    );
  }

  return <>{children}</>;
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
}
