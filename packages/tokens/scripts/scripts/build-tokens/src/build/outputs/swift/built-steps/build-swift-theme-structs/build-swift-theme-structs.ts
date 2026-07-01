import { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type {
  GenericDesignTokensCollectionToken,
  GenericDesignTokensCollectionTokenWithType,
} from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { isExcludedSwiftToken } from '../../swift-constants.ts';
import { T2_DIRECTORY_NAME } from '../../../../../constants/design-token-tiers.ts';
import { buildSwiftStructTree } from './build-swift-struct-tree.ts';
import { buildSwiftThemeProducts } from './build-swift-theme-products.ts';
import { buildSwiftTokenTree, type SwiftTokenTree } from './build-token-tree.ts';

export interface BuildSwiftThemeStructOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly modifiers: DesignTokenModifiers;
  readonly outputDirectory: string;
  readonly rawTokensPrefix: string;
}

const TYPE_SWIFT_MAP: Record<string, string> = {
  color: 'Color',
  dimension: 'CGFloat',
  number: 'CGFloat',
  fontFamily: 'String',
  fontWeight: 'Font.Weight',
};

export async function buildSwiftThemeStructs({
  baseCollection,
  modifiers,
  outputDirectory,
  rawTokensPrefix,
}: BuildSwiftThemeStructOptions) {
  const names: readonly ArrayDesignTokenName[] = Array.from(
    baseCollection
      .tokens()
      .filter((token: GenericDesignTokensCollectionToken): boolean => {
        const resolvedToken: GenericDesignTokensCollectionTokenWithType = {
          ...token,
          type: baseCollection.resolve(token).type,
        };

        return (
          token.files.some((path: string): boolean => path.includes(T2_DIRECTORY_NAME)) &&
          !isExcludedSwiftToken(resolvedToken)
        );
      })
      .map((token: GenericDesignTokensCollectionToken): ArrayDesignTokenName => {
        return token.name;
      }),
  );

  const baseTokenTree: SwiftTokenTree = buildSwiftTokenTree(
    baseCollection,
    names,
    'String?',
    TYPE_SWIFT_MAP,
    rawTokensPrefix,
  );

  await buildSwiftStructTree(baseTokenTree.tree, [], outputDirectory, baseTokenTree.valueMap);

  await buildSwiftThemeProducts(
    modifiers,
    baseTokenTree.valueMap,
    rawTokensPrefix,
    outputDirectory,
  );
}
