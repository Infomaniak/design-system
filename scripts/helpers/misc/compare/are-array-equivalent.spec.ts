import { areArrayEquivalent } from './are-array-equivalent.ts';

describe('areArrayEquivalent', () => {
  it('works with primitive values', () => {
    expect(areArrayEquivalent([0, 1, 2], [0, 1, 2])).toBe(true);
    expect(areArrayEquivalent([0, 1, 2], [1, 2])).toBe(false);
    expect(areArrayEquivalent([0, 1, 2], [1, 2, 0])).toBe(false);
  });

  it('works with deep values', () => {
    expect(areArrayEquivalent([0, [1], 2], [0, [1], 2])).toBe(true);
    expect(areArrayEquivalent([0, [1], 2], [0, [0], 2])).toBe(false);
  });
});
