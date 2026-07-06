import { dedent } from '../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';

export interface SwiftVariable {
  name: string;
  type: string;
}

export function buildSwiftStructContent(variables: readonly SwiftVariable[]): string {
  return dedent`
    ${variables.map((variable: SwiftVariable): string => `public let ${variable.name}: ${variable.type}`).join('\n')}

    public init(
      ${variables.map((variable: SwiftVariable): string => `${variable.name}: ${variable.type}`).join(',\n')}
    ) {
      ${variables.map((variable: SwiftVariable): string => `self.${variable.name} = ${variable.name}`).join('\n')}
    }
  `;
}
