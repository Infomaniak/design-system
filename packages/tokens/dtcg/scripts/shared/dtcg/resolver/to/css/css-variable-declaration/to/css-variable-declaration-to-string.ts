import type { CssVariableDeclaration } from '../css-variable-declaration.ts';

export function cssVariableDeclarationToString(declaration: CssVariableDeclaration): string {
  let output: string = '';

  if (declaration.description !== undefined || declaration.deprecated) {
    output += '/*\n';
    const prefix: string = ' * ';

    if (declaration.description) {
      for (const line of declaration.description.split('\n')) {
        output += `${prefix}${line}\n`;
      }
    }

    if (declaration.deprecated) {
      output += `${prefix}@deprecated${typeof declaration.deprecated === 'string' ? ` ${declaration.deprecated}` : ''}\n`;
    }

    output += ' */\n';
  }

  output += `${declaration.name}: ${declaration.value};`;

  return output;
}
