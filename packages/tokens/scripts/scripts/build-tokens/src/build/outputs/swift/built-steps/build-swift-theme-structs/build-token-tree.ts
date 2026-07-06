import type { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { ArrayDesignTokenName } from '../../../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';

export type SwiftNestedMap = { [key: string]: SwiftNestedMap | string };

export function buildSwiftTokenTree(
  collection: DesignTokensCollection,
  names: readonly ArrayDesignTokenName[],
  platformTypeRecord: Record<string, string>,
): SwiftNestedMap {
  const tree: SwiftNestedMap = {};

  for (const name of names) {
    let node = tree;
    for (let i = 0; i < name.length; i++) {
      const key = name[i];
      if (i === name.length - 1) {
        if (name[0] === 'radius') {
          node[key] = 'RoundedRectangle';
        } else {
          const resolvedType = collection.resolve(collection.get(name)).type;
          const swiftType = platformTypeRecord[resolvedType];
          if (swiftType === undefined) {
            throw new Error(`No Swift type mapping for token ${name.join('.')} (${resolvedType})`);
          }
          node[key] = swiftType;
        }
        break;
      }
      if (!node[key]) node[key] = {};
      node = node[key] as SwiftNestedMap;
    }
  }

  return tree;
}
