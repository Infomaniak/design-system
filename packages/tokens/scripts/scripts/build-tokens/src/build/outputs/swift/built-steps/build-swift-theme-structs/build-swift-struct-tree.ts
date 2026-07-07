import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { toPascalCase } from '../../../../../../../../../../../scripts/helpers/misc/case/to-pascal-case/to-pascal-case.ts';
import { toSwiftVariableName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/to-swift-variable-name.ts';
import { buildSwiftStructContent, type SwiftVariable } from '../../helpers/build-swift-file-with-init.ts';
import { buildSwiftFile, indentSwiftLines } from '../../helpers/build-swift-file.ts';
import { SWIFT_FOUNDATION_DIR, SWIFT_MAIN_STRUCT } from '../../swift-constants.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';

export interface SwiftLeaf {
  readonly path: string[];
  readonly name: string;
  readonly type: string;
}

export function collectSortedLeaves(node: SwiftNestedMap, groupKey: string): SwiftLeaf[] {
  const leaves: SwiftLeaf[] = [];

  function walk(current: SwiftNestedMap, path: string[]): void {
    for (const [key, value] of Object.entries(current)) {
      const fullPath = [...path, key];

      if (typeof value === 'string') {
        leaves.push({
          path: fullPath,
          name: toSwiftVariableName(fullPath.slice(1)),
          type: value,
        });
      } else {
        walk(value, fullPath);
      }
    }
  }

  walk(node, [groupKey]);

  return leaves.sort((a, b) => a.name.localeCompare(b.name));
}

export function importsForVariables(variables: readonly SwiftVariable[]): string[] {
  const needsSwiftUI = variables.some(
    (variable: SwiftVariable): boolean =>
      variable.type.startsWith('SwiftUI.') ||
      variable.type.startsWith('Font.') ||
      variable.type === 'RoundedRectangle',
  );

  return needsSwiftUI ? ['SwiftUI'] : ['Foundation'];
}

export function sortedGroupEntries(
  tree: SwiftNestedMap,
): readonly [string /* group key */, SwiftNestedMap][] {
  return Object.entries(tree)
    .filter((entry): entry is [string, SwiftNestedMap] => typeof entry[1] !== 'string')
    .sort(([a], [b]) => toSwiftVariableName([a]).localeCompare(toSwiftVariableName([b])));
}

export async function buildSwiftStructTree(
  tree: SwiftNestedMap,
  outputDirectory: string,
): Promise<void> {
  const rootVariables: SwiftVariable[] = [];

  for (const [key, value] of sortedGroupEntries(tree)) {
    const typeName = toPascalCase(key);
    rootVariables.push({ name: toSwiftVariableName([key]), type: typeName });

    const variables: SwiftVariable[] = collectSortedLeaves(value, key);

    const fileContent = buildSwiftFile({
      imports: importsForVariables(variables),
      type: 'public extension',
      name: SWIFT_MAIN_STRUCT,
      protocols: [],
      content: `struct ${typeName}: Sendable {\n${indentSwiftLines(buildSwiftStructContent(variables))}\n}`,
    });

    await writeTextFileSafe(
      join(outputDirectory, `${SWIFT_FOUNDATION_DIR}/${typeName}.swift`),
      fileContent,
    );
  }

  const swiftStruct = buildSwiftFile({
    imports: importsForVariables(rootVariables),
    type: 'public struct',
    name: SWIFT_MAIN_STRUCT,
    protocols: ['Sendable'],
    content: buildSwiftStructContent(rootVariables),
  });

  await writeTextFileSafe(
    join(outputDirectory, `${SWIFT_FOUNDATION_DIR}/${SWIFT_MAIN_STRUCT}.swift`),
    swiftStruct,
  );
}
