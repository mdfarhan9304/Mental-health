// Shared data model. Everything persists in the browser (localStorage);
// only text explicitly sent for analysis leaves the device.

export interface MoodLog {
  id: string;
  ts: number; // epoch ms
  mood: 1 | 2 | 3 | 4 | 5; // 1 = very low, 5 = great
  energy: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

export interface Insight {
  summary: string;
  triggers: string[];
  emotions: string[];
  copingStrategies: string[];
  encouragement: string;
  riskFlag: boolean;
}

export interface JournalEntry {
  id: string;
  ts: number;
  text: string;
  insight?: Insight;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
}

export interface ExerciseRec {
  id: string; // one of EXERCISES keys
  title: string;
  rationale: string;
}

// A small wellbeing task: suggested by the companion, checked off by the user.
export interface Task {
  id: string;
  ts: number; // created, epoch ms
  title: string;
  detail?: string;
  done: boolean;
  completed_at?: number; // epoch ms
  acknowledged: boolean; // has the companion celebrated it yet
  source: "companion" | "user";
}

// A task the companion proposes in chat, before the user adds it.
export interface TaskSuggestion {
  title: string;
  detail?: string;
}

export const MOOD_LABELS: Record<MoodLog["mood"], string> = {
  1: "Very low",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export const MOOD_EMOJI: Record<MoodLog["mood"], string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};
