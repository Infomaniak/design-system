import { isObject } from '../is-object.ts';
import type { JsonReference } from './json-reference.js';

export function isJsonReference(input: unknown): input is JsonReference {
  return (
    isObject(input) && Reflect.has(input, '$ref') && typeof Reflect.get(input, '$ref') === 'string'
  );
}
