import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { T2_DIRECTORY_NAME } from '../../../../../constants/design-token-tiers.ts';
import { buildSwiftStructWithInit } from '../../helpers/build-swift-file-with-init.ts';
import { buildTokenTree } from './build-token-tree.ts';
import { findRepeatedStructures, nameForPatternPaths } from './find-repeated-structures.ts';
import { buildVariablesForNode } from './build-variables-for-node.ts';
import { buildStructTree } from './build-struct-tree.ts';
import { buildReapeatedStructures } from './build-repeated-structures.ts';

export interface BuildSwiftThemeStructOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly outputDirectory: string;
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
  outputDirectory,
}: BuildSwiftThemeStructOptions) {
  const names: readonly ArrayDesignTokenName[] = Array.from(
    baseCollection
      .tokens()
      .filter((token: GenericDesignTokensCollectionToken): boolean => {
        return token.files.some((path: string): boolean => path.includes(T2_DIRECTORY_NAME));
      })
      .map((token: GenericDesignTokensCollectionToken): ArrayDesignTokenName => {
        return token.name;
      }),
  );

  const { tree, valueMap, resolvedValueMap } = buildTokenTree(baseCollection, names, TYPE_SWIFT_MAP, 'String?');

  const patterns = findRepeatedStructures(tree);

  await buildReapeatedStructures(patterns, outputDirectory);

  await buildStructTree(tree, [], patterns, outputDirectory, valueMap);
}
