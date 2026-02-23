export enum LevelStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  COMPLETED = 'COMPLETED',
}

export interface MathTrick {
  id: number;
  title: string;
  secretCode: string;
  explanation: string[];
  example: {
    question: string;
    answer: number;
    explanation: string;
  };
  scenario: string;
}

export interface UserProgress {
  name: string;
  completedLevels: number[];
  currentLevel: number;
  scores: Record<number, number>; // levelId -> score
  badges: string[]; // list of badge IDs or names
}
