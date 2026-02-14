
import { UserStats, Flashcard } from "../types";

const STORAGE_KEY_STATS = "mm_user_stats";
const STORAGE_KEY_FLASHCARDS = "mm_flashcards";
const STORAGE_KEY_THEME = "mm_theme";

export const storageService = {
  getUserStats(): UserStats {
    const data = localStorage.getItem(STORAGE_KEY_STATS);
    return data ? JSON.parse(data) : {
      xp: 0,
      level: 1,
      streak: 0,
      completedSessions: 0,
      performanceHistory: []
    };
  },

  saveUserStats(stats: UserStats) {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  },

  getFlashcards(): Flashcard[] {
    const data = localStorage.getItem(STORAGE_KEY_FLASHCARDS);
    return data ? JSON.parse(data) : [];
  },

  saveFlashcards(cards: Flashcard[]) {
    localStorage.setItem(STORAGE_KEY_FLASHCARDS, JSON.stringify(cards));
  },

  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(STORAGE_KEY_THEME) as 'light' | 'dark') || 'light';
  },

  saveTheme(theme: 'light' | 'dark') {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }
};
