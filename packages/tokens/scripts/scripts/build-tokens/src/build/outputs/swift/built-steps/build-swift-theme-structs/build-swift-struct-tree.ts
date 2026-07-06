import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { toPascalCase } from '../../../../../../../../../../../scripts/helpers/misc/case/to-pascal-case/to-pascal-case.ts';
import { toSwiftVariableName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/to-swift-variable-name.ts';
import { buildSwiftStructContent, type SwiftVariable } from '../../helpers/build-swift-file-with-init.ts';
import { buildSwiftFile } from '../../helpers/build-swift-file.ts';
import {
  SWIFT_FOUNDATION_DIR,
  SWIFT_MAIN_STRUCT,
  SWIFT_PRIMITIVE_TARGET_NAME,
} from '../../swift-constants.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';

function structNameForPath(path: string[]): string {
  return path.length === 0 ? `${SWIFT_MAIN_STRUCT}` : `${toPascalCase(path[path.length - 1])}`;
}

function collectFlatVariables(
  node: SwiftNestedMap,
  path: string[],
  valueMap: Map<string, string>,
  variables: SwiftVariable[],
): void {
  for (const [key, value] of Object.entries(node)) {
    const fullPath = [...path, key];

    if (typeof value === 'string') {
      variables.push({
        name: toSwiftVariableName(fullPath.slice(1)),
        type: value,
        initValue: valueMap.get(JSON.stringify(fullPath)),
      });
    } else {
      collectFlatVariables(value, fullPath, valueMap, variables);
    }
  }
}

export async function buildSwiftStructTree(
  node: SwiftNestedMap,
  path: string[],
  outputDirectory: string,
  valueMap: Map<string, string>,
): Promise<void> {
  const rootVariables: SwiftVariable[] = [];

  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string') continue;

    const typeName = structNameForPath([key]);
    rootVariables.push({ name: toSwiftVariableName([key]), type: typeName, initValue: `${typeName}()` });

    const variables: SwiftVariable[] = [];
    collectFlatVariables(value, [key], valueMap, variables);
    variables.sort((a, b) => a.name.localeCompare(b.name));

    const fileContent = buildSwiftFile({
      imports: ['SwiftUI', SWIFT_PRIMITIVE_TARGET_NAME],
      type: 'public extension',
      name: SWIFT_MAIN_STRUCT,
      protocols: [],
      content: `struct ${typeName}: Sendable {\n${buildSwiftStructContent(variables)}\n}`,
    });

    await writeTextFileSafe(
      join(outputDirectory, `${SWIFT_FOUNDATION_DIR}/${typeName}.swift`),
      fileContent,
    );
  }

  rootVariables.sort((a, b) => a.name.localeCompare(b.name));

  const name = structNameForPath(path);
  const swiftStruct = buildSwiftFile({
    imports: ['SwiftUI', SWIFT_PRIMITIVE_TARGET_NAME],
    type: 'public struct',
    name,
    protocols: ['Sendable'],
    content: buildSwiftStructContent(rootVariables),
  });

  await writeTextFileSafe(
    join(outputDirectory, `${SWIFT_FOUNDATION_DIR}/${name}.swift`),
    swiftStruct,
  );
}
