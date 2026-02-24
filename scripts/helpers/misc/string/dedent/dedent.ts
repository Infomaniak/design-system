/**
 * Dedents a string.
 *
 * NOTE: this is a [Tagged templates function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)
 *
 *
 * @exemple
 *
 * ```ts
 * const code = dedent`
 *   class A {
 *     a = 'b';
 *   }
 * `;
 * ```
 */
export function dedent(parts: TemplateStringsArray, ...values: string[]): string {
  const firstPart: string = parts[0];
  const lastIndex: number = parts.length - 1;
  const lastPart: string = parts[lastIndex];

  const indent: string | undefined = firstPart.match(/^\n(\s+)/)?.[1] ?? undefined;

  if (indent === undefined) {
    throw new Error(
      `First part of template literal does not start with a newline and indent: ${JSON.stringify(firstPart)}`,
    );
  }

  const lastMatchIndex: number = lastPart.search(/\n\s+$/);

  if (lastMatchIndex === -1) {
    throw new Error(
      `Last part of template literal does not end with a newline and indent: ${JSON.stringify(lastPart)}`,
    );
  }

  let output: string = '';

  for (let i: number = 0; i < values.length; i++) {
    const value: string = values[i];
    const part: string = i === 0 ? parts[i].slice(1) : parts[i];

    const partLines: readonly string[] = part
      .split('\n')
      .map((line: string, index: number): string => {
        if (line.startsWith(indent)) {
          return line.slice(indent.length);
        } else if (index == 0) {
          return line;
        } else {
          throw new Error(
            `Line does not start with expected indent.\n  - line: ${JSON.stringify(line)}\n  - expected indent: ${JSON.stringify(indent)}`,
          );
        }
      });

    const valueIndent: string = partLines[partLines.length - 1].match(/^(\s*)/)![1];

    output +=
      partLines.join('\n') +
      (valueIndent === ''
        ? value
        : value
            .split('\n')
            .map((line: string, index: number): string => {
              return index === 0 ? line : `${valueIndent}${line}`;
            })
            .join('\n'));
  }

  output += dedentRaw(lastPart.slice(values.length === 0 ? 1 : 0, lastMatchIndex), indent).join(
    '\n',
  );

  return output;
}

function dedentRaw(text: string, indent: string): string[] {
  return text.split('\n').map((line: string, index: number): string => {
    if (line.startsWith(indent)) {
      return line.slice(indent.length);
    } else if (index == 0) {
      return line;
    } else {
      throw new Error(
        `Line does not start with expected indent.\n  - line: ${JSON.stringify(line)}\n  - expected indent: ${JSON.stringify(indent)}`,
      );
    }
  });
}
