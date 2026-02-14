
export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  NUMBERS = 'NUMBERS',
  WORDS = 'WORDS',
  FLASHCARDS = 'FLASHCARDS',
  FACES = 'FACES',
  IMAGES = 'IMAGES',
  COACH = 'COACH'
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  completedSessions: number;
  performanceHistory: {
    date: string;
    score: number;
    module: ModuleType;
  }[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  lastReviewed?: number;
  interval: number; // For Spaced Repetition
  easeFactor: number;
  mastery: number;
}

export interface WordData {
  word: string;
  translation?: string;
  category: string;
  language: string;
}

export interface FaceData {
  id: string;
  name: string;
  imageUrl: string;
  occupation: string;
  feature: string;
}
