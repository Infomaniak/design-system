import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { capitalizeFirstLetter } from '../../../../../../../../../../../scripts/helpers/misc/case/capitalize-first-letter/capitalize-first-letter.ts';
import { toPascalCase } from '../../../../../../../../../../../scripts/helpers/misc/case/to-pascal-case/to-pascal-case.ts';
import { toSwiftVariableName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/to-swift-variable-name.ts';
import { buildSwiftStructWithInit } from '../../helpers/build-swift-file-with-init.ts';
import { SWIFT_MAIN_STRUCT, SWIFT_STRUCT_PREFIX } from '../../swift-constants.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';
import { getSortedSwiftVariables } from './build-variables-for-node.ts';

function structNameForPath(path: string[]): string {
  return path.length === 0
    ? `${SWIFT_MAIN_STRUCT}`
    : `${SWIFT_STRUCT_PREFIX}${toPascalCase(path.join('.'))}`;
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
  const folderName =
    path.length == 0 ? `` : `${SWIFT_STRUCT_PREFIX}${capitalizeFirstLetter(path[0])}/`;

  const swiftStruct = buildSwiftStructWithInit({
    name,
    protocols: ['Sendable'],
    variables,
  });

  await writeTextFileSafe(
    join(outputDirectory, `${SWIFT_MAIN_STRUCT}/${folderName}${name}.swift`),
    swiftStruct,
  );
}
