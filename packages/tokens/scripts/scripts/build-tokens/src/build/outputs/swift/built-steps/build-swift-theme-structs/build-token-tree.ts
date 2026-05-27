import { isCurlyReference } from '../../../../../../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../../../../../shared/dtcg/design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import type { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { ArrayDesignTokenName } from '../../../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { T2_DIRECTORY_NAME } from '../../../../../constants/design-token-tiers.ts';
import { tokenToSwiftValue } from '../../swift-tokens-format.ts';

export type NestedMap = { [key: string]: NestedMap | string };

export type TokenTree = {
  tree: NestedMap;
  valueMap: Map<string, string>;
};

export function buildTokenTree(
  baseCollection: DesignTokensCollection,
  names: readonly ArrayDesignTokenName[],
  undefinedType: string,
  platformTypeRecord: Record<string, string>,
  rawTokensPrefix: string,
): TokenTree {
  const tree: NestedMap = {};
  const valueMap = new Map<string, string>();

  for (const name of names) {
    let node = tree;
    for (let i = 0; i < name.length; i++) {
      const key = name[i];
      if (i === name.length - 1) {
        const rawToken = baseCollection.get(name);
        const resolvedToken = baseCollection.resolve(rawToken);

        let nameForSwift = resolvedToken.name;
        if (isCurlyReference(rawToken.value)) {
          const referenceSegments = curlyReferenceToSegmentsReference(rawToken.value);
          const referenceTarget = baseCollection.get(referenceSegments);
          if (referenceTarget?.files.some((f: string) => f.includes(T2_DIRECTORY_NAME))) {
            nameForSwift = referenceSegments;
          }
        }

        const tokenSwiftValue = tokenToSwiftValue(rawTokensPrefix, {
          ...resolvedToken,
          name: nameForSwift,
        });

        node[key] = platformTypeRecord[resolvedToken.type] ?? undefinedType;
        valueMap.set(JSON.stringify(name), `${tokenSwiftValue}`);
        break;
      }
      if (!node[key]) node[key] = {};
      node = node[key] as NestedMap;
    }
  }

  return { tree, valueMap };
}
