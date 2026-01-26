export function wrapCssVariableDeclarationsWithCssSelector(
  cssVariables: string,
  selector: string,
  header: string = '',
): string {
  if (header !== '' && !header.endsWith('\n')) {
    header = `${header}\n`;
  }

  return `${header}${selector} {\n${cssVariables
    .split('\n')
    .map((line: string): string => `  ${line}`)
    .join('\n')}\n}\n`;
}
