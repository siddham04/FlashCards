import { describe, it, expect } from 'vitest';

// Fisher-Yates shuffle implementation for testing
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

describe('shuffle function', () => {
  it('should return array of same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled).toHaveLength(arr.length);
  });

  it('should contain all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled.sort()).toEqual(arr.sort());
  });

  it('should not mutate original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffle(arr);
    expect(arr).toEqual(original);
  });

  it('should produce different orders (probabilistic)', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results: string[] = [];
    
    // Run shuffle 10 times
    for (let i = 0; i < 10; i++) {
      results.push(shuffle(arr).join(','));
    }
    
    // Check that at least some results are different
    const uniqueResults = new Set(results);
    // With 10 elements, probability of all being same is extremely low
    expect(uniqueResults.size).toBeGreaterThan(1);
  });

  it('should handle empty array', () => {
    const arr: number[] = [];
    const shuffled = shuffle(arr);
    expect(shuffled).toEqual([]);
  });

  it('should handle single element array', () => {
    const arr = [1];
    const shuffled = shuffle(arr);
    expect(shuffled).toEqual([1]);
  });

  it('should handle two element array', () => {
    const arr = [1, 2];
    const shuffled = shuffle(arr);
    expect(shuffled).toHaveLength(2);
    expect(shuffled).toContain(1);
    expect(shuffled).toContain(2);
  });
});

