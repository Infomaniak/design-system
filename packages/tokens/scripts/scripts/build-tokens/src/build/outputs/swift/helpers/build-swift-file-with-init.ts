import { dedent } from '../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
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
  return buildSwiftFile({
    imports: ['SwiftUI'],
    type: 'public struct',
    name,
    protocols,
    content: dedent`
      ${variables.map((variable: SwiftVariable): string => `public let ${variable.name}: ${variable.type}`).join('\n')}
      
      init(
        ${variables
          .map((variable: SwiftVariable): string => {
            const defaultVal = variable.initValue === undefined ? '' : ` = ${variable.initValue}`;
            return `${variable.name}: ${variable.type}${defaultVal}`;
          })
          .join(',\n')}
      ) {
        ${variables.map((variable: SwiftVariable): string => `self.${variable.name} = ${variable.name}`).join('\n')}
      }
    `,
  });
}
