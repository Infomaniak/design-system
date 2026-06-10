/**
 * Converts a dash-case string to camelCase.
 *
 * > NOTE: assumes the input is already dash-case.
 */
export function dashCaseToCamelCase(input: string): string {
  return input.replace(/-([a-z])/g, (_: string, letter: string): string => letter.toUpperCase());
}
