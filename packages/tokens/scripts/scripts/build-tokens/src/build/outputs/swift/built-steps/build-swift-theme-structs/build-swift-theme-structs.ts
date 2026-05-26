import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type {
  GenericDesignTokensCollectionToken,
  GenericDesignTokensCollectionTokenWithType,
} from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { isFontFamilyDesignTokensCollectionToken } from '../../../../../../../../shared/dtcg/resolver/token/types/base/font-family/is-font-family-design-tokens-collection-token.ts';
import { T2_DIRECTORY_NAME } from '../../../../../constants/design-token-tiers.ts';
import { buildSharedStructs } from './build-repeated-structures.ts';
import { buildStructTree } from './build-struct-tree.ts';
import { buildSwiftThemeExtension } from './build-swift-theme-extension.ts';
import { buildTokenTree } from './build-token-tree.ts';
import { findPatterns } from './find-patterns.ts';
import { findValueMapDifferences } from './find-value-map-differences.ts';
import { swiftMainStruct } from '../../CONSTANTS.ts';

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
          !isFontFamilyDesignTokensCollectionToken(resolvedToken)
          // TODO: Set all not iOS Tokens
        );
      })
      .map((token: GenericDesignTokensCollectionToken): ArrayDesignTokenName => {
        return token.name;
      }),
  );

  const { tree, valueMap } = buildTokenTree(
    baseCollection,
    names,
    'String?',
    TYPE_SWIFT_MAP,
    rawTokensPrefix,
  );

  await buildStructTree(tree, [], outputDirectory, valueMap);

  modifiers.forEach((tokenContext, modifierType) => {
    if (modifierType === 'theme') return; // Avoid on iOS cause light and dark are handle differently

    tokenContext.forEach(async (modifierCollection, modifierName) => {
      const modifierNames: readonly ArrayDesignTokenName[] = Array.from(
        modifierCollection
          .tokens()
          .filter((token: GenericDesignTokensCollectionToken): boolean => {
            return token.files.some((path: string): boolean => path.includes(T2_DIRECTORY_NAME));
          })
          .map((token: GenericDesignTokensCollectionToken): ArrayDesignTokenName => {
            return token.name;
          }),
      );

      const { tree: modifierTree, valueMap: modifierValueMap } = buildTokenTree(modifierCollection, modifierNames, 'String?', TYPE_SWIFT_MAP, rawTokensPrefix);

      // console.log(`${JSON.stringify(modifierTree, null, 2)}`);
      // console.log(`modifierValueMap: ${JSON.stringify(Array.from(modifierValueMap.entries()), null, 2)}`);

      const differencies = findValueMapDifferences(valueMap, modifierValueMap);

      // DEBUG
      // console.log(`[${modifierType}/${modifierName}] differences (${differencies.length}):\n${JSON.stringify(differencies, null, 2)}`);

      if (differencies.length === 0) return;

      const swiftFileName = `${firstLetterCapitalized(modifierName)}+${swiftMainStruct}`;
      const swiftStruct = buildSwiftThemeExtension(
        modifierName,
        modifierTree,
        modifierValueMap,
        differencies,
      );

      await writeTextFileSafe(join(outputDirectory, `${swiftMainStruct}/${firstLetterCapitalized(modifierType)}/${swiftFileName}.swift`), swiftStruct);
    });
  });
}

export function firstLetterCapitalized(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
