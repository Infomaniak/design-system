import { describe, expect, it } from 'vitest';
import { areFloatEqual } from './are-float-equal.ts';

describe('areFloatEqual', () => {
  it('should be true if identical', () => {
    expect(areFloatEqual(0, 0)).toBe(true);
    expect(areFloatEqual(1, 1)).toBe(true);
  });

  it('should be false if different', () => {
    expect(areFloatEqual(0, 2)).toBe(false);
  });

  it('should be true if close', () => {
    expect(areFloatEqual(0, 1e-11)).toBe(true);
    expect(areFloatEqual(0, 1e-5, 1e-4)).toBe(true);
  });
});
