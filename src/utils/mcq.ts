import { Card } from '../types';

export function generateMCQOptions(deckCards: Card[], correct: Card, n = 4): string[] {
  const others = deckCards.filter(c => c.id !== correct.id);
  
  // Shuffle using Fisher-Yates
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  
  // Get unique English translations as distractors
  const distractors = Array.from(
    new Set(others.map(c => c.english))
  ).slice(0, Math.max(0, n - 1));
  
  const options = [...distractors, correct.english];
  
  // Final shuffle of all options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return options;
}

