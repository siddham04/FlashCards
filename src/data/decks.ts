import { Deck } from '../types';

export const decks: Record<string, Deck> = {
  food: {
    id: 'food',
    title: 'Food',
    description: 'Learn Hindi food vocabulary',
    cards: [
      { id: 'f1', deckId: 'food', hindi: 'सेब', english: 'apple' },
      { id: 'f2', deckId: 'food', hindi: 'रोटी', english: 'bread' },
      { id: 'f3', deckId: 'food', hindi: 'पनीर', english: 'cheese' },
      { id: 'f4', deckId: 'food', hindi: 'अंडा', english: 'egg' },
      { id: 'f5', deckId: 'food', hindi: 'मछली', english: 'fish' },
      { id: 'f6', deckId: 'food', hindi: 'फल', english: 'fruit' },
      { id: 'f7', deckId: 'food', hindi: 'मांस', english: 'meat' },
      { id: 'f8', deckId: 'food', hindi: 'दूध', english: 'milk' },
      { id: 'f9', deckId: 'food', hindi: 'संतरा', english: 'orange' },
      { id: 'f10', deckId: 'food', hindi: 'चावल', english: 'rice' },
    ],
  },
  animals: {
    id: 'animals',
    title: 'Animals',
    description: 'Learn Hindi animal names',
    cards: [
      { id: 'a1', deckId: 'animals', hindi: 'बिल्ली', english: 'cat' },
      { id: 'a2', deckId: 'animals', hindi: 'कुत्ता', english: 'dog' },
      { id: 'a3', deckId: 'animals', hindi: 'घोड़ा', english: 'horse' },
      { id: 'a4', deckId: 'animals', hindi: 'पक्षी', english: 'bird' },
      { id: 'a5', deckId: 'animals', hindi: 'मछली', english: 'fish' },
      { id: 'a6', deckId: 'animals', hindi: 'गाय', english: 'cow' },
      { id: 'a7', deckId: 'animals', hindi: 'सुअर', english: 'pig' },
      { id: 'a8', deckId: 'animals', hindi: 'भेड़', english: 'sheep' },
      { id: 'a9', deckId: 'animals', hindi: 'खरगोश', english: 'rabbit' },
      { id: 'a10', deckId: 'animals', hindi: 'चूहा', english: 'mouse' },
    ],
  },
  verbs: {
    id: 'verbs',
    title: 'Verbs',
    description: 'Learn Hindi verbs',
    cards: [
      { id: 'v1', deckId: 'verbs', hindi: 'खाना', english: 'eat' },
      { id: 'v2', deckId: 'verbs', hindi: 'पीना', english: 'drink' },
      { id: 'v3', deckId: 'verbs', hindi: 'सोना', english: 'sleep' },
      { id: 'v4', deckId: 'verbs', hindi: 'दौड़ना', english: 'run' },
      { id: 'v5', deckId: 'verbs', hindi: 'चलना', english: 'walk' },
      { id: 'v6', deckId: 'verbs', hindi: 'बोलना', english: 'speak' },
      { id: 'v7', deckId: 'verbs', hindi: 'सुनना', english: 'listen' },
      { id: 'v8', deckId: 'verbs', hindi: 'पढ़ना', english: 'read' },
      { id: 'v9', deckId: 'verbs', hindi: 'लिखना', english: 'write' },
      { id: 'v10', deckId: 'verbs', hindi: 'सीखना', english: 'learn' },
    ],
  },
};

