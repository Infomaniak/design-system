import { areEquivalent } from './are-equivalent.ts';
import type { EqualFunction } from './equal-function.ts';

export function areMapEquivalent<GKey = any, GValue = any>(
  a: ReadonlyMap<GKey, GValue>,
  b: ReadonlyMap<GKey, GValue>,
  equal: EqualFunction<GKey | GValue> = areEquivalent,
): boolean {
  if (a.size === b.size) {
    const iteratorA: Iterator<[GKey, GValue]> = a.entries();
    let resultA: IteratorResult<[GKey, GValue]>;
    main: while (!(resultA = iteratorA.next()).done) {
      const [keyA, valueA] = resultA.value;

      if (b.has(keyA)) {
        if (!equal(valueA, b.get(keyA)!)) {
          return false;
        }
      } else {
        const iteratorB: Iterator<[GKey, GValue]> = b.entries();
        let resultB: IteratorResult<[GKey, GValue]>;
        while (!(resultB = iteratorB.next()).done) {
          const [keyB, valueB] = resultB.value;
          if (equal(keyA, keyB)) {
            // key found
            if (equal(valueA, valueB)) {
              continue main;
            } else {
              return false;
            }
          }
        }
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
