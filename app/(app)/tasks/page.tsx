"use client";

import TaskList from "@/components/TaskList";

export default function TasksPage() {
  return (
    <div className="space-y-4">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-pine-shadow">
          Your tasks
        </h1>
        <p className="mt-1 text-charcoal-navy/70">
          Small, kind steps for your wellbeing. Check one off and your companion
          will notice next time you talk.
        </p>
      </header>
      <TaskList />
    </div>
  );
}
