import { areEquivalent } from './are-equivalent.ts';

describe('areEquivalent', () => {
  it('works with primitive values', () => {
    expect(areEquivalent(undefined, undefined)).toBe(true);
    expect(areEquivalent(undefined, 1)).toBe(false);
    expect(areEquivalent(null, null)).toBe(true);
    expect(areEquivalent(null, 1)).toBe(false);
    expect(areEquivalent(0, 0)).toBe(true);
    expect(areEquivalent(0, 1)).toBe(false);
    expect(areEquivalent(0n, 0n)).toBe(true);
    expect(areEquivalent(0n, 1n)).toBe(false);
    expect(areEquivalent('a', 'a')).toBe(true);
    expect(areEquivalent('a', 'b')).toBe(false);
    expect(areEquivalent(true, true)).toBe(true);
    expect(areEquivalent(true, false)).toBe(false);
    expect(areEquivalent({ a: 1, b: '2' }, { a: 1, b: '2' })).toBe(true);
    expect(areEquivalent({ a: 1, b: '2' }, { a: 1 })).toBe(false);
  });

  it('works with deep values', () => {
    expect(areEquivalent([0, [1], 2], [0, [1], 2])).toBe(true);
    expect(areEquivalent([0, [1], 2], [0, [0], 2])).toBe(false);
  });
});
