export function indent(text: string, indent: string = '  '): string {
  return text
    .split('\n')
    .map((line: string): string => `${indent}${line}`)
    .join('\n');
}
