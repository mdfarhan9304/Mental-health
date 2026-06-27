"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";

// Auth state hook. When Supabase isn't configured, `enabled` is false and the
// app stays in guest (local) mode.

export function useUser() {
  const sb = getSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sb) {
      setLoading(false);
      return;
    }
    sb.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  const signOut = async () => {
    await sb?.auth.signOut();
  };

  return { user, loading, signOut, enabled: !!sb };
}
