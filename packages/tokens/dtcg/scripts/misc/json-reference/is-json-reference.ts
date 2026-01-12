import { isObject } from '../../../../../../scripts/helpers/misc/is-object.ts';
import type { JsonReference } from './json-reference.ts';

export function isJsonReference(input: unknown): input is JsonReference {
  return (
    isObject(input) && Reflect.has(input, '$ref') && typeof Reflect.get(input, '$ref') === 'string'
  );
}
