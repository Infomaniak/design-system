import { isCurlyReference } from '../is-curly-reference.ts';
import type { UpdateCurlyReference } from './update-curly-reference.ts';

export function updateCurlyReferencesRecursively<GValue>(
  value: GValue,
  update: UpdateCurlyReference,
): GValue {
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      let changed: boolean = false;

      const newValue: unknown[] = value.map((subValue: unknown): unknown => {
        const newSubValue: unknown = updateCurlyReferencesRecursively(subValue, update);
        if (newSubValue !== subValue) {
          changed = true;
        }
        return newSubValue;
      });

      return changed ? (newValue as GValue) : value;
    } else if (value?.constructor === Object /* is play object */) {
      let changed: boolean = false;

      const newValue: unknown = Object.fromEntries(
        Object.entries(value).map(([key, subValue]: [string, unknown]): [string, unknown] => {
          const newSubValue: unknown = updateCurlyReferencesRecursively(subValue, update);
          if (newSubValue !== subValue) {
            changed = true;
          }
          return [key, newSubValue];
        }),
      );

      return changed ? (newValue as GValue) : value;
    } else {
      return value;
    }
  } else if (isCurlyReference(value)) {
    return update(value) as GValue;
  } else {
    return value;
  }
}
