import { indentSwiftLines } from './build-swift-file.ts';

export interface SwiftVariable {
  name: string;
  type: string;
}

export function buildSwiftStructContent(variables: readonly SwiftVariable[]): string {
  const properties = variables
    .map((variable: SwiftVariable): string => `public let ${variable.name}: ${variable.type}`)
    .join('\n');
  const parameters = variables
    .map((variable: SwiftVariable): string => `${variable.name}: ${variable.type}`)
    .join(',\n');
  const assignments = variables
    .map((variable: SwiftVariable): string => `self.${variable.name} = ${variable.name}`)
    .join('\n');

  return `${properties}\n\npublic init(\n${indentSwiftLines(parameters)}\n) {\n${indentSwiftLines(assignments)}\n}`;
}
