"use client";

import { useState } from "react";
import { useTasks } from "@/lib/store";
import type { Task } from "@/lib/types";

export default function TaskList() {
  const { tasks, ready, addTask, completeTask, reopenTask, removeTask } =
    useTasks();
  const [draft, setDraft] = useState("");

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  const addOwn = () => {
    const title = draft.trim();
    if (!title) return;
    addTask({ title, source: "user" });
    setDraft("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addOwn()}
          placeholder="Add a small step for yourself…"
          className="flex-1 rounded-xl border border-mint-mist bg-paper-white px-3 py-2.5 text-sm outline-none placeholder:text-charcoal-navy/40 focus:border-deep-teal"
        />
        <button
          onClick={addOwn}
          disabled={!draft.trim()}
          className="rounded-xl bg-deep-teal px-4 py-2.5 text-sm font-semibold text-paper-white transition hover:bg-forest-floor disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {ready && tasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-mint-mist bg-card-mint/40 p-8 text-center">
          <div className="mb-2 text-3xl">🌱</div>
          <p className="text-sm text-charcoal-navy/70">
            No tasks yet. Chat with your companion — it&apos;ll suggest small,
            kind steps you can add here.
          </p>
        </div>
      )}

      {open.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-pine-shadow">
            To do ({open.length})
          </h2>
          <ul className="space-y-2">
            {open.map((t) => (
              <Row
                key={t.id}
                task={t}
                onToggle={() => completeTask(t.id)}
                onRemove={() => removeTask(t.id)}
              />
            ))}
          </ul>
        </section>
      )}

      {done.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-charcoal-navy/55">
            Completed ({done.length}) — proud of you 🌿
          </h2>
          <ul className="space-y-2">
            {done.map((t) => (
              <Row
                key={t.id}
                task={t}
                onToggle={() => reopenTask(t.id)}
                onRemove={() => removeTask(t.id)}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Row({
  task,
  onToggle,
  onRemove,
}: {
  task: Task;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <li className="group flex items-start gap-3 rounded-xl border border-mint-mist bg-paper-white px-3 py-2.5">
      <button
        onClick={onToggle}
        aria-label={task.done ? "Mark as not done" : "Mark as done"}
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] transition ${
          task.done
            ? "border-deep-teal bg-deep-teal text-paper-white"
            : "border-charcoal-navy/30 text-transparent hover:border-deep-teal"
        }`}
      >
        ✓
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm ${
            task.done
              ? "text-charcoal-navy/45 line-through"
              : "text-charcoal-navy"
          }`}
        >
          {task.title}
        </p>
        {task.detail && (
          <p className="mt-0.5 text-xs text-charcoal-navy/55">{task.detail}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        title="Remove"
        className="text-charcoal-navy/30 opacity-0 transition hover:text-rose-500 group-hover:opacity-100"
      >
        ✕
      </button>
    </li>
  );
}
