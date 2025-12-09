import { describe, it, expect } from 'vitest';
import { normalizeForCompare } from '../normalize';

describe('normalizeForCompare', () => {
  it('should handle empty string', () => {
    expect(normalizeForCompare('')).toBe('');
    expect(normalizeForCompare('   ')).toBe('');
  });

  it('should trim whitespace', () => {
    expect(normalizeForCompare('  apple  ')).toBe('apple');
    expect(normalizeForCompare('\t\napple\t\n')).toBe('apple');
  });

  it('should convert to lowercase', () => {
    expect(normalizeForCompare('APPLE')).toBe('apple');
    expect(normalizeForCompare('Apple')).toBe('apple');
    expect(normalizeForCompare('ApPlE')).toBe('apple');
  });

  it('should remove diacritics', () => {
    expect(normalizeForCompare('árbol')).toBe('arbol');
    expect(normalizeForCompare('niño')).toBe('nino');
    expect(normalizeForCompare('café')).toBe('cafe');
    expect(normalizeForCompare('manzana')).toBe('manzana'); // no diacritics
  });

  it('should collapse multiple spaces', () => {
    expect(normalizeForCompare('apple   pie')).toBe('apple pie');
    expect(normalizeForCompare('apple\t\tpie')).toBe('apple pie');
    expect(normalizeForCompare('apple\n\npie')).toBe('apple pie');
  });

  it('should handle combined normalization', () => {
    expect(normalizeForCompare('  ÁRBOL  ')).toBe('arbol');
    expect(normalizeForCompare('  árbol  ')).toBe('arbol');
    expect(normalizeForCompare('árbol')).toBe('arbol');
  });

  it('should handle null/undefined gracefully', () => {
    expect(normalizeForCompare(null as any)).toBe('');
    expect(normalizeForCompare(undefined as any)).toBe('');
  });
});

