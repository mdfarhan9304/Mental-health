"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/auth";

const LINKS = [
  { href: "/dashboard", label: "Home" },
  { href: "/journal", label: "Journal" },
  { href: "/companion", label: "Companion" },
  { href: "/tasks", label: "Tasks" },
  { href: "/trends", label: "Trends" },
  { href: "/exercises", label: "Exercises" },
];

export default function AppNav() {
  const pathname = usePathname();
  const { user, signOut } = useUser();

  return (
    <header className="sticky top-0 z-40 border-b border-mint-mist/60 bg-paper-white/85 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link href="/" className="flex items-center gap-2" aria-label="MindBalance home">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-deep-teal text-paper-white">
            <span className="text-base" aria-hidden="true">🌿</span>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-pine-shadow">
            MindBalance
          </span>
        </Link>

        <ul className="flex items-center gap-1 text-sm">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3 py-1.5 transition-colors ${
                    active
                      ? "bg-deep-teal text-paper-white"
                      : "text-charcoal-navy/70 hover:bg-card-mint hover:text-pine-shadow"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden max-w-[10rem] truncate text-xs text-charcoal-navy/55 sm:inline">
              {user.email}
            </span>
            <button
              onClick={signOut}
              className="rounded-full border border-mint-mist bg-paper-white px-3 py-1.5 text-sm text-charcoal-navy/70 transition hover:border-deep-teal hover:text-pine-shadow"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full border border-pine-shadow px-3 py-1.5 text-sm font-medium text-pine-shadow transition hover:bg-card-mint"
            >
              Log in
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-full bg-deep-teal px-3 py-1.5 text-sm font-medium text-paper-white transition hover:bg-forest-floor"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
