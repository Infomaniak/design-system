import { readJsonFile } from '../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeFileSafe } from '../../../../../../scripts/helpers/file/write-file-safe.ts';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { removeDesignTokensTreeModes } from '../../../shared/dtcg/operations/pick-mode/remove-design-tokens-tree-modes.ts';
import { DesignTokensCollection } from '../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericDesignTokensCollectionToken } from '../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { tokensBrueckeToDtcg } from '../../../shared/tokens-bruecke/to/dtcg/tokens-bruecke-to-dtcg.ts';
import {
  DESIGN_TOKEN_TIERS,
  type DesignTokenTier,
  FIGMA_COLLECTION_NAMES_TO_DESIGN_TOKEN_TIERS,
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

  const collection: DesignTokensCollection = new DesignTokensCollection().fromDesignTokensTree(
    tokensBrueckeToDtcg(await readJsonFile(tokensPath)),
  );

  const tokenNameToTierMap: Map<string, DesignTokenTier> = new Map();

  // 1) rename tokens
  for (const token of collection.tokens()) {
    const figmaCollectionName: string = token.name[0];

    if (FIGMA_COLLECTION_NAMES_TO_DESIGN_TOKEN_TIERS.has(figmaCollectionName)) {
      const newName: ArrayDesignTokenName = token.name.slice(1);
      collection.rename(token.name, newName);

      tokenNameToTierMap.set(
        JSON.stringify(newName),
        FIGMA_COLLECTION_NAMES_TO_DESIGN_TOKEN_TIERS.get(figmaCollectionName)!,
      );
    }
  }

  // 2) generate tiers
  for (const tier of DESIGN_TOKEN_TIERS) {
    const newCollection = new DesignTokensCollection(
      collection.tokens().filter((token: GenericDesignTokensCollectionToken): boolean => {
        return tokenNameToTierMap.get(JSON.stringify(token.name)) === tier;
      }),
    );

    const tokensGroupedByNamespaceMap: Map<string, DesignTokensCollection> = new Map();

    for (const token of newCollection.tokens()) {
      const groupName: string = token.name[0];
      let tokensGroupedByNamespaceCollection: DesignTokensCollection | undefined =
        tokensGroupedByNamespaceMap.get(groupName);

      if (tokensGroupedByNamespaceCollection === undefined) {
        tokensGroupedByNamespaceCollection = new DesignTokensCollection();
        tokensGroupedByNamespaceMap.set(groupName, tokensGroupedByNamespaceCollection);
      }
      tokensGroupedByNamespaceCollection.add(token);
    }

    for (const [
      groupName,
      tokensGroupedByNamespaceCollection,
    ] of tokensGroupedByNamespaceMap.entries()) {
      await writeFileSafe(
        `${outputDirectory}/${tier}/${groupName}.tokens.json`,
        JSON.stringify(
          removeDesignTokensTreeModes(tokensGroupedByNamespaceCollection.toJSON()),
          null,
          2,
        ),
        {
          encoding: 'utf-8',
        },
      );
    }
  }

  // for (const theme of FIGMA_THEMES) {
  //   const tokensByCollection: DesignTokensTree = Reflect.get(
  //     tree,
  //     DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTIONS.get(T2_DIRECTORY_NAME)!,
  //   )!;
  //
  //   const tokens: DesignTokensTree | undefined = pickDesignTokensTreeModeAsModifier(
  //     tokensByCollection,
  //     theme,
  //   );
  //
  //   if (tokens === undefined || !isDesignTokensGroup(tokens)) {
  //     throw new Error('Expected root to be a group.');
  //   }
  //
  //   const content: string = removeFigmaCollectionFromCurlyReferences(
  //     JSON.stringify(tokens, null, 2),
  //   );
  //
  //   await writeFileSafe(`${outputDirectory}/modifiers/theme/${theme}.tokens.json`, content, {
  //     encoding: 'utf-8',
  //   });
  // }

  // FIGMA_PRODUCT_COLLECTION
}

// function removeFigmaCollectionFromCurlyReferences(input: string): string {
//   input = input.replaceAll(`"{${FIGMA_PRODUCT_COLLECTION_NAME}.`, `"{color.`);
//
//   for (const figmaCollectionName of DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTION_NAMES.values()) {
//     input = input.replaceAll(`"{${figmaCollectionName}.`, `"{`);
//   }
//   return input;
// }
