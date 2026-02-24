import { areEquivalent } from './are-equivalent.ts';
import type { EqualFunction } from './equal-function.ts';

export function areSetEquivalent<GValue = any>(
  a: ReadonlySet<GValue>,
  b: ReadonlySet<GValue>,
  equal: EqualFunction<GValue> = areEquivalent,
): boolean {
  if (a.size === b.size) {
    const iteratorA: Iterator<GValue> = a.values();
    let resultA: IteratorResult<GValue>;
    main: while (!(resultA = iteratorA.next()).done) {
      if (!b.has(resultA.value)) {
        const iteratorB: Iterator<GValue> = b.values();
        let resultB: IteratorResult<GValue>;
        while (!(resultB = iteratorB.next()).done) {
          if (equal(resultA.value, resultB.value)) {
            continue main;
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
