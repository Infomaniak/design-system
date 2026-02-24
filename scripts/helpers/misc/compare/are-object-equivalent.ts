import { areEquivalent } from './are-equivalent.ts';
import type { EqualFunction } from './equal-function.ts';

export function areObjectEquivalent(
  a: object,
  b: object,
  equal: EqualFunction<any> = areEquivalent,
): boolean {
  const keysA: (string | symbol)[] = Reflect.ownKeys(a);
  const keysB: (string | symbol)[] = Reflect.ownKeys(b);

  if (keysA.length === keysB.length) {
    for (let i = 0; i < keysA.length; i++) {
      const key: string | symbol = keysA[i];
      if (!Object.hasOwn(b, key) || !equal(Reflect.get(a, key), Reflect.get(b, key))) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
