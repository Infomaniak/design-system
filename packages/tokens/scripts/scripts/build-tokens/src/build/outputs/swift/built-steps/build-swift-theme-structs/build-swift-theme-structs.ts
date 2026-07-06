import { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type {
  GenericDesignTokensCollectionToken,
  GenericDesignTokensCollectionTokenWithType,
} from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { T2_DIRECTORY_NAME } from '../../../../../constants/design-token-tiers.ts';
import { isExcludedSwiftToken } from '../../swift-constants.ts';
import { buildSwiftStructTree } from './build-swift-struct-tree.ts';
import { buildSwiftThemeProducts } from './build-swift-theme-products.ts';
import { buildSwiftTokenTree, type SwiftTokenTree } from './build-token-tree.ts';

export interface BuildSwiftT2Options {
  readonly baseCollection: DesignTokensCollection;
  readonly outputDirectory: string;
  readonly rawTokensPrefix: string;
}

export interface BuildSwiftThemesOptions {
  readonly modifiers: DesignTokenModifiers;
  readonly baseValueMap: Map<string, string>;
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

function getT2Names(baseCollection: DesignTokensCollection): readonly ArrayDesignTokenName[] {
  return Array.from(
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
}

export async function buildSwiftT2({
  baseCollection,
  outputDirectory,
  rawTokensPrefix,
}: BuildSwiftT2Options): Promise<SwiftTokenTree> {
  const names = getT2Names(baseCollection);
  const baseTokenTree: SwiftTokenTree = buildSwiftTokenTree(
    baseCollection,
    names,
    'String?',
    TYPE_SWIFT_MAP,
    rawTokensPrefix,
  );

  await buildSwiftStructTree(baseTokenTree.tree, [], outputDirectory, baseTokenTree.valueMap);

  return baseTokenTree;
}

export async function buildSwiftThemes({
  modifiers,
  baseValueMap,
  outputDirectory,
  rawTokensPrefix,
}: BuildSwiftThemesOptions): Promise<void> {
  await buildSwiftThemeProducts(modifiers, baseValueMap, rawTokensPrefix, outputDirectory);
}
