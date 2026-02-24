import { areArrayEquivalent } from './are-array-equivalent.ts';
import { areMapEquivalent } from './are-map-equivalent.ts';
import { areObjectEquivalent } from './are-object-equivalent.ts';
import { areSetEquivalent } from './are-set-equivalent.ts';

/**
 * @see https://github.com/jashkenas/underscore/blob/master/modules/isEqual.js
 */
export function areEquivalent<GValue = any>(a: GValue, b: GValue): boolean {
  if (a === b || (Number.isNaN(a) && Number.isNaN(b))) {
    return true;
  } else {
    if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
      if (Array.isArray(a)) {
        if (Array.isArray(b)) {
          return areArrayEquivalent(a, b);
        } else {
          return false;
        }
      } else if (a instanceof Set) {
        if (b instanceof Set) {
          return areSetEquivalent(a, b);
        } else {
          return false;
        }
      } else if (a instanceof Map) {
        if (b instanceof Map) {
          return areMapEquivalent(a, b);
        } else {
          return false;
        }
      } else {
        return areObjectEquivalent(a as unknown as object, b as unknown as object);
      }
    } else {
      return false;
    }
  }
}
