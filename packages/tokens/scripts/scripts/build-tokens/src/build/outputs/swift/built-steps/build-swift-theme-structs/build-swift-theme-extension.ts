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
  sortedGroupEntries,
  type SwiftLeaf,
} from './build-swift-struct-tree.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';
import {
  resolveThemeTokenSwiftValue,
  type ThemeTokenResolutionContext,
} from './resolve-theme-token-value.ts';

export function buildSwiftThemeExtension(
  modifierName: string,
  tree: SwiftNestedMap,
  context: ThemeTokenResolutionContext,
): string {
  const groupCalls = sortedGroupEntries(tree).map(([key, node]): string => {
    const typeName = toPascalCase(key);
    const varName = toSwiftVariableName([key]);

    const args = collectSortedLeaves(node, key).map((leaf: SwiftLeaf): string => {
      const value = resolveThemeTokenSwiftValue(leaf.path, leaf.type, context);
      return `${leaf.name}: ${value}`;
    });

    return `${varName}: ${typeName}(\n${indentSwiftLines(args.join(',\n'))}\n)`;
  });

  const initCall = `${SWIFT_MAIN_STRUCT}(\n${indentSwiftLines(groupCalls.join(',\n'))}\n)`;

  return buildSwiftFile({
    imports: ['SwiftUI', SWIFT_FOUNDATION_DIR, SWIFT_PRIMITIVE_TARGET_NAME],
    type: 'public extension',
    name: `${SWIFT_MAIN_STRUCT}`,
    protocols: [],
    content: `static let ${modifierName} = ${initCall}`,
  });
}
