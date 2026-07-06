import { join } from 'path';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { capitalizeFirstLetter } from '../../../../../../../../../../../scripts/helpers/misc/case/capitalize-first-letter/capitalize-first-letter.ts';
import type { DesignTokenModifiers } from '../../../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import { SWIFT_MAIN_STRUCT, SWIFT_PRODUCTS_DIR } from '../../swift-constants.ts';
import { buildSwiftThemeExtension } from './build-swift-theme-extension.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';

export interface BuildSwiftThemeProductsOptions {
  readonly modifiers: DesignTokenModifiers;
  readonly tree: SwiftNestedMap;
  readonly rawTokensPrefix: string;
  readonly outputDirectory: string;
}

export async function buildSwiftThemeProducts({
  modifiers,
  tree,
  rawTokensPrefix,
  outputDirectory,
}: BuildSwiftThemeProductsOptions): Promise<readonly string[]> {
  const themeContexts = modifiers.get('theme');
  const lightCollection = themeContexts?.get('light');
  const darkCollection = themeContexts?.get('dark');

  if (lightCollection === undefined || darkCollection === undefined) {
    throw new Error('Missing light/dark theme modifiers, cannot build Swift product themes');
  }

  const productContexts = modifiers.get('product');

  if (productContexts === undefined) {
    throw new Error('Missing product modifiers, cannot build Swift product themes');
  }

  const generatedProductTargetNames: string[] = [];

  for (const [modifierName, productCollection] of productContexts.entries()) {
    const swiftFileName = `${capitalizeFirstLetter(modifierName)}+${SWIFT_MAIN_STRUCT}`;
    const productFolderName = `ESDS${capitalizeFirstLetter(modifierName)}`;

    const swiftStruct = buildSwiftThemeExtension(modifierName, tree, {
      productCollection,
      lightCollection,
      darkCollection,
      rawTokensPrefix,
    });

    await writeTextFileSafe(
      join(outputDirectory, `${SWIFT_PRODUCTS_DIR}/${productFolderName}/${swiftFileName}.swift`),
      swiftStruct,
    );

    generatedProductTargetNames.push(productFolderName);
  }

  return generatedProductTargetNames;
}
