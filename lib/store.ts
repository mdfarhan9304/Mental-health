"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase } from "./supabase";
import type { ChatMessage, JournalEntry, MoodLog, Task } from "./types";

// Cloud-only storage. Every record lives in Supabase, scoped to the signed-in
// user and protected by Row-Level Security. The app requires authentication
// (see AuthGate), so these hooks always run with a user present.

const TABLES = {
  moods: "moods",
  entries: "journal_entries",
  chat: "chat_messages",
  tasks: "tasks",
} as const;

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

type Row = { id: string; ts: number };

function useCollection<T extends Row>(
  which: keyof typeof TABLES,
  order: "asc" | "desc" = "desc",
) {
  const table = TABLES[which];
  const sb = getSupabase();

  const [items, setItems] = useState<T[]>([]);
  const [ready, setReady] = useState(false);
  const itemsRef = useRef<T[]>([]);
  const userIdRef = useRef<string | null>(null);

  const sortFn = useCallback(
    (a: T, b: T) => (order === "desc" ? b.ts - a.ts : a.ts - b.ts),
    [order],
  );

  const setBoth = useCallback((next: T[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const load = useCallback(async () => {
    if (!sb || !userIdRef.current) {
      setBoth([]);
      setReady(true);
      return;
    }
    const { data, error } = await sb
      .from(table)
      .select("*")
      .eq("user_id", userIdRef.current)
      .order("ts", { ascending: order === "asc" });
    if (error) console.error(`load ${table} error:`, error.message);
    const rows = ((data ?? []) as Record<string, unknown>[]).map(
      (r) => ({ ...r, ts: Number(r.ts) }) as unknown as T,
    );
    setBoth(rows);
    setReady(true);
  }, [sb, table, order, setBoth]);

  useEffect(() => {
    if (!sb) {
      setReady(true);
      return;
    }
    let unsub: (() => void) | undefined;
    (async () => {
      const {
        data: { user },
      } = await sb.auth.getUser();
      userIdRef.current = user?.id ?? null;
      const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
        userIdRef.current = session?.user?.id ?? null;
        load();
      });
      unsub = () => sub.subscription.unsubscribe();
      await load();
    })();
    return () => unsub?.();
  }, [sb, load]);

  const add = useCallback(
    async (item: T) => {
      if (!sb || !userIdRef.current) return;
      setBoth([...itemsRef.current, item].sort(sortFn));
      const { error } = await sb
        .from(table)
        .insert({ ...item, user_id: userIdRef.current });
      if (error) console.error(`insert ${table} error:`, error.message);
    },
    [sb, table, sortFn, setBoth],
  );

  const replaceAll = useCallback(
    async (next: T[]) => {
      if (!sb || !userIdRef.current) return;
      const uidv = userIdRef.current;
      const sorted = [...next].sort(sortFn);
      setBoth(sorted);
      const del = await sb.from(table).delete().eq("user_id", uidv);
      if (del.error) console.error(`delete ${table} error:`, del.error.message);
      if (sorted.length) {
        const ins = await sb
          .from(table)
          .insert(sorted.map((r) => ({ ...r, user_id: uidv })));
        if (ins.error) console.error(`insert ${table} error:`, ins.error.message);
      }
    },
    [sb, table, sortFn, setBoth],
  );

  const update = useCallback(
    async (id: string, patch: Partial<T>) => {
      if (!sb || !userIdRef.current) return;
      const next = itemsRef.current
        .map((it) => (it.id === id ? { ...it, ...patch } : it))
        .sort(sortFn);
      setBoth(next);
      const { error } = await sb
        .from(table)
        .update(patch as Record<string, unknown>)
        .eq("id", id)
        .eq("user_id", userIdRef.current);
      if (error) console.error(`update ${table} error:`, error.message);
    },
    [sb, table, sortFn, setBoth],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!sb || !userIdRef.current) return;
      setBoth(itemsRef.current.filter((it) => it.id !== id));
      const { error } = await sb
        .from(table)
        .delete()
        .eq("id", id)
        .eq("user_id", userIdRef.current);
      if (error) console.error(`delete ${table} error:`, error.message);
    },
    [sb, table, setBoth],
  );

  const clear = useCallback(() => replaceAll([]), [replaceAll]);

  return { items, ready, add, update, remove, replaceAll, clear };
}

export function useMoods() {
  const c = useCollection<MoodLog>("moods", "desc");
  const addMood = useCallback(
    (m: Omit<MoodLog, "id" | "ts"> & { ts?: number }) =>
      c.add({ id: uid(), ts: m.ts ?? Date.now(), ...m } as MoodLog),
    [c],
  );
  return {
    moods: c.items,
    ready: c.ready,
    addMood,
    setMoods: c.replaceAll,
    clearMoods: c.clear,
  };
}

export function useEntries() {
  const c = useCollection<JournalEntry>("entries", "desc");
  return {
    entries: c.items,
    ready: c.ready,
    addEntry: c.add,
    setEntries: c.replaceAll,
    clearEntries: c.clear,
  };
}

export function useChat() {
  const c = useCollection<ChatMessage>("chat", "asc");
  return {
    messages: c.items,
    ready: c.ready,
    appendMessage: c.add,
    setMessages: c.replaceAll,
    clearChat: c.clear,
  };
}

export function useTasks() {
  const c = useCollection<Task>("tasks", "desc");
  const addTask = useCallback(
    (t: Pick<Task, "title"> & Partial<Task>) =>
      c.add({
        id: uid(),
        ts: Date.now(),
        done: false,
        acknowledged: false,
        source: "companion",
        ...t,
      } as Task),
    [c],
  );
  const completeTask = useCallback(
    (id: string) =>
      c.update(id, {
        done: true,
        completed_at: Date.now(),
        acknowledged: false,
      } as Partial<Task>),
    [c],
  );
  const reopenTask = useCallback(
    (id: string) =>
      c.update(id, { done: false, completed_at: null } as unknown as Partial<Task>),
    [c],
  );
  return {
    tasks: c.items,
    ready: c.ready,
    addTask,
    completeTask,
    reopenTask,
    updateTask: c.update,
    removeTask: c.remove,
    clearTasks: c.clear,
  };
}
