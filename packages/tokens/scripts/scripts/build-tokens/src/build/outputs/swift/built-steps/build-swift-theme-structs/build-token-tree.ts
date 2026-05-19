import { designTokenNameSegmentsReferenceToSwiftName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/design-token-name-segments-reference-to-swift-name.ts';
import type { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericResolvedDesignTokensCollectionToken } from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import type { NestedMap } from './LEGACY/find-repeated-structures.ts';
import { firstLetterCapitalized } from './build-swift-theme-structs.ts';
import { cleanSwiftName } from '../../../../../../../../shared/dtcg/resolver/to/swift/token/name/clean-swift-name-segment.ts';

export function buildTokenTree(
    baseCollection: DesignTokensCollection,
    names: readonly ArrayDesignTokenName[],
    undefinedType: string,
    platformTypeRecord: Record<string, string>,
    rawTokensPrefix: string
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
                const groupName = cleanSwiftName(firstLetterCapitalized(resolvedToken.name[0]));
                const tokenName = designTokenNameSegmentsReferenceToSwiftName(name, 1)

                node[key] = platformTypeRecord[resolvedToken.type] ?? undefinedType;
                valueMap.set(JSON.stringify(name), `${rawTokensPrefix}.${groupName}.${tokenName}`);
                break;
            }
            if (!node[key]) node[key] = {};
            node = node[key] as NestedMap;
        }
    }

    return { tree, valueMap };
}
