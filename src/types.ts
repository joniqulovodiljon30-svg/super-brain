
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

// Supabase database types
export interface SupabaseUserStats {
  user_id: string;
  current_level: number;
  xp: number;
  streak_days: number;
  personal_best_streak: number;
  total_sessions: number;
  accuracy_average: number;
  total_correct_all_time: number;
  total_questions_all_time: number;
  last_active_date: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityLog {
  id?: number;
  user_id: string;
  activity_date: string;
  score: number;
  sessions_count: number;
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
