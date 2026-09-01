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
    console.assert(name.length !== 0);

    let node: SwiftNestedMap = tree;
    const last: number = name.length - 1;

    for (let i: number = 0; i < last; i++) {
      const key: string = name[i];
      if (!Reflect.has(node, key)) {
        node[key] = {};
      } else if (typeof node[key] !== 'object') {
        node[key] = {
          $root: node[key],
        };
      }
      node = node[key] as SwiftNestedMap;
    }

    const key: string = name[last];

    if (name[0] === 'radius') {
      node[key] = 'RoundedRectangle';
    } else {
      const resolvedType: string = collection.resolve(collection.get(name)).type;
      const swiftType: string = platformTypeRecord[resolvedType];

      if (swiftType === undefined) {
        throw new Error(`No Swift type mapping for token ${name.join('.')} (${resolvedType})`);
      }

      node[key] = swiftType;
    }
  }

  return tree;
}
