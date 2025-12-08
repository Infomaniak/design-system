export function indent(lines: readonly string[]): string[] {
  return lines.map((line: string): string => `  ${line}`);
}
