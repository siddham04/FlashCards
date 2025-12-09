// deckId: 'food' | 'animals' | 'verbs'
export type DeckId = 'food' | 'animals' | 'verbs';

export interface Card {
  id: string;                // uuid or stable string key
  deckId: DeckId;
  hindi: string;             // one word only (e.g., "सेब")
  english: string;           // one word only (e.g., "apple")
  // optional future fields:
  // example?: string;
}

export interface Deck {
  id: DeckId;
  title: string;
  description?: string;
  cards: Card[];
}

export interface QuizAttempt {
  id: string;
  deckId: DeckId;
  mode: 'multiple-choice' | 'fill-in-blank';
  dateISO: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface Stats {
  perDeck: Record<DeckId, {
    studied: number;
    correct: number;
    incorrect: number;
    lastSession?: {
      dateISO: string;
      studied: number;
      correct: number;
      incorrect: number;
    }
  }>;
  overall: {
    studied: number;
    correct: number;
    incorrect: number;
  };
  quizHistory: QuizAttempt[];
}

