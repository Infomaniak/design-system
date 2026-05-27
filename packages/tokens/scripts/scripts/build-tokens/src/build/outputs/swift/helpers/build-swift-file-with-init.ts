import { buildSwiftFile } from './build-swift-file.ts';

export interface SwiftVariable {
  name: string;
  type: string;
  initValue?: string;
}

export interface BuildSwiftStructWithInitOptions {
  readonly name: string;
  readonly protocols: readonly string[];
  readonly variables: readonly SwiftVariable[];
}

export function buildSwiftStructWithInit({
  name,
  protocols,
  variables,
}: BuildSwiftStructWithInitOptions): string {
  const initContent = `
  init(
${variables
      .map((variable) => {
        const defaultVal = variable.initValue === undefined ? '' : ` = ${variable.initValue}`;
        return `    ${variable.name}: ${variable.type}${defaultVal}`;
      })
      .join(',\n')}
  ) {
${variables.map((variable) => `    self.${variable.name} = ${variable.name}`).join('\n')}
  }`;

  return buildSwiftFile({
    imports: ['SwiftUI'],
    type: 'public struct',
    name,
    protocols,
    content: `${variables.map((variable) => `public let ${variable.name}: ${variable.type}`).join('\n')}
${initContent}`,
  });
}
