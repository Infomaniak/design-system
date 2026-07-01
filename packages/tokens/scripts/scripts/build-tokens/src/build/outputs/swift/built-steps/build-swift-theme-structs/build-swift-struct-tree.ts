import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { toPascalCase } from '../../../../../../../../../../../scripts/helpers/misc/case/to-pascal-case/to-pascal-case.ts';
import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { toSwiftVariableName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/to-swift-variable-name.ts';
import {
  buildSwiftStructWithInit,
  type SwiftVariable,
} from '../../helpers/build-swift-file-with-init.ts';
import { buildSwiftFile } from '../../helpers/build-swift-file.ts';
import { SWIFT_MAIN_STRUCT } from '../../swift-constants.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';
import { getSortedSwiftVariables } from './build-variables-for-node.ts';

function structNameForPath(path: string[]): string {
  return path.length === 0 ? `${SWIFT_MAIN_STRUCT}` : `${toPascalCase(path[path.length - 1])}`;
}

function extensionTargetForPath(path: string[]): string {
  if (path.length <= 1) {
    return SWIFT_MAIN_STRUCT;
  }
  const parentSegments = path.slice(0, -1).map((segment) => toPascalCase(segment));
  return `${SWIFT_MAIN_STRUCT}.${parentSegments.join('.')}`;
}

function buildSwiftStructBody({
  name,
  protocols,
  variables,
}: {
  readonly name: string;
  readonly protocols: readonly string[];
  readonly variables: readonly SwiftVariable[];
}): string {
  const safeProtocols = protocols.length ? `: ${protocols.join(', ')}` : '';

  return dedent`
    public struct ${name}${safeProtocols} {
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
    }
  `;
}

export async function buildSwiftStructTree(
  node: SwiftNestedMap,
  path: string[],
  outputDirectory: string,
  valueMap: Map<string, string>,
): Promise<void> {
  const variables = getSortedSwiftVariables(node, valueMap, path);
  const varIndexByName = new Map(variables.map((v, i) => [v.name, i]));

  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string') continue;

    const typeName = structNameForPath([...path, key]);
    const varName = toSwiftVariableName([key]);
    const idx = varIndexByName.get(varName);
    if (idx !== undefined) {
      variables[idx] = {
        ...variables[idx],
        type: typeName,
        initValue: `${typeName}()`,
      };
    }

    await buildSwiftStructTree(value, [...path, key], outputDirectory, valueMap);
  }

  const name = structNameForPath(path);

  if (path.length === 0) {
    const swiftStruct = buildSwiftStructWithInit({
      name,
      protocols: ['Sendable'],
      variables,
    });

    await writeTextFileSafe(
      join(outputDirectory, `${SWIFT_MAIN_STRUCT}/${name}.swift`),
      swiftStruct,
    );
  } else {
    const structPath = path.map((segment) => toPascalCase(segment)).join('');
    const fileName = `${structPath}.swift`;
    const extensionTarget = extensionTargetForPath(path);

    const fileContent = buildSwiftFile({
      imports: ['SwiftUI'],
      type: 'extension',
      name: extensionTarget,
      protocols: [],
      content: buildSwiftStructBody({
        name,
        protocols: ['Sendable'],
        variables,
      }),
    });

    await writeTextFileSafe(join(outputDirectory, `${SWIFT_MAIN_STRUCT}/${fileName}`), fileContent);
  }
}
