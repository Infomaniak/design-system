import { isSwiftEnumMark, type SwiftEnumDeclaration, type SwiftEnumMark } from '../swift-enum-declaration.ts';

export function swiftEnumDeclarationToString(declaration: SwiftEnumDeclaration | SwiftEnumMark): string {
  if (isSwiftEnumMark(declaration)) {
    return `\n// MARK: - ${declaration.name}`;
  }

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

  output += `static public let ${declaration.name}: ${declaration.type} = ${declaration.value}`;

  return output;
}
