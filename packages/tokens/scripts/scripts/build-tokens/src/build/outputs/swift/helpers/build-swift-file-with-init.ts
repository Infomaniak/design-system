import { buildSwiftFile } from "./build-swift-file.ts";

export interface SwiftVariable {
  name: string;
  type: string;
  initValue?: string;
}

export interface BuildSwiftStructWithInitOptions {
  readonly name: string,
  readonly protocols: readonly string[],
  readonly variables: SwiftVariable[]
}

export function buildSwiftStructWithInit({ name, protocols, variables }: BuildSwiftStructWithInitOptions): string {
  const initContent = `
  init(
${variables.map(v => {
    const defaultVal = v.initValue != undefined ? ` = ${v.initValue}` : "";
    return `    ${v.name}: ${v.type}${defaultVal}`;
  }).join(',\n')}
  ) {
${variables.map(v => `    self.${v.name} = ${v.name}`).join('\n')}
  }`;

  return buildSwiftFile({
    imports: ['SwiftUI'],
    type: 'public struct',
    name,
    protocols,
    content: `${variables.map(v => `public let ${v.name}: ${v.type}`).join('\n')}
${initContent}`,
  });
}