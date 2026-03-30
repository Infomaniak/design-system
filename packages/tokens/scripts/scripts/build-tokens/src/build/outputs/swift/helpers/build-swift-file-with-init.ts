import { buildSwiftFile } from "./build-swift-file.ts";

export interface SwiftVariable {
  name: string;
  type: string;
}

export interface BuildSwiftStructWithInitOptions {
  readonly name: string,
  readonly variables: SwiftVariable[]
}

export function buildSwiftStructWithInit({ name, variables }: BuildSwiftStructWithInitOptions): string {
  const initContent = `
  init(
${variables.map(v => `    ${v.name}: ${v.type}`).join(',\n')}
  ) {
${variables.map(v => `    self.${v.name} = ${v.name}`).join('\n')}
  }`;

  return buildSwiftFile({
    imports: ['SwiftUI'],
    type: 'public struct',
    name,
    content: `${variables.map(v => `public let ${v.name}: ${v.type}`).join('\n')}
${initContent}`,
  });
}