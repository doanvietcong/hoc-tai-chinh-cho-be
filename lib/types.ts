// Domain types for Pé Ti finance-learning app

export type AgeGroup = "5-7" | "8-11" | "12-15";

export interface UserProfile {
  name: string;
  age: number; // 5..15
  ageGroup: AgeGroup;
  createdAt: number;
}

/** Result of a single question inside a lesson. */
export interface QuestionResult {
  questionId: string;
  correct: boolean;
  attempts: number;
  xpEarned: number;
  coinsEarned: number;
}

/** Persisted state for the user. */
export interface ProgressState {
  user: UserProfile | null;
  xp: number;
  coins: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  lastLessonDate: string | null; // ISO date YYYY-MM-DD
  completedLessons: string[]; // lesson ids
  lessonResults: Record<string, QuestionResult[]>;
  badges: string[]; // badge ids
  totalCorrect: number;
  totalAnswered: number;
  /** Sound effects on/off (default true). */
  soundEnabled: boolean;
}

// ---------- Lesson model ----------

/** A single question inside a lesson. */
export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | DragSortQuestion
  | InputNumberQuestion;

export interface BaseQuestion {
  id: string;
  prompt: string;
  helperText?: string;
  /** Optional mascot-style explanation shown after answering. */
  explainer?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: { id: string; label: string; emoji?: string }[];
  correctOptionId: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  statement: string;
  correct: boolean;
}

export interface DragSortQuestion extends BaseQuestion {
  type: "drag-sort";
  buckets: { id: string; label: string; emoji?: string }[];
  items: { id: string; label: string; emoji?: string; bucketId: string }[];
}

export interface InputNumberQuestion extends BaseQuestion {
  type: "input-number";
  /** Allowed integer answer. */
  correctNumber: number;
  unit?: string; // e.g. "đồng", "nghìn đồng"
  hint?: string;
}

export type QuestionType = Question["type"];

export interface Lesson {
  id: string; // e.g. "money-1"
  topicId: string; // e.g. "money"
  index: number; // 1..3 within topic
  title: string;
  subtitle: string;
  ageGroup: AgeGroup[];
  /** XP & coins awarded for perfect completion. */
  xpReward: number;
  coinReward: number;
  /** The actual question list. */
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  emoji: string;
  color: "green" | "blue" | "yellow" | "purple" | "orange" | "pink" | "red";
  description: string;
  lessons: Lesson[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  /** When to award. */
  condition: (s: ProgressState) => boolean;
}

// ---------- Story / Scene model (Pé Ti kể chuyện) ----------

/** What kind of visual props appear on the stage. */
export type SceneVisual =
  | {
      kind: "props";
      /** Set of props to render around the penguin. */
      items: SceneProp[];
    }
  | {
      kind: "split";
      left: SceneProp[];
      right: SceneProp[];
      leftLabel?: string;
      rightLabel?: string;
    }
  | {
      kind: "spotlight";
      /** Big centered prop, e.g. one giant coin or a chart. */
      prop: SceneProp;
    };

/** A single animated prop on the stage. */
export type SceneProp =
  | { type: "coin"; amount?: number; tone?: "gold" | "silver" }
  | { type: "jar"; label: string; tone: "save" | "spend" | "give" | "neutral"; fillPct: number }
  | { type: "piggy"; coins?: number; mood?: "neutral" | "happy" | "rich" }
  | { type: "bill"; value: number; tone?: "good" | "bad" }
  | { type: "chart-pie"; segments: { label: string; value: number; color: string }[] }
  | { type: "shield"; tone?: "safe" | "danger" }
  | { type: "tree"; size: number } // growing tree = compound interest
  | { type: "bank"; label?: string }
  | { type: "emoji"; emoji: string; size?: number }
  | { type: "sparkle" };

export type PenguinMoodForStory =
  | "idle"
  | "happy"
  | "sad"
  | "thinking"
  | "celebrate"
  | "wave";

/** A single beat in Pé Ti's narration. */
export interface Scene {
  /** Vietnamese text Pé Ti says during this scene. */
  text: string;
  /** What shows on stage. */
  visual: SceneVisual;
  /** Penguin mood while this scene plays. */
  mood: PenguinMoodForStory;
}

/** Full storyboard for a lesson intro. */
export interface Story {
  lessonId: string;
  title: string;
  /** Estimated seconds (rough — Web Speech API dictates real length). */
  estDurationSec: number;
  scenes: Scene[];
}
