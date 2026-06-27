"use client";

import { useCallback, useEffect, useState } from "react";

// Per-device chat preferences: chosen language + companion character.
// Kept in localStorage so the onboarding picker only appears the first time.

const KEY = "mb_prefs_v1";

export interface Prefs {
  lang: string | null; // language code, e.g. "hi-IN"
  companionId: string | null; // Companion.id
}

const EMPTY: Prefs = { lang: null, companionId: null };

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt prefs */
    }
    setReady(true);
  }, []);

  const save = useCallback((next: Prefs) => {
    setPrefs(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
  }, []);

  const setLang = useCallback(
    (lang: string) => save({ ...prefsRef(), lang }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prefs, save],
  );
  const setCompanion = useCallback(
    (companionId: string) => save({ ...prefsRef(), companionId }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prefs, save],
  );

  // read latest prefs synchronously inside the setters above
  function prefsRef() {
    return prefs;
  }

  const chosen = !!prefs.lang && !!prefs.companionId;

  return { prefs, ready, chosen, setLang, setCompanion, save };
}
