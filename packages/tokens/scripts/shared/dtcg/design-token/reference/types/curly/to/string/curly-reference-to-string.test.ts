import { describe, expect, test } from 'vitest';
import { curlyReferenceToString } from './curly-reference-to-string.ts';

describe('curlyReferenceToString', () => {
  test('should unwrap valid curly references', () => {
    expect(curlyReferenceToString('{token}')).toBe('token');
    expect(curlyReferenceToString('{color.red.500}')).toBe('color.red.500');
    expect(curlyReferenceToString('{spacing.8}')).toBe('spacing.8');
    expect(curlyReferenceToString('{font.family.inter}')).toBe('font.family.inter');
  });
});
