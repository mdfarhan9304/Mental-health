// Exercise definitions shared by the recommend API and the player UI.
// Each phase drives the animated breathing/grounding guide.

export interface Phase {
  label: string;
  seconds: number;
  scale: number; // target circle scale for this phase
}

export interface Exercise {
  id: "box-breathing" | "478-breathing" | "grounding-54321";
  title: string;
  tagline: string;
  description: string;
  phases: Phase[];
  cycles: number;
}

export const EXERCISES: Record<string, Exercise> = {
  "box-breathing": {
    id: "box-breathing",
    title: "Box Breathing",
    tagline: "4 · 4 · 4 · 4",
    description:
      "Equal counts of inhale, hold, exhale, hold. Steadies a racing mind before study or a test.",
    phases: [
      { label: "Breathe in", seconds: 4, scale: 1 },
      { label: "Hold", seconds: 4, scale: 1 },
      { label: "Breathe out", seconds: 4, scale: 0.72 },
      { label: "Hold", seconds: 4, scale: 0.72 },
    ],
    cycles: 4,
  },
  "478-breathing": {
    id: "478-breathing",
    title: "4-7-8 Breathing",
    tagline: "4 · 7 · 8",
    description:
      "A longer exhale calms the nervous system. Good for winding down and sleep trouble.",
    phases: [
      { label: "Breathe in", seconds: 4, scale: 1 },
      { label: "Hold", seconds: 7, scale: 1 },
      { label: "Breathe out", seconds: 8, scale: 0.72 },
    ],
    cycles: 4,
  },
  "grounding-54321": {
    id: "grounding-54321",
    title: "5-4-3-2-1 Grounding",
    tagline: "Senses reset",
    description:
      "Name what you can sense to pull yourself out of a spiral and back into the room.",
    phases: [
      { label: "Notice 5 things you can SEE", seconds: 15, scale: 1 },
      { label: "Notice 4 things you can FEEL", seconds: 12, scale: 0.92 },
      { label: "Notice 3 things you can HEAR", seconds: 10, scale: 0.84 },
      { label: "Notice 2 things you can SMELL", seconds: 8, scale: 0.78 },
      { label: "Notice 1 thing you can TASTE", seconds: 6, scale: 0.72 },
    ],
    cycles: 1,
  },
};

export const EXERCISE_LIST = Object.values(EXERCISES);
