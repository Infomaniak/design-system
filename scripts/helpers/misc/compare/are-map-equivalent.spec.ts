import { areMapEquivalent } from './are-map-equivalent.ts';

describe('areMapEquivalent', () => {
  it('works with primitive values', () => {
    // identical
    expect(
      areMapEquivalent(
        new Map([
          [0, 'a'],
          [1, 'b'],
        ]),
        new Map([
          [0, 'a'],
          [1, 'b'],
        ]),
      ),
    ).toBe(true);

    // different order
    expect(
      areMapEquivalent(
        new Map([
          [0, 'a'],
          [1, 'b'],
        ]),
        new Map([
          [1, 'b'],
          [0, 'a'],
        ]),
      ),
    ).toBe(true);

    // different size
    expect(
      areMapEquivalent(
        new Map([
          [0, 'a'],
          [1, 'b'],
        ]),
        new Map([[0, 'a']]),
      ),
    ).toBe(false);

    // different key
    expect(
      areMapEquivalent(
        new Map([
          [0, 'a'],
          [1, 'b'],
        ]),
        new Map([
          [2, 'a'],
          [1, 'b'],
        ]),
      ),
    ).toBe(false);

    // different value
    expect(
      areMapEquivalent(
        new Map([
          [0, 'a'],
          [1, 'b'],
        ]),
        new Map([
          [0, 'c'],
          [1, 'b'],
        ]),
      ),
    ).toBe(false);
  });

  it('works with deep values', () => {
    // identical
    expect(
      areMapEquivalent(
        new Map([
          [[0], ['a']],
          [[1], ['b']],
        ]),
        new Map([
          [[0], ['a']],
          [[1], ['b']],
        ]),
      ),
    ).toBe(true);

    // different order
    expect(
      areMapEquivalent(
        new Map([
          [[0], ['a']],
          [[1], ['b']],
        ]),
        new Map([
          [[1], ['b']],
          [[0], ['a']],
        ]),
      ),
    ).toBe(true);

    // different key
    expect(
      areMapEquivalent(
        new Map([
          [[0], ['a']],
          [[1], ['b']],
        ]),
        new Map([
          [[2], ['b']],
          [[0], ['a']],
        ]),
      ),
    ).toBe(false);

    // different value
    expect(
      areMapEquivalent(
        new Map([
          [[0], ['a']],
          [[1], ['b']],
        ]),
        new Map([
          [[0], ['a']],
          [[1], ['c']],
        ]),
      ),
    ).toBe(false);
  });
});
