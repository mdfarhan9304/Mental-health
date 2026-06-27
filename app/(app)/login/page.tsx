"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase, supabaseEnabled } from "@/lib/supabase";
import { useUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const sb = getSupabase();
  const { user } = useUser();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("mode") === "signup") {
      setMode("signup");
    }
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!supabaseEnabled()) {
    return (
      <div className="mx-auto max-w-md py-10">
        <h1 className="font-display text-2xl font-semibold text-pine-shadow">
          Cloud sync isn&apos;t configured
        </h1>
        <p className="mt-2 text-sm text-charcoal-navy/75">
          This app stores your data in Supabase. Add{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
          <code className="font-mono">.env.local</code> and restart, then sign
          in. (See the README.)
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="mx-auto max-w-md py-10">
        <h1 className="font-display text-2xl font-semibold text-pine-shadow">
          You&apos;re signed in
        </h1>
        <p className="mt-2 text-sm text-charcoal-navy/75">
          Signed in as <span className="font-medium">{user.email}</span>. Your
          journal, moods, and chats now sync to your account.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-block rounded-full bg-deep-teal px-5 py-2.5 text-sm font-semibold text-paper-white hover:bg-forest-floor"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  const submit = async () => {
    if (!sb || !email.trim() || !password) return;
    if (mode === "signup") {
      if (password.length < 6) {
        setError("Use at least 6 characters for your password.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords don't match.");
        return;
      }
    }
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (data.session) {
          router.push("/dashboard");
          return;
        }
        // No session yet → try to sign in straight away (works once email
        // confirmation is off in Supabase Auth settings).
        const si = await sb.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (si.data.session) {
          router.push("/dashboard");
          return;
        }
        setMsg(
          "Account created. If you can't sign in yet, turn off “Confirm email” in your Supabase Auth settings, then log in.",
        );
      } else {
        const { error } = await sb.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-pine-shadow">
        {mode === "signin" ? "Welcome back" : "Create your space"}
      </h1>
      <p className="mt-1 text-sm text-charcoal-navy/70">
        {mode === "signin"
          ? "Sign in to sync your journal and moods across devices."
          : "An account keeps your reflections safe and in sync. Free."}
      </p>

      <div className="mt-6 space-y-3 rounded-2xl border border-mint-mist/70 bg-card-mint p-5">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-charcoal-navy/60">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-mint-mist bg-paper-white px-3 py-2 text-sm outline-none focus:border-deep-teal"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-charcoal-navy/60">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="mt-1 w-full rounded-xl border border-mint-mist bg-paper-white px-3 py-2 text-sm outline-none focus:border-deep-teal"
            placeholder="••••••••"
          />
        </label>

        {mode === "signup" && (
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-wider text-charcoal-navy/60">
              Confirm password
            </span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="mt-1 w-full rounded-xl border border-mint-mist bg-paper-white px-3 py-2 text-sm outline-none focus:border-deep-teal"
              placeholder="••••••••"
            />
          </label>
        )}

        {error && <p className="text-sm text-dusty-rose">{error}</p>}
        {msg && <p className="text-sm text-forest-floor">{msg}</p>}

        <button
          onClick={submit}
          disabled={
            busy ||
            !email.trim() ||
            !password ||
            (mode === "signup" && !confirm)
          }
          className="w-full rounded-xl bg-deep-teal py-2.5 text-sm font-semibold text-paper-white transition hover:bg-forest-floor disabled:opacity-50"
        >
          {busy
            ? "Please wait…"
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-charcoal-navy/70">
        {mode === "signin" ? "New here? " : "Already have an account? "}
        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setMsg(null);
          }}
          className="font-semibold text-deep-teal hover:underline"
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
