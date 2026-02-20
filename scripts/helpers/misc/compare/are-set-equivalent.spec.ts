import { areSetEquivalent } from './are-set-equivalent.ts';

describe('areSetEquivalent', () => {
  it('works with primitive values', () => {
    // identical
    expect(areSetEquivalent(new Set([0, 1, 2]), new Set([0, 1, 2]))).toBe(true);
    // different order
    expect(areSetEquivalent(new Set([0, 1, 2]), new Set([1, 2, 0]))).toBe(true);
    // different size
    expect(areSetEquivalent(new Set([0, 1, 2]), new Set([1, 2]))).toBe(false);
    // different value
    expect(areSetEquivalent(new Set([0, 1, 2]), new Set([1, 2, 3]))).toBe(false);
  });

  it('works with deep values', () => {
    expect(areSetEquivalent(new Set([0, [1], 2]), new Set([0, [1], 2]))).toBe(true);
    expect(areSetEquivalent(new Set([0, [1], 2]), new Set([0, [0], 2]))).toBe(false);
  });
});
