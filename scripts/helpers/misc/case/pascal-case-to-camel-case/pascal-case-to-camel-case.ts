/**
 * Converts a PascalCase string to camelCase.
 *
 * > NOTE: assumes the input is already PascalCase.
 */
export function pascalCaseToCamelCase(input: string): string {
  return input.charAt(0).toLowerCase() + input.slice(1);
}
