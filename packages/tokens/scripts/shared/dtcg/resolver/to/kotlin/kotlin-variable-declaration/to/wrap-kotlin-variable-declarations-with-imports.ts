export function wrapKotlinVariableDeclarationsWithImports(
  kotlinVariables: string,
  imports: readonly string[],
  header: string = '',
): string {
  if (header !== '' && !header.endsWith('\n')) {
    header = `${header}\n`;
  }

  return `${header}\n${imports.join('\n')}\n\n${kotlinVariables}\n`;
}
