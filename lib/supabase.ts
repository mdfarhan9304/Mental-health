"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser Supabase client (singleton). Returns null when env isn't configured,
// so the app degrades gracefully to guest/local mode. The anon key is safe to
// expose — Row-Level Security protects the data.

let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  cached = url && anon ? createClient(url, anon) : null;
  return cached;
}

export function supabaseEnabled(): boolean {
  return getSupabase() !== null;
}
