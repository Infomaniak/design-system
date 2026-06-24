import { join } from 'path';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { capitalizeFirstLetter } from '../../../../../../../../../../../scripts/helpers/misc/case/capitalize-first-letter/capitalize-first-letter.ts';
import type { DesignTokenModifiers } from '../../../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { swiftMainStruct } from '../../CONSTANTS.ts';
import { buildSwiftThemeExtension } from './build-swift-theme-extension.ts';
import { buildSwiftTokenTree, type SwiftTokenTree } from './build-token-tree.ts';
import { findValueMapDifferences } from './find-value-map-differences.ts';

export async function buildSwiftThemeProducts(
  modifiers: DesignTokenModifiers,
  baseValueMap: Map<string, string>,
  rawTokensPrefix: string,
  outputDirectory: string,
) {
  for (const [modifierType, tokenContext] of modifiers.entries()) {
    if (modifierType !== 'product') continue; // Only process product modifiers on iOS

    for (const [modifierName, modifierCollection] of tokenContext.entries()) {
      const modifierNames: readonly ArrayDesignTokenName[] = Array.from(
        modifierCollection
          .tokens()
          .filter((token: GenericDesignTokensCollectionToken): boolean => {
            const expectedPath = `${modifierType}/${modifierName}`;
            return token.files.some((path: string): boolean => path.includes(expectedPath));
          })
          .map((token: GenericDesignTokensCollectionToken): ArrayDesignTokenName => {
            return token.name;
          }),
      );

      const productsTokenTree: SwiftTokenTree = buildSwiftTokenTree(
        modifierCollection,
        modifierNames,
        'String?',
        {},
        rawTokensPrefix,
      );

      const differencies = findValueMapDifferences(baseValueMap, productsTokenTree.valueMap);

      if (differencies.length === 0) continue;

      const swiftFileName = `${capitalizeFirstLetter(modifierName)}+${swiftMainStruct}`;
      const swiftStruct = buildSwiftThemeExtension(
        modifierName,
        productsTokenTree.tree,
        productsTokenTree.valueMap,
        differencies,
      );

      await writeTextFileSafe(
        join(
          outputDirectory,
          `${swiftMainStruct}/${capitalizeFirstLetter(modifierType)}/${swiftFileName}.swift`,
        ),
        swiftStruct,
      );
    }
  }
}
