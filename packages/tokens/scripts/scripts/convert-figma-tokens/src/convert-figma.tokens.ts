import { readJsonFile } from '../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeFileSafe } from '../../../../../../scripts/helpers/file/write-file-safe.ts';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { isDesignTokensGroup } from '../../../shared/dtcg/design-token/group/is-design-tokens-group.ts';
import type { DesignTokensTree } from '../../../shared/dtcg/design-token/tree/design-tokens-tree.ts';
import { ascendDesignTokensTreeCommonTypes } from '../../../shared/dtcg/operations/ascend-common-types/ascend-design-tokens-tree-common-types.ts';
import { tokensBrueckeToDtcg } from '../../../shared/tokens-bruecke/to/dtcg/tokens-bruecke-to-dtcg.ts';
import {
  DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTIONS,
  T3_DIRNAME,
} from '../../build-tokens/src/constants/design-token-tiers.ts';

export interface ConvertFigmaTokensOptions {
  readonly tokensPath: string;
  readonly outputDirectory: string;
}

export async function convertFigmaTokens({
  tokensPath,
  outputDirectory,
}: ConvertFigmaTokensOptions): Promise<void> {
  outputDirectory = removeTrailingSlash(outputDirectory);

  const tree: DesignTokensTree = ascendDesignTokensTreeCommonTypes(
    tokensBrueckeToDtcg(await readJsonFile(tokensPath)),
  );

  if (!isDesignTokensGroup(tree)) {
    throw new Error('Expected root to be a group.');
  }

  for (const [tier, figmaCollectionName] of DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTIONS.entries()) {
    const tokens: DesignTokensTree | undefined = Reflect.get(tree, figmaCollectionName);

    if (tier === T3_DIRNAME) {
      continue;
    }

    if (tokens === undefined) {
      throw new Error(`Expected tokens for tier ${tier} to be defined.`);
    }

    if (!isDesignTokensGroup(tokens)) {
      throw new Error(`Expected "${figmaCollectionName}" to be a group.`);
    }

    for (const [key, value] of Object.entries(tokens)) {
      const content: string = removeFigmaCollectionFromCurlyReferences(
        JSON.stringify(
          {
            [key]: value,
          },
          null,
          2,
        ),
      );

      await writeFileSafe(`${outputDirectory}/${tier}/${key}.tokens.json`, content, {
        encoding: 'utf-8',
      });
    }
  }
}

function removeFigmaCollectionFromCurlyReferences(input: string): string {
  for (const figmaCollectionName of DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTIONS.values()) {
    input = input.replaceAll(`"{${figmaCollectionName}.`, `"{`);
  }
  return input;
}
