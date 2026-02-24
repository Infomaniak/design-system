import { areObjectEquivalent } from './are-object-equivalent.ts';

describe('areObjectEquivalent', () => {
  it('works with primitive values', () => {
    // identical
    expect(areObjectEquivalent({ a: 1, b: '2' }, { a: 1, b: '2' })).toBe(true);
    // different order
    expect(areObjectEquivalent({ a: 1, b: '2' }, { b: '2', a: 1 })).toBe(true);
    // different size
    expect(areObjectEquivalent({ a: 1, b: '2' }, { a: 1 })).toBe(false);
    // different key
    expect(areObjectEquivalent({ a: 1, b: '2' }, { a: 1, c: '2' })).toBe(false);
    // different value
    expect(areObjectEquivalent({ a: 1, b: '2' }, { a: 1, b: '3' })).toBe(false);
  });

  it('works with deep values', () => {
    expect(areObjectEquivalent({ a: { a1: 1 }, b: ['2'] }, { a: { a1: 1 }, b: ['2'] })).toBe(true);
    expect(areObjectEquivalent({ a: { a1: 1 }, b: ['2'] }, { a: { a1: 1 }, b: ['3'] })).toBe(false);
  });
});
