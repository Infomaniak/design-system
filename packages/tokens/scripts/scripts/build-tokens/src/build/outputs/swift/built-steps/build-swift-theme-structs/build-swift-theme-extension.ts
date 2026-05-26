import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { segmentsReferenceToPascalCase } from '../../../../../../../../shared/dtcg/design-token/reference/types/segments/to/pascal-case/segments-reference-to-pascal-case.ts';
import { structPrefix, swiftMainStruct } from '../../CONSTANTS.ts';
import { buildSwiftFile } from '../../helpers/build-swift-file.ts';
import { toSwiftVariableName } from '../../swift-naming-helper.ts';
import type { NestedMap } from './LEGACY/find-repeated-structures.ts';
import { getSharedStructName } from './find-patterns.ts';
import type { ValueMapDifference } from './find-value-map-differences.ts';

type DiffNode = { [key: string]: DiffNode | string };

function structNameForPath(path: string[]): string {
  return path.length === 0 ? `${swiftMainStruct}` : `${structPrefix}${segmentsReferenceToPascalCase(path)}`;
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
  treeNode: NestedMap,
  path: string[],
  modifierValueMap: Map<string, string>,
): string {
  const args: string[] = [];
  const leafEntries = Object.entries(diffNode).filter(([, v]) => typeof v === 'string') as [
    string,
    string,
  ][];
  const subNodeEntries = Object.entries(diffNode).filter(([, v]) => typeof v !== 'string') as [
    string,
    DiffNode,
  ][];

  // Leaf entries — check for root-pattern grouping (mixed treeNode: strings + objects)
  if (leafEntries.length > 0) {
    const treeHasMixedEntries = Object.values(treeNode).some((v) => typeof v !== 'string');
    if (treeHasMixedEntries) {
      for (const [key, val] of leafEntries) {
        args.push(`${toSwiftVariableName([key])}: ${val}`);
      }
    } else {
      for (const [key, val] of leafEntries) {
        args.push(`${toSwiftVariableName([key])}: ${val}`);
      }
    }
  }

  // Sub-node entries
  for (const [key, childDiff] of subNodeEntries) {
    const childPath = [...path, key];
    const childTreeNode = treeNode[key] as NestedMap | undefined;
    if (!childTreeNode) continue;

    const childTypeName = structNameForPath(childPath);

    const childEntries = Object.entries(childTreeNode);
    if (childEntries.length === 1 && typeof childEntries[0][1] === 'string') {
      // Single-leaf inlined node
      const [leafKey] = childEntries[0];
      args.push(
        `${toSwiftVariableName([key, leafKey])}: ${modifierValueMap.get(JSON.stringify([...childPath, leafKey])) ?? 'nil'}`,
      );
    } else {
      const call = emitDiffNode(
        childTypeName,
        childDiff,
        childTreeNode,
        childPath,
        modifierValueMap,
      );
      if (call) args.push(`${toSwiftVariableName([key])}: ${call}`);
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
  tree: NestedMap,
  modifierValueMap: Map<string, string>,
  differences: ValueMapDifference[],
): string {
  const diffTree = buildDiffTree(differences, modifierValueMap);
  const initCall = emitDiffNode(`${swiftMainStruct}`, diffTree, tree, [], modifierValueMap);

  return buildSwiftFile({
    imports: ['SwiftUI'],
    type: 'extension',
    name: `${swiftMainStruct}`,
    protocols: ['Sendable'],
    content: `static let ${modifierName} = ${initCall}`,
  });
}
