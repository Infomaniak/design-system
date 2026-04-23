import { designTokenNameSegmentsReferenceToSwiftName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/design-token-name-segments-reference-to-swift-name.ts';
import type { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericResolvedDesignTokensCollectionToken } from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import type { NestedMap } from './find-repeated-structures.ts';

export function buildTokenTree(
    baseCollection: DesignTokensCollection,
    names: readonly ArrayDesignTokenName[],
    platformTypeRecord: Record<string, string>,
    undefinedType: string,
): { tree: NestedMap; valueMap: Map<string, string> } {
    const tree: NestedMap = {};
    const valueMap = new Map<string, string>();

    for (const name of names) {
        let node = tree;
        for (let i = 0; i < name.length; i++) {
            const key = name[i];
            if (i === name.length - 1) {
                const resolvedToken: GenericResolvedDesignTokensCollectionToken = baseCollection.resolve(
                    baseCollection.get(name),
                );

                node[key] = platformTypeRecord[resolvedToken.type] ?? undefinedType;
                valueMap.set(JSON.stringify(name), `EsdsTokens.${designTokenNameSegmentsReferenceToSwiftName(name)}`);
                break;
            }
            if (!node[key]) node[key] = {};
            node = node[key] as NestedMap;
        }
    }

    return { tree, valueMap };
}
