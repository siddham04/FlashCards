import { describe, it, expect } from 'vitest';
import { generateMCQOptions } from '../mcq';
import { Card } from '../../types';

describe('generateMCQOptions', () => {
  const createCard = (id: string, english: string): Card => ({
    id,
    deckId: 'food',
    hindi: 'टेस्ट',
    english,
  });

  it('should generate 4 options by default', () => {
    const cards = [
      createCard('1', 'apple'),
      createCard('2', 'banana'),
      createCard('3', 'cherry'),
      createCard('4', 'date'),
    ];
    const correct = cards[0];
    const options = generateMCQOptions(cards, correct);
    expect(options).toHaveLength(4);
  });

  it('should include the correct answer', () => {
    const cards = [
      createCard('1', 'apple'),
      createCard('2', 'banana'),
      createCard('3', 'cherry'),
      createCard('4', 'date'),
    ];
    const correct = cards[0];
    const options = generateMCQOptions(cards, correct);
    expect(options).toContain('apple');
  });

  it('should not include duplicate correct answers', () => {
    const cards = [
      createCard('1', 'apple'),
      createCard('2', 'banana'),
      createCard('3', 'cherry'),
      createCard('4', 'date'),
    ];
    const correct = cards[0];
    const options = generateMCQOptions(cards, correct);
    const appleCount = options.filter(opt => opt === 'apple').length;
    expect(appleCount).toBe(1);
  });

  it('should handle decks with fewer than 4 cards', () => {
    const cards = [
      createCard('1', 'apple'),
      createCard('2', 'banana'),
    ];
    const correct = cards[0];
    const options = generateMCQOptions(cards, correct, 4);
    // Should have at least 2 options (correct + 1 distractor)
    expect(options.length).toBeGreaterThanOrEqual(2);
    expect(options).toContain('apple');
  });

  it('should handle decks with exactly 4 cards', () => {
    const cards = [
      createCard('1', 'apple'),
      createCard('2', 'banana'),
      createCard('3', 'cherry'),
      createCard('4', 'date'),
    ];
    const correct = cards[0];
    const options = generateMCQOptions(cards, correct);
    expect(options).toHaveLength(4);
    expect(options).toContain('apple');
  });

  it('should remove duplicate distractors', () => {
    const cards = [
      createCard('1', 'apple'),
      createCard('2', 'banana'),
      createCard('3', 'banana'), // duplicate
      createCard('4', 'banana'), // duplicate
    ];
    const correct = cards[0];
    const options = generateMCQOptions(cards, correct);
    const bananaCount = options.filter(opt => opt === 'banana').length;
    expect(bananaCount).toBeLessThanOrEqual(1); // Only one banana (as distractor)
  });

  it('should shuffle options', () => {
    const cards = [
      createCard('1', 'apple'),
      createCard('2', 'banana'),
      createCard('3', 'cherry'),
      createCard('4', 'date'),
    ];
    const correct = cards[0];
    
    // Run multiple times to check shuffling
    const results: string[][] = [];
    for (let i = 0; i < 10; i++) {
      results.push(generateMCQOptions(cards, correct));
    }
    
    // At least one should be different (very high probability)
    const firstResult = results[0].join(',');
    const allSame = results.every(r => r.join(',') === firstResult);
    // With shuffling, it's extremely unlikely all 10 are identical
    expect(allSame).toBe(false);
  });

  it('should handle custom number of options', () => {
    const cards = [
      createCard('1', 'apple'),
      createCard('2', 'banana'),
      createCard('3', 'cherry'),
      createCard('4', 'date'),
      createCard('5', 'elderberry'),
    ];
    const correct = cards[0];
    const options = generateMCQOptions(cards, correct, 6);
    expect(options.length).toBeLessThanOrEqual(6);
    expect(options).toContain('apple');
  });
});

