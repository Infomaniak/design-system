import { toPascalCase } from '../../../../../../../../../../../scripts/helpers/misc/case/to-pascal-case/to-pascal-case.ts';
import { toSwiftVariableName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/to-swift-variable-name.ts';
import { buildSwiftFile, indentSwiftLines } from '../../helpers/build-swift-file.ts';
import {
  SWIFT_FOUNDATION_DIR,
  SWIFT_MAIN_STRUCT,
  SWIFT_PRIMITIVE_TARGET_NAME,
} from '../../swift-constants.ts';
import {
  collectSortedLeaves,
  importsForVariables,
  sortedGroupEntries,
  type SwiftLeaf,
} from './build-swift-struct-tree.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';
import {
  resolveThemeTokenSwiftValue,
  type ThemeTokenResolutionContext,
} from './resolve-theme-token-value.ts';

export interface SwiftThemeProductFile {
  readonly typeName: string;
  readonly content: string;
}

export function buildSwiftThemeProductFiles(
  modifierName: string,
  tree: SwiftNestedMap,
  context: ThemeTokenResolutionContext,
): readonly SwiftThemeProductFile[] {
  const files: SwiftThemeProductFile[] = [];
  const themeArgs: string[] = [];

  for (const [key, node] of sortedGroupEntries(tree)) {
    const typeName = toPascalCase(key);
    const qualifiedTypeName = `${SWIFT_MAIN_STRUCT}.${typeName}`;
    const leaves = collectSortedLeaves(node, key);

    const args = leaves.map((leaf: SwiftLeaf): string => {
      const value = resolveThemeTokenSwiftValue(leaf.path, leaf.type, context);
      return `${leaf.name}: ${value}`;
    });

    files.push({
      typeName,
      content: buildSwiftFile({
        imports: [
          ...importsForVariables(leaves),
          SWIFT_FOUNDATION_DIR,
          SWIFT_PRIMITIVE_TARGET_NAME,
        ],
        type: 'extension',
        name: qualifiedTypeName,
        protocols: [],
        content: `static let ${modifierName} = ${qualifiedTypeName}(\n${indentSwiftLines(args.join(',\n'))}\n)`,
      }),
    });

    themeArgs.push(`${toSwiftVariableName([key])}: .${modifierName}`);
  }

  files.push({
    typeName: SWIFT_MAIN_STRUCT,
    content: buildSwiftFile({
      imports: [SWIFT_FOUNDATION_DIR],
      type: 'public extension',
      name: SWIFT_MAIN_STRUCT,
      protocols: [],
      content: `static let ${modifierName} = ${SWIFT_MAIN_STRUCT}(\n${indentSwiftLines(themeArgs.join(',\n'))}\n)`,
    }),
  });

  return files;
}
