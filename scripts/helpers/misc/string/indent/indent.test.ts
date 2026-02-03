import { describe, expect, it } from 'vitest';
import { indent } from './indent.ts';

describe('indent', () => {
  it('should support empty first and last lines', () => {
    expect(indent('a\nb')).toBe('  a\n  b');
  });
});
