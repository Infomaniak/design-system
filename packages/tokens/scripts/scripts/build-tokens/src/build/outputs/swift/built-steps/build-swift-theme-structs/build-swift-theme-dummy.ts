import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { capitalizeFirstLetter } from '../../../../../../../../../../../scripts/helpers/misc/case/capitalize-first-letter/capitalize-first-letter.ts';
import type { DesignTokenModifiers } from '../../../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import { SWIFT_FOUNDATION_DIR, SWIFT_PRIMITIVE_TARGET_NAME } from '../../swift-constants.ts';
import type { SwiftLeaf } from './build-swift-struct-tree.ts';
import { buildSwiftProductFiles } from './build-swift-theme-extension.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';
import { resolveThemeTokenSwiftValue } from './resolve-theme-token-value.ts';

const SWIFT_HELPER_DIR = 'Helper';
const DUMMY_PRODUCT_NAME = 'dummy';

const DUMMY_SOURCE_PRODUCT_NAME = 'infomaniak';

export interface BuildSwiftThemeDummyOptions {
  readonly modifiers: DesignTokenModifiers;
  readonly rawTokensPrefix: string;
}

export async function buildSwiftThemeDummy(
  tree: SwiftNestedMap,
  outputDirectory: string,
  { modifiers, rawTokensPrefix }: BuildSwiftThemeDummyOptions,
): Promise<void> {
  const dummyName = capitalizeFirstLetter(DUMMY_PRODUCT_NAME);

  const themeContexts = modifiers.get('theme');
  const lightCollection = themeContexts?.get('light');
  const darkCollection = themeContexts?.get('dark');

  if (lightCollection === undefined || darkCollection === undefined) {
    throw new Error('Missing light/dark theme modifiers, cannot build Swift dummy theme');
  }

  const productCollection = modifiers.get('product')?.get(DUMMY_SOURCE_PRODUCT_NAME);

  if (productCollection === undefined) {
    throw new Error(
      `Missing "${DUMMY_SOURCE_PRODUCT_NAME}" product modifier, cannot build Swift dummy theme`,
    );
  }

  const context = { productCollection, lightCollection, darkCollection, rawTokensPrefix };

  const swiftFiles = buildSwiftProductFiles(tree, {
    staticName: DUMMY_PRODUCT_NAME,
    resolveValue: (leaf: SwiftLeaf): string =>
      resolveThemeTokenSwiftValue(leaf.path, leaf.type, context),
    extraGroupImports: [SWIFT_PRIMITIVE_TARGET_NAME],
    themeImports: ['Foundation'],
  });

  for (const swiftFile of swiftFiles) {
    await writeTextFileSafe(
      join(
        outputDirectory,
        `${SWIFT_FOUNDATION_DIR}/${SWIFT_HELPER_DIR}/${dummyName}+${swiftFile.typeName}.swift`,
      ),
      swiftFile.content,
    );
  }
}
