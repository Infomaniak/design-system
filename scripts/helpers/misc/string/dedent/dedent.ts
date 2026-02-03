/**
 * Dedents a string.
 *
 * @param {string} text - The string to dedent.
 * @returns {string} The dedented string.
 *
 * @exemple
 *
 * ```ts
 * const code = dedent(`
 *   class A {
 *     a = 'b';
 *   }
 * `);
 * ```
 */
export function dedent(text: string): string {
  const lines: string[] = text.split('\n');

  const firstLine: string = lines[0];

  if (/^\s*$/.test(firstLine) /* first line contains only whitespaces */) {
    // => remove first line
    lines.shift();
  }

  if (lines.length > 0) {
    const lastLine: string = lines[lines.length - 1];

    if (/^\s*$/.test(lastLine) /* last line contains only whitespaces */) {
      // => remove last line
      lines.pop();
    }
  }

  if (lines.length > 0) {
    const indent: string = lines[0].match(/^(\s+)/)?.[0] ?? '';
    const indentLength: number = indent.length;

    if (indentLength !== 0) {
      for (let i: number = 0; i < lines.length; i++) {
        const line: string = lines[i];

        if (!line.startsWith(indent)) {
          throw new Error(
            `Line ${i + 1} does not start with expected indent: ${JSON.stringify(indent)}`,
          );
        }

        lines[i] = line.slice(indentLength);
      }
    }
  }

  return lines.join('\n');
}
