import { describe, it, expect, beforeEach } from 'vitest';
import { loadStats, saveStats, updateStatsForAnswer, resetStats, addQuizAttempt } from '../storage';
import { Stats } from '../../types';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadStats', () => {
    it('should return default stats when localStorage is empty', () => {
      const stats = loadStats();
      expect(stats.overall.studied).toBe(0);
      expect(stats.overall.correct).toBe(0);
      expect(stats.overall.incorrect).toBe(0);
      expect(stats.perDeck.food.studied).toBe(0);
      expect(stats.perDeck.animals.studied).toBe(0);
      expect(stats.perDeck.verbs.studied).toBe(0);
    });

    it('should load saved stats from localStorage', () => {
      const testStats: Stats = {
        perDeck: {
          food: { studied: 5, correct: 3, incorrect: 2 },
          animals: { studied: 3, correct: 2, incorrect: 1 },
          verbs: { studied: 0, correct: 0, incorrect: 0 },
        },
        overall: { studied: 8, correct: 5, incorrect: 3 },
        quizHistory: []
      };
      saveStats(testStats);
      const loaded = loadStats();
      expect(loaded).toEqual(testStats);
    });
  });

  describe('saveStats', () => {
    it('should save stats to localStorage', () => {
      const testStats: Stats = {
        perDeck: {
          food: { studied: 10, correct: 7, incorrect: 3 },
          animals: { studied: 0, correct: 0, incorrect: 0 },
          verbs: { studied: 0, correct: 0, incorrect: 0 },
        },
        overall: { studied: 10, correct: 7, incorrect: 3 },
        quizHistory: []
      };
      saveStats(testStats);
      const saved = localStorage.getItem('FLASHCARDS_STATS_V1');
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed).toEqual(testStats);
    });
  });

  describe('updateStatsForAnswer', () => {
    it('should update stats for correct answer', () => {
      updateStatsForAnswer('food', true);
      const stats = loadStats();
      expect(stats.perDeck.food.studied).toBe(1);
      expect(stats.perDeck.food.correct).toBe(1);
      expect(stats.perDeck.food.incorrect).toBe(0);
      expect(stats.overall.studied).toBe(1);
      expect(stats.overall.correct).toBe(1);
      expect(stats.overall.incorrect).toBe(0);
    });

    it('should update stats for incorrect answer', () => {
      updateStatsForAnswer('animals', false);
      const stats = loadStats();
      expect(stats.perDeck.animals.studied).toBe(1);
      expect(stats.perDeck.animals.correct).toBe(0);
      expect(stats.perDeck.animals.incorrect).toBe(1);
      expect(stats.overall.studied).toBe(1);
      expect(stats.overall.correct).toBe(0);
      expect(stats.overall.incorrect).toBe(1);
    });

    it('should accumulate multiple answers', () => {
      updateStatsForAnswer('food', true);
      updateStatsForAnswer('food', false);
      updateStatsForAnswer('food', true);
      const stats = loadStats();
      expect(stats.perDeck.food.studied).toBe(3);
      expect(stats.perDeck.food.correct).toBe(2);
      expect(stats.perDeck.food.incorrect).toBe(1);
      expect(stats.overall.studied).toBe(3);
      expect(stats.overall.correct).toBe(2);
      expect(stats.overall.incorrect).toBe(1);
    });

    it('should update different decks independently', () => {
      updateStatsForAnswer('food', true);
      updateStatsForAnswer('animals', false);
      updateStatsForAnswer('verbs', true);
      const stats = loadStats();
      expect(stats.perDeck.food.studied).toBe(1);
      expect(stats.perDeck.animals.studied).toBe(1);
      expect(stats.perDeck.verbs.studied).toBe(1);
      expect(stats.overall.studied).toBe(3);
    });
  });

  describe('addQuizAttempt', () => {
    it('should add quiz attempt to history', () => {
      const attempt = {
        id: 'test-1',
        deckId: 'food' as const,
        mode: 'multiple-choice' as const,
        dateISO: new Date().toISOString(),
        correct: 8,
        total: 10,
        percentage: 80
      };
      addQuizAttempt(attempt);
      const stats = loadStats();
      expect(stats.quizHistory).toHaveLength(1);
      expect(stats.quizHistory[0]).toEqual(attempt);
    });

    it('should add attempts in reverse chronological order', () => {
      const attempt1 = {
        id: 'test-1',
        deckId: 'food' as const,
        mode: 'multiple-choice' as const,
        dateISO: new Date().toISOString(),
        correct: 8,
        total: 10,
        percentage: 80
      };
      const attempt2 = {
        id: 'test-2',
        deckId: 'animals' as const,
        mode: 'fill-in-blank' as const,
        dateISO: new Date().toISOString(),
        correct: 7,
        total: 10,
        percentage: 70
      };
      addQuizAttempt(attempt1);
      addQuizAttempt(attempt2);
      const stats = loadStats();
      expect(stats.quizHistory).toHaveLength(2);
      expect(stats.quizHistory[0]).toEqual(attempt2); // Most recent first
      expect(stats.quizHistory[1]).toEqual(attempt1);
    });

    it('should limit history to 50 attempts', () => {
      for (let i = 0; i < 55; i++) {
        addQuizAttempt({
          id: `test-${i}`,
          deckId: 'food' as const,
          mode: 'multiple-choice' as const,
          dateISO: new Date().toISOString(),
          correct: 5,
          total: 10,
          percentage: 50
        });
      }
      const stats = loadStats();
      expect(stats.quizHistory.length).toBeLessThanOrEqual(50);
    });
  });

  describe('resetStats', () => {
    it('should reset all stats to zero', () => {
      // Add some stats first
      updateStatsForAnswer('food', true);
      updateStatsForAnswer('animals', false);
      addQuizAttempt({
        id: 'test-1',
        deckId: 'food' as const,
        mode: 'multiple-choice' as const,
        dateISO: new Date().toISOString(),
        correct: 8,
        total: 10,
        percentage: 80
      });
      
      resetStats();
      const stats = loadStats();
      expect(stats.overall.studied).toBe(0);
      expect(stats.overall.correct).toBe(0);
      expect(stats.overall.incorrect).toBe(0);
      expect(stats.perDeck.food.studied).toBe(0);
      expect(stats.perDeck.animals.studied).toBe(0);
      expect(stats.perDeck.verbs.studied).toBe(0);
      expect(stats.quizHistory).toHaveLength(0);
    });
  });
});

