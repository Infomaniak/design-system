import { readJsonFile } from '../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { mapGetOrInsertComputed } from '../../../../../../scripts/helpers/misc/map/upsert.ts';
import { isObject } from '../../../../../../scripts/helpers/misc/object/is-object.ts';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { isCurlyReference } from '../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import type { DesignTokensTree } from '../../../shared/dtcg/design-token/tree/design-tokens-tree.ts';
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

  // the list of modifiers present in the Figma file
  const modifiers: Map<string /* modifier */, Set<string /* context */>> = new Map([
    ['theme', new Set(['light', 'dark'])],
  ]);

  // search for modifiers
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

  // a map from a token name to it's belonging tier
  const tokenNameToTierMap: Map<string, DesignTokenTier> = new Map();

  // the "main" collection
  const mainCollection: DesignTokensCollection = rootCollection.clone();

  // remove t1, t2, t3 prefixes from the main collection
  for (const tier of DESIGN_TOKEN_TIERS) {
    const figmaCollectionName: string = DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTION_NAMES.get(tier)!;

    for (const token of rootCollection
      .tokens()
      .filter((token: GenericDesignTokensCollectionToken): boolean => {
        return token.name[0] === figmaCollectionName;
      })) {
      const newName: ArrayDesignTokenName = token.name.slice(1);
      mainCollection.rename(token.name, newName, {
        onExitingTokenBehaviour: 'throw',
      });
      tokenNameToTierMap.set(JSON.stringify(newName), tier);
    }
  }

  for (const [modifier, contexts] of modifiers.entries()) {
    for (const context of contexts.values()) {
      // the list of tokens participating in the modifier
      const tokensParticipatingInThisModifier: Set<string> = new Set(
        mainCollection
          .tokens()
          .filter((token: GenericDesignTokensCollectionToken): boolean => {
            return isTokenPartOfModifier(token, modifier);
          })
          .map((token: GenericDesignTokensCollectionToken): string => {
            return JSON.stringify(token.name);
          }),
      );

      // the main collection resolved with the specified modifier and context
      const contextualizedCollection: DesignTokensCollection = new DesignTokensCollection(
        mainCollection
          .tokens()
          .map(
            ({
              extensions,
              ...token
            }: GenericDesignTokensCollectionToken): GenericDesignTokensCollectionToken => {
              if (tokensParticipatingInThisModifier.has(JSON.stringify(token.name))) {
                return {
                  ...token,
                  value:
                    (extensions?.['mode'] as Record<string, unknown> | undefined)?.[context] ??
                    token.value,
                };
              } else {
                return token;
              }
            },
          ),
      );

      // the list of tokens to put in the modifier file
      const tokensOfTheModifier: Set<string> = new Set(
        modifier === 'theme' ? tokensParticipatingInThisModifier.values() : [],
      );

      // resolve and remove modifiers from the contextualized collection
      for (const modifierToResolve of modifiers.keys()) {
        if (modifierToResolve === 'theme') {
          continue;
        }

        for (const token of Array.from(
          contextualizedCollection
            .tokens()
            .filter((token: GenericDesignTokensCollectionToken): boolean => {
              return token.name[0] === modifierToResolve;
            }),
        )) {
          if (!isCurlyReference(token.value)) {
            throw new Error(
              `Expected token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} to be a curly reference.`,
            );
          }

          for (const referencedToken of contextualizedCollection.getTokensDirectlyReferencing(
            token.name,
          )) {
            const key: string = JSON.stringify(referencedToken.name);
            const tier: string | undefined = tokenNameToTierMap.get(key);
            if (tier !== undefined) {
              tokensOfTheModifier.add(key);
            }
          }

          contextualizedCollection.rename(token.name, token.value, {
            onExitingTokenBehaviour: 'only-references',
          });

          contextualizedCollection.delete(token.name);
        }
      }

      const modifierCollection = new DesignTokensCollection(
        tokensOfTheModifier.values().map((name: string): GenericDesignTokensCollectionToken => {
          return contextualizedCollection.get(JSON.parse(name) as ArrayDesignTokenName);
        }),
      );

      await writeJsonFileSafe(
        `${outputDirectory}/modifiers/${modifier}/${context}.tokens.json`,
        modifierCollection.toJSON(),
      );
    }
  }

  // resolve and remove modifiers from the main collection
  resolveModifiersFromCollection(mainCollection, modifiers.keys());

  // await writeJsonFileSafe(`${outputDirectory}/main.tokens.json`, mainCollection.toJSON());

  // generate t1, t2, t3 files
  for (const tier of DESIGN_TOKEN_TIERS) {
    const mainCollectionOfTier = new DesignTokensCollection(
      mainCollection.tokens().filter((token: GenericDesignTokensCollectionToken): boolean => {
        return tokenNameToTierMap.get(JSON.stringify(token.name)) === tier;
      }),
    );

    const tokensGroupedByNamespaceMap: Map<string, DesignTokensCollection> = new Map();

    for (const token of mainCollectionOfTier.tokens()) {
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
}

/* INTERNAL */

function isTokenPartOfModifier(
  token: GenericDesignTokensCollectionToken,
  modifier: string,
): boolean {
  return modifier === 'theme'
    ? isObject(token.extensions?.['mode']) &&
        (token.extensions['mode'] as Record<string, unknown>)['light'] !== undefined &&
        (token.extensions['mode'] as Record<string, unknown>)['light'] !==
          (token.extensions['mode'] as Record<string, unknown>)['dark']
    : token.name[0] === modifier;
}

/**
 * Resolves and removes modifiers from the collection
 */
function resolveModifiersFromCollection(
  collection: DesignTokensCollection,
  modifiers: Iterable<string>,
): void {
  for (const modifier of modifiers) {
    for (const token of Array.from(
      collection.tokens().filter((token: GenericDesignTokensCollectionToken): boolean => {
        return token.name[0] === modifier;
      }),
    )) {
      if (!isCurlyReference(token.value)) {
        throw new Error(
          `Expected token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} to be a curly reference.`,
        );
      }

      collection.rename(token.name, token.value, {
        onExitingTokenBehaviour: 'only-references',
      });

      collection.delete(token.name);
    }
  }
}
