/**
 * Converts a string to dash-case.
 */
export function toDashCase(input: string): string {
  return (
    input
      // replace all non-alphanumeric or dash characters with dash
      .replace(/[^a-zA-Z0-9-]/g, '-')
      // remove starting and ending dashes
      .replace(/^-+|-+$/g, '')
      // remove consecutive dashes
      .replace(/--+/g, '-')
      // lowercase upper letters preceded by a dash
      .replace(/-([A-Z])/g, (_: string, letter: string): string => `-${letter.toLowerCase()}`)
      // convert camelCase/PascalCase to dash-case
      .replace(
        /[A-Z]/g,
        (letter: string, offset: number): string =>
          `${offset > 0 ? '-' : ''}${letter.toLowerCase()}`,
      )
  );
}
