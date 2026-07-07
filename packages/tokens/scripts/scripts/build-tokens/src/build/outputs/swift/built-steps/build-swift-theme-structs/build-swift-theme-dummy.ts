import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { capitalizeFirstLetter } from '../../../../../../../../../../../scripts/helpers/misc/case/capitalize-first-letter/capitalize-first-letter.ts';
import { SWIFT_FOUNDATION_DIR } from '../../swift-constants.ts';
import type { SwiftLeaf } from './build-swift-struct-tree.ts';
import { buildSwiftProductFiles } from './build-swift-theme-extension.ts';
import type { SwiftNestedMap } from './build-token-tree.ts';

const SWIFT_HELPER_DIR = 'Helper';
const DUMMY_PRODUCT_NAME = 'dummy';

const DUMMY_SWIFT_VALUES: Record<string, string> = {
  'SwiftUI.Color': 'SwiftUI.Color.white',
  RoundedRectangle: 'RoundedRectangle(cornerRadius: 0)',
  CGFloat: '0',
};

function resolveDummyTokenSwiftValue(leaf: SwiftLeaf): string {
  const value = DUMMY_SWIFT_VALUES[leaf.type];

  if (value === undefined) {
    throw new Error(`No dummy value defined for Swift type ${leaf.type}`);
  }

  return value;
}

export async function buildSwiftThemeDummy(
  tree: SwiftNestedMap,
  outputDirectory: string,
): Promise<void> {
  const dummyName = capitalizeFirstLetter(DUMMY_PRODUCT_NAME);

  const swiftFiles = buildSwiftProductFiles(tree, {
    staticName: DUMMY_PRODUCT_NAME,
    resolveValue: resolveDummyTokenSwiftValue,
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
