import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { segmentsReferenceToPascalCase } from '../../../../../../../../shared/dtcg/design-token/reference/types/segments/to/pascal-case/segments-reference-to-pascal-case.ts';
import { SWIFT_STRUCT_PREFIX, SWIFT_MAIN_STRUCT } from '../../swift-constants.ts';
import { buildSwiftStructWithInit } from '../../helpers/build-swift-file-with-init.ts';
import { toSwiftVariableName } from '../../swift-naming-helper.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';
import { buildSwiftVariablesForNode } from './build-variables-for-node.ts';
import { capitalizeFirstLetter } from '../../../../../../../../../../../scripts/helpers/misc/case/capitalize-first-letter/capitalize-first-letter.ts';

function structNameForPath(path: string[]): string {
  return path.length === 0
    ? `${SWIFT_MAIN_STRUCT}`
    : `${SWIFT_STRUCT_PREFIX}${segmentsReferenceToPascalCase(path)}`;
}

function sortEntries<T>(entries: Array<[string, T]>): Array<[string, T]> {
  return [...entries].sort(([a], [b]) => a.localeCompare(b));
}

export async function buildSwiftStructTree(
  node: SwiftNestedMap,
  path: string[],
  outputDirectory: string,
  valueMap: Map<string, string>,
): Promise<void> {
  const variables = buildSwiftVariablesForNode(node);

  // Set initValue for string (leaf) entries directly in this node
  const stringEntries = sortEntries(Object.entries(node).filter(([, v]) => typeof v === 'string'));
  const hasObjectEntries = Object.entries(node).some(([, v]) => typeof v !== 'string');
  if (stringEntries.length > 0 && hasObjectEntries) {
    for (const [key] of stringEntries) {
      const idx = variables.findIndex((v) => v.name === toSwiftVariableName([key]));
      if (idx !== -1) variables[idx].initValue = valueMap.get(JSON.stringify([...path, key]));
    }
  } else {
    for (const [key] of stringEntries) {
      const idx = variables.findIndex((v) => v.name === toSwiftVariableName([key]));
      if (idx !== -1) variables[idx].initValue = valueMap.get(JSON.stringify([...path, key]));
    }
  }

  const objectEntries = sortEntries(Object.entries(node).filter(([, v]) => typeof v !== 'string'));
  for (const [key, value] of objectEntries) {
    const idx = variables.findIndex((v) => v.name === toSwiftVariableName([key]));
    const childEntries = Object.entries(value as SwiftNestedMap);

    if (childEntries.length === 1 && typeof childEntries[0][1] === 'string') {
      // Single leaf: inline as combinedName, no sub-struct created
      const [leafKey, leafType] = childEntries[0];
      const initVal = valueMap.get(JSON.stringify([...path, key, leafKey]));
      if (idx !== -1)
        variables[idx] = {
          name: toSwiftVariableName([key, leafKey]),
          type: leafType as string,
          initValue: initVal,
        };
    } else {
      const typeName = structNameForPath([...path, key]);
      // Unique EsdsThemeXxx struct: has its own defaulted init, just call TypeName()
      if (idx !== -1)
        variables[idx] = {
          name: toSwiftVariableName([key]),
          type: typeName,
          initValue: `${typeName}()`,
        };
      await buildSwiftStructTree(value as SwiftNestedMap, [...path, key], outputDirectory, valueMap);
    }
  }

  const name = structNameForPath(path);
  const folderName = path.length == 0 ? `` : `${SWIFT_STRUCT_PREFIX}${capitalizeFirstLetter(path[0])}/`;
  const swiftStruct = buildSwiftStructWithInit({ name, protocols: ['Sendable'], variables });
  await writeTextFileSafe(
    join(outputDirectory, `${SWIFT_MAIN_STRUCT}/${folderName}${name}.swift`),
    swiftStruct,
  );
}
