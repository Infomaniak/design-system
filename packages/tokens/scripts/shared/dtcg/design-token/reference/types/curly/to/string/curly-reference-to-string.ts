import type { CurlyReference } from '../../curly-reference.ts';

/**
 * Converts a curly reference to a plain string by removing the braces.
 *
 * @param reference - A curly reference like `{color.red.500}`
 * @returns The unwrapped content like `color.red.500`
 *
 * @example
 * curlyReferenceToString('{color.red.500}')  // 'color.red.500'
 */
export function curlyReferenceToString(reference: CurlyReference): string {
  return reference.slice(1, -1);
}
