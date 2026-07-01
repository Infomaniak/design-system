import { toPascalCase } from '../../../../../../../../../../../scripts/helpers/misc/case/to-pascal-case/to-pascal-case.ts';
import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { toSwiftVariableName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/to-swift-variable-name.ts';
import { buildSwiftFile } from '../../helpers/build-swift-file.ts';
import { SWIFT_MAIN_STRUCT } from '../../swift-constants.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';
import { getSortedSwiftVariables } from './build-variables-for-node.ts';
import type { ValueMapDifference } from './find-value-map-differences.ts';

type DiffNode = { [key: string]: DiffNode | string };

function structNameForPath(path: string[]): string {
  return path.length === 0 ? `${SWIFT_MAIN_STRUCT}` : `${toPascalCase(path[path.length - 1])}`;
}

function buildDiffTree(
  differences: ValueMapDifference[],
  modifierValueMap: Map<string, string>,
): DiffNode {
  const root: DiffNode = {};
  for (const diff of differences) {
    const path = JSON.parse(diff.key) as string[];
    let node = root;
    for (let i = 0; i < path.length; i++) {
      const seg = path[i];
      if (i === path.length - 1) {
        node[seg] = modifierValueMap.get(diff.key) ?? 'nil';
      } else {
        if (!node[seg]) node[seg] = {};
        node = node[seg] as DiffNode;
      }
    }
  }
  return root;
}

function emitDiffNode(
  typeName: string,
  diffNode: DiffNode,
  treeNode: SwiftNestedMap,
  path: string[],
  modifierValueMap: Map<string, string>,
): string {
  const args: string[] = [];

  const canonicalFields = getSortedSwiftVariables(treeNode, modifierValueMap, path);

  // TODO: Possible optimization: Use a Map for treeNode entries to avoid O(n) search for each field
  for (const field of canonicalFields) {
    const entry = Object.entries(treeNode).find(([k]) => toSwiftVariableName([k]) === field.name);

    if (!entry) continue;
    const [key, value] = entry;

    if (typeof value === 'string') {
      if (key in diffNode) {
        args.push(`${field.name}: ${diffNode[key]}`);
      }
    } else {
      const childPath = [...path, key];
      const childDiff = (diffNode[key] as DiffNode) ?? {};
      const childTreeNode = treeNode[key] as SwiftNestedMap;
      const childTypeName = structNameForPath(childPath);

      const call = emitDiffNode(
        childTypeName,
        childDiff,
        childTreeNode,
        childPath,
        modifierValueMap,
      );

      if (call) {
        args.push(`${field.name}: ${call}`);
      }
    }
  }

  if (args.length === 0) return '';
  return dedent`
    ${typeName}(
      ${args.join(',\n')}
    )
  `;
}

export function buildSwiftThemeExtension(
  modifierName: string,
  tree: SwiftNestedMap,
  modifierValueMap: Map<string, string>,
  differences: ValueMapDifference[],
): string {
  const diffTree = buildDiffTree(differences, modifierValueMap);
  const initCall = emitDiffNode(`${SWIFT_MAIN_STRUCT}`, diffTree, tree, [], modifierValueMap);

  return buildSwiftFile({
    imports: ['SwiftUI'],
    type: 'extension',
    name: `${SWIFT_MAIN_STRUCT}`,
    protocols: [],
    content: `static let ${modifierName} = ${initCall}`,
  });
}
