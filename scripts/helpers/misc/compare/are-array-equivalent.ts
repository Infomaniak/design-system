import { areEquivalent } from './are-equivalent.ts';
import type { EqualFunction } from './equal-function.ts';

export function areArrayEquivalent<GValue>(
  a: ArrayLike<GValue>,
  b: ArrayLike<GValue>,
  equal: EqualFunction<GValue> = areEquivalent,
): boolean {
  if (a.length === b.length) {
    for (let i = 0; i < a.length; i++) {
      if (!equal(a[i], b[i])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
