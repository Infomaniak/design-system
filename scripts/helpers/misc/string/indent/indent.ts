/**
 * Indents a string.
 *
 * @param {string} text - The string to indent.
 * @param {string} [indent] - The indent to use (default: '  ').
 * @returns {string} The indented string.
 *
 * @exemple
 *
 * ```ts
 * const content = dedent(`
 *   a = 5;
 * `);

 * const code = dedent(`
 *   class A {
 *   ${indent(content)}
 *   }
 * `);
 * ```
 */

export function indent(text: string, indent: string = '  '): string {
  return text
    .split('\n')
    .map((line: string): string => `${indent}${line}`)
    .join('\n');
}
