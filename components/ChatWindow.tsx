"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat, useMoods, useTasks, uid } from "@/lib/store";
import { usePrefs } from "@/lib/prefs";
import { COMPANIONS, LANGUAGES, findCompanion } from "@/lib/companions";
import { detectCrisis } from "@/lib/safety";
import { speak, stopSpeaking } from "@/lib/speak";
import type { ChatMessage, TaskSuggestion } from "@/lib/types";
import HelplineBanner from "./HelplineBanner";
import MicButton from "./MicButton";

const STARTERS = [
  "I'm stressed about my next mock test.",
  "I keep comparing myself to everyone else.",
  "I can't focus and I feel guilty about it.",
];

export default function ChatWindow() {
  const { messages, ready, appendMessage, clearChat } = useChat();
  const { moods } = useMoods();
  const { tasks, addTask, updateTask } = useTasks();
  const { prefs, ready: prefsReady, chosen, setLang, setCompanion } = usePrefs();

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const [sending, setSending] = useState(false);
  const [crisis, setCrisis] = useState(false);
  // Voice on by default: the companion's reply is spoken aloud automatically.
  const [speakOn, setSpeakOn] = useState(true);
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const companion = useMemo(
    () => findCompanion(prefs.companionId),
    [prefs.companionId],
  );
  const lang = prefs.lang;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming, suggestions]);

  useEffect(() => () => stopSpeaking(), []);

  const send = async (raw?: string) => {
    const content = (raw ?? input).trim();
    if (!content || sending) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content,
      ts: Date.now(),
    };
    const payload = [...messages, userMsg];
    appendMessage(userMsg);
    setInput("");
    setSending(true);
    setStreaming("");
    setSuggestions([]);
    if (detectCrisis(content)) setCrisis(true);

    // Tasks the user has finished but the companion hasn't celebrated yet.
    const justDone = tasks.filter((t) => t.done && !t.acknowledged);
    const openTasks = tasks.filter((t) => !t.done).map((t) => t.title);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payload.map((m) => ({ role: m.role, content: m.content })),
          recentMood: moods[0] ?? null,
          lang,
          companionId: companion.id,
          completedTasks: justDone.map((t) => t.title),
          openTasks,
        }),
      });
      if (res.headers.get("X-Crisis") === "1") setCrisis(true);
      if (!res.ok || !res.body) throw new Error("chat failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setStreaming(acc);
      }

      const finalText = acc || "I'm here with you.";
      appendMessage({
        id: uid(),
        role: "assistant",
        content: finalText,
        ts: Date.now(),
      });
      if (speakOn) speak(finalText, lang, companion.speaker).catch(() => {});

      // The companion has now acknowledged the freshly-completed tasks.
      justDone.forEach((t) => updateTask(t.id, { acknowledged: true }));

      // Best-effort: ask for small follow-up tasks to offer as chips.
      fetchSuggestions([...payload, { ...userMsg, content: finalText, role: "assistant" }]);
    } catch {
      appendMessage({
        id: uid(),
        role: "assistant",
        content:
          "I'm having trouble responding right now — but I'm still here. Want to try again in a moment?",
        ts: Date.now(),
      });
    } finally {
      setSending(false);
      setStreaming("");
    }
  };

  const fetchSuggestions = async (
    convo: { role: "user" | "assistant"; content: string }[],
  ) => {
    try {
      const res = await fetch("/api/tasks/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: convo.map((m) => ({ role: m.role, content: m.content })),
          lang,
        }),
      });
      if (!res.ok) return;
      const { tasks: t } = (await res.json()) as { tasks: TaskSuggestion[] };
      setSuggestions(t ?? []);
    } catch {
      /* suggestions are optional */
    }
  };

  const onAddTask = (s: TaskSuggestion) => {
    addTask({ title: s.title, detail: s.detail, source: "companion" });
    setAdded((prev) => new Set(prev).add(s.title));
  };

  const onDictate = (text: string) => {
    if (!speakOn) setSpeakOn(true);
    send(text);
  };

  const toggleSpeak = () => {
    setSpeakOn((on) => {
      if (on) stopSpeaking();
      return !on;
    });
  };

  const previewVoice = async (speakerId: string, name: string) => {
    if (previewing) return;
    setPreviewing(true);
    try {
      await speak(`Hi, I'm ${name}. I'm right here with you.`, lang, speakerId);
    } catch {
      /* ignore */
    } finally {
      setPreviewing(false);
    }
  };

  // ── First-time onboarding: pick a language + a companion character ──
  if (prefsReady && !chosen) {
    return (
      <Onboarding
        lang={prefs.lang}
        companionId={prefs.companionId}
        onLang={setLang}
        onCompanion={setCompanion}
      />
    );
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col">
      {crisis && (
        <div className="mb-3">
          <HelplineBanner compact />
        </div>
      )}

      <div className="mb-2">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setShowSwitcher((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-mint-mist bg-paper-white px-2.5 py-1.5 text-sm text-charcoal-navy/70 transition hover:border-deep-teal"
            title="Change companion or language"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-card-mint text-base">
              {companion.emoji}
            </span>
            <span className="font-medium text-pine-shadow">{companion.name}</span>
            <span className="text-charcoal-navy/40">·</span>
            <span>{LANGUAGES.find((l) => l.code === lang)?.native}</span>
            <span className="ml-1 text-xs text-charcoal-navy/40">
              {showSwitcher ? "▲" : "▼ change"}
            </span>
          </button>
          <button
            onClick={toggleSpeak}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              speakOn
                ? "border-deep-teal bg-deep-teal text-paper-white"
                : "border-mint-mist bg-paper-white text-charcoal-navy/70 hover:border-deep-teal"
            }`}
            title={`Read replies aloud in ${companion.name}'s voice`}
          >
            {speakOn ? "🔊 Voice on" : "🔈 Voice off"}
          </button>
        </div>

        {showSwitcher && (
          <div className="mt-2 rounded-2xl border border-mint-mist/70 bg-card-mint/60 p-3">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-charcoal-navy/55">
              Companion &amp; voice
            </p>
            <div className="flex flex-wrap gap-2">
              {COMPANIONS.map((c) => (
                <div key={c.id} className="flex items-stretch">
                  <button
                    onClick={() => setCompanion(c.id)}
                    title={c.blurb}
                    className={`flex items-center gap-1.5 rounded-l-full border py-1.5 pl-3 pr-2 text-sm transition ${
                      companion.id === c.id
                        ? "border-deep-teal bg-deep-teal text-paper-white"
                        : "border-mint-mist bg-paper-white text-charcoal-navy/80 hover:border-deep-teal"
                    }`}
                  >
                    <span>{c.emoji}</span>
                    {c.name}
                  </button>
                  <button
                    onClick={() => previewVoice(c.speaker, c.name)}
                    disabled={previewing}
                    title={`Hear ${c.name}'s voice`}
                    className={`rounded-r-full border border-l-0 px-2 text-sm transition ${
                      companion.id === c.id
                        ? "border-deep-teal bg-deep-teal text-paper-white"
                        : "border-mint-mist bg-paper-white text-charcoal-navy/60 hover:border-deep-teal"
                    } disabled:opacity-50`}
                  >
                    ▶
                  </button>
                </div>
              ))}
            </div>

            <p className="mb-2 mt-3 font-mono text-[11px] uppercase tracking-wider text-charcoal-navy/55">
              Language
            </p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    lang === l.code
                      ? "border-deep-teal bg-deep-teal text-paper-white"
                      : "border-mint-mist bg-paper-white text-charcoal-navy/80 hover:border-deep-teal"
                  }`}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with your companion"
        className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-mint-mist/70 bg-card-mint/50 p-4"
      >
        {ready && messages.length === 0 && !sending && (
          <div className="grid h-full place-items-center text-center">
            <div className="max-w-sm">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-deep-teal text-2xl text-paper-white">
                {companion.emoji}
              </div>
              <p className="font-display text-lg text-pine-shadow">
                Hi, I&apos;m {companion.name}. I&apos;m here whenever you need to
                talk.
              </p>
              <p className="mt-1 text-sm text-charcoal-navy/70">
                Type, or tap the mic and just speak.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-mint-mist bg-paper-white px-3 py-2 text-left text-sm text-charcoal-navy/80 transition hover:border-deep-teal"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <Bubble
            key={m.id}
            role={m.role}
            content={m.content}
            lang={lang}
            speaker={companion.speaker}
          />
        ))}
        {sending && <Bubble role="assistant" content={streaming} typing />}

        {!sending && suggestions.length > 0 && (
          <div className="rounded-2xl border border-dashed border-deep-teal/40 bg-paper-white/70 p-3">
            <p className="mb-2 text-xs font-medium text-charcoal-navy/60">
              🌱 Small steps you could add to your tasks:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => {
                const done = added.has(s.title);
                return (
                  <button
                    key={s.title}
                    onClick={() => !done && onAddTask(s)}
                    disabled={done}
                    title={s.detail}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      done
                        ? "border-deep-teal bg-deep-teal/10 text-deep-teal"
                        : "border-mint-mist bg-paper-white text-charcoal-navy/80 hover:border-deep-teal"
                    }`}
                  >
                    {done ? "✓ Added" : "+ "} {s.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <MicButton idleLabel="Talk" onResult={onDictate} />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder="Type how you're feeling…"
          className="max-h-32 flex-1 resize-none rounded-xl border border-mint-mist bg-paper-white px-3 py-2.5 text-sm outline-none placeholder:text-charcoal-navy/40 focus:border-deep-teal"
        />
        <button
          onClick={() => send()}
          disabled={sending || !input.trim()}
          className="rounded-xl bg-deep-teal px-4 py-2.5 text-sm font-semibold text-paper-white transition hover:bg-forest-floor disabled:opacity-50"
        >
          Send
        </button>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            title="Clear conversation"
            className="rounded-xl border border-mint-mist bg-paper-white px-3 py-2.5 text-sm text-charcoal-navy/60 transition hover:text-pine-shadow"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function Onboarding({
  lang,
  companionId,
  onLang,
  onCompanion,
}: {
  lang: string | null;
  companionId: string | null;
  onLang: (l: string) => void;
  onCompanion: (c: string) => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-13rem)] flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-mint-mist/70 bg-paper-white/80 p-6">
        <div className="text-center">
          <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-deep-teal text-2xl text-paper-white">
            🌿
          </div>
          <h2 className="font-display text-xl font-semibold text-pine-shadow">
            Let&apos;s set up your companion
          </h2>
          <p className="mt-1 text-sm text-charcoal-navy/70">
            Choose how you&apos;d like to talk before we begin.
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-pine-shadow">Language</p>
          <div className="flex gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => onLang(l.code)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
                  lang === l.code
                    ? "border-deep-teal bg-deep-teal text-paper-white"
                    : "border-mint-mist bg-paper-white text-charcoal-navy/80 hover:border-deep-teal"
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-pine-shadow">
            Choose your companion
          </p>
          <div className="grid grid-cols-2 gap-2">
            {COMPANIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => onCompanion(c.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  companionId === c.id
                    ? "border-deep-teal bg-card-mint"
                    : "border-mint-mist bg-paper-white hover:border-deep-teal"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{c.emoji}</span>
                  <span className="font-medium text-pine-shadow">{c.name}</span>
                </div>
                <p className="mt-1 text-xs leading-snug text-charcoal-navy/65">
                  {c.blurb}
                </p>
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-charcoal-navy/45">
            Each companion has their own real voice (Sarvam AI).
          </p>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  role,
  content,
  typing,
  lang,
  speaker,
}: {
  role: "user" | "assistant";
  content: string;
  typing?: boolean;
  lang?: string | null;
  speaker?: string | null;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`group max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-deep-teal text-paper-white"
            : "border border-mint-mist bg-paper-white text-charcoal-navy"
        }`}
      >
        {content}
        {typing && (!content || content.length === 0) && (
          <span className="inline-flex gap-1">
            <Dot /> <Dot /> <Dot />
          </span>
        )}
        {!isUser && !typing && content && (
          <button
            onClick={() => speak(content, lang, speaker).catch(() => {})}
            title="Read aloud"
            className="ml-2 align-middle text-charcoal-navy/40 opacity-0 transition hover:text-deep-teal group-hover:opacity-100"
          >
            🔊
          </button>
        )}
      </div>
    </div>
  );
}

function Dot() {
  return (
    <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-charcoal-navy/40" />
  );
}
