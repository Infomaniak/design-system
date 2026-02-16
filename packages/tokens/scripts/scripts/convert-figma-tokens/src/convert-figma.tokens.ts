import { readJsonFile } from '../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { mapGetOrInsertComputed } from '../../../../../../scripts/helpers/misc/map/upsert.ts';
import { isObject } from '../../../../../../scripts/helpers/misc/object/is-object.ts';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { isCurlyReference } from '../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import type { DesignTokensTree } from '../../../shared/dtcg/design-token/tree/design-tokens-tree.ts';
import { removeDesignTokensTreeExtensions } from '../../../shared/dtcg/operations/pick-mode/remove-design-tokens-tree-extensions.ts';
import { removeDesignTokensTreeModes } from '../../../shared/dtcg/operations/pick-mode/remove-design-tokens-tree-modes.ts';
import { DesignTokensCollection } from '../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericDesignTokensCollectionToken } from '../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { tokensBrueckeToDtcg } from '../../../shared/tokens-bruecke/to/dtcg/tokens-bruecke-to-dtcg.ts';
import {
  DESIGN_TOKEN_TIERS,
  DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTION_NAMES,
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

  const root: DesignTokensTree = tokensBrueckeToDtcg(await readJsonFile(tokensPath));
  Reflect.deleteProperty(root, '$extensions');

  const rootCollection: DesignTokensCollection = new DesignTokensCollection().fromDesignTokensTree(
    root,
  );

  // search for modifiers
  const modifiers: Map<string /* modifier */, Set<string /* context*/>> = new Map([
    ['theme', new Set(['light', 'dark'])],
  ]);

  for (const token of rootCollection
    .tokens()
    .filter((token: GenericDesignTokensCollectionToken): boolean => {
      return !FIGMA_COLLECTION_NAMES_TO_DESIGN_TOKEN_TIERS.has(token.name[0]);
    })) {
    if (!isCurlyReference(token.value)) {
      throw new Error(
        `Expected token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} to be a curly reference.`,
      );
    }

    if (token.extensions === undefined || !isObject(token.extensions['mode'])) {
      throw new Error(
        `Expected token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} to have a $extensions with "mode".`,
      );
    }

    for (const mode of Object.keys(token.extensions['mode'] as Record<string, unknown>)) {
      mapGetOrInsertComputed(modifiers, token.name[0], () => new Set()).add(mode);
    }
  }

  // remove t1, t2, t3 prefixes
  const tokenNameToTierMap: Map<string, DesignTokenTier> = new Map();

  for (const tier of DESIGN_TOKEN_TIERS) {
    const figmaCollectionName: string = DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTION_NAMES.get(tier)!;

    for (const token of Array.from(
      rootCollection.tokens().filter((token: GenericDesignTokensCollectionToken): boolean => {
        return token.name[0] === figmaCollectionName;
      }),
    )) {
      const newName: ArrayDesignTokenName = token.name.slice(1);
      rootCollection.rename(token.name, newName);
      tokenNameToTierMap.set(JSON.stringify(newName), tier);
    }
  }

  // resolve and remove modifiers from the root collection
  for (const modifier of modifiers.keys()) {
    for (const token of Array.from(
      rootCollection.tokens().filter((token: GenericDesignTokensCollectionToken): boolean => {
        return token.name[0] === modifier;
      }),
    )) {
      if (!isCurlyReference(token.value)) {
        throw new Error(
          `Expected token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} to be a curly reference.`,
        );
      }

      rootCollection.rename(token.name, token.value, {
        onExitingTokenBehaviour: 'only-references',
      });

      // rootCollection.delete(token.name);
    }
  }

  await writeJsonFileSafe(`${outputDirectory}/tokens.json`, rootCollection.toJSON());

  // generate t1, t2, t3 files
  for (const tier of DESIGN_TOKEN_TIERS) {
    const newCollection = new DesignTokensCollection(
      rootCollection.tokens().filter((token: GenericDesignTokensCollectionToken): boolean => {
        return tokenNameToTierMap.get(JSON.stringify(token.name)) === tier;
      }),
    );

    const tokensGroupedByNamespaceMap: Map<string, DesignTokensCollection> = new Map();

    for (const token of newCollection.tokens()) {
      const groupName: string = token.name[0];

      const tokensGroupedByNamespaceCollection: DesignTokensCollection = mapGetOrInsertComputed(
        tokensGroupedByNamespaceMap,
        groupName,
        () => new DesignTokensCollection(),
      );

      tokensGroupedByNamespaceCollection.add(token);
    }

    for (const [
      groupName,
      tokensGroupedByNamespaceCollection,
    ] of tokensGroupedByNamespaceMap.entries()) {
      await writeJsonFileSafe(
        `${outputDirectory}/${tier}/${groupName}.tokens.json`,
        removeDesignTokensTreeModes(tokensGroupedByNamespaceCollection.toJSON()),
      );
    }
  }

  // generate modifier files
  for (const [modifier, contexts] of modifiers.entries()) {
    for (const context of contexts.values()) {
      const modifierCollection: DesignTokensCollection = new DesignTokensCollection(
        rootCollection
          .tokens()
          .filter((token: GenericDesignTokensCollectionToken): boolean => {
            return token.name[0] === modifier;
          })
          .map((token: GenericDesignTokensCollectionToken): GenericDesignTokensCollectionToken => {
            const value: unknown = (token.extensions!['mode'] as Record<string, unknown>)[
              context
            ] as unknown;

            if (!isCurlyReference(value)) {
              throw new Error(
                `Expected token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} $extension['mode'][${JSON.stringify(context)}] to be a curly reference.`,
              );
            }

            return {
              ...token,
              name: token.name.slice(1),
              value,
            };
          }),
      );

      await writeJsonFileSafe(
        `${outputDirectory}/modifiers/${modifier}/${context}.tokens.json`,
        removeDesignTokensTreeExtensions(modifierCollection.toJSON()),
      );
    }
  }
}
