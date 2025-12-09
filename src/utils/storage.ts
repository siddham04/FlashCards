import { Stats, DeckId, QuizAttempt } from '../types';

const STATS_KEY = 'FLASHCARDS_STATS_V1';

export function loadStats(): Stats {
  const raw = localStorage.getItem(STATS_KEY);
  if (!raw) {
    // Default zeroed stats
    return {
      perDeck: {
        food: { studied: 0, correct: 0, incorrect: 0 },
        animals: { studied: 0, correct: 0, incorrect: 0 },
        verbs: { studied: 0, correct: 0, incorrect: 0 },
      },
      overall: { studied: 0, correct: 0, incorrect: 0 },
      quizHistory: []
    };
  }
  const stats = JSON.parse(raw) as Stats;
  // Ensure quizHistory exists for backward compatibility
  if (!stats.quizHistory) {
    stats.quizHistory = [];
  }
  return stats;
}

export function saveStats(stats: Stats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function updateStatsForAnswer(
  deckId: DeckId,
  isCorrect: boolean
): void {
  const stats = loadStats();
  
  // Update per-deck stats
  stats.perDeck[deckId].studied += 1;
  if (isCorrect) {
    stats.perDeck[deckId].correct += 1;
  } else {
    stats.perDeck[deckId].incorrect += 1;
  }
  
  // Update overall stats
  stats.overall.studied += 1;
  if (isCorrect) {
    stats.overall.correct += 1;
  } else {
    stats.overall.incorrect += 1;
  }
  
  saveStats(stats);
}

export function addQuizAttempt(attempt: QuizAttempt): void {
  const stats = loadStats();
  stats.quizHistory.unshift(attempt); // Add to beginning (most recent first)
  // Keep only last 50 attempts to prevent localStorage bloat
  if (stats.quizHistory.length > 50) {
    stats.quizHistory = stats.quizHistory.slice(0, 50);
  }
  saveStats(stats);
}

export function resetStats(): void {
  const defaultStats: Stats = {
    perDeck: {
      food: { studied: 0, correct: 0, incorrect: 0 },
      animals: { studied: 0, correct: 0, incorrect: 0 },
      verbs: { studied: 0, correct: 0, incorrect: 0 },
    },
    overall: { studied: 0, correct: 0, incorrect: 0 },
    quizHistory: []
  };
  saveStats(defaultStats);
}

