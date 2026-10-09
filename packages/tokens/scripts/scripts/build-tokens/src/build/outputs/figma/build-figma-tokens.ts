import { writeJsonFileSafe } from '../../../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { isCurlyReference } from '../../../../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../../../shared/dtcg/design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import { getTokensOfDesignTokensCollectionFilteredByPath } from '../../../../../../shared/dtcg/resolver/helpers/filter-by-path/get-tokens-of-design-tokens-collection-filtered-by-path.ts';
import type {
  DesignTokenContextEntry,
  DesignTokenContexts,
  DesignTokenModifiers,
} from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import { designTokensCollectionToFigmaDesignTokensGroup } from '../../../../../../shared/dtcg/resolver/to/figma/dtcg/design-tokens-collection-to-figma-design-tokens-group.ts';
import type { FigmaDesignTokensGroup } from '../../../../../../shared/dtcg/resolver/to/figma/figma/group/figma-design-tokens-group.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import {
  DESIGN_TOKEN_TIERS,
  DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTION_NAMES,
  type DesignTokenTier,
  FIGMA_T1_COLLECTION_NAME,
  FIGMA_T2_COLLECTION_NAME,
  FIGMA_T3_COLLECTION_NAME,
} from '../../../constants/design-token-tiers.ts';

export interface BuildFigmaTokensOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly modifiers: DesignTokenModifiers;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export function buildFigmaTokens({
  baseCollection,
  modifiers,
  outputDirectory,
  logger,
}: BuildFigmaTokensOptions): Promise<void> {
  return logger.asyncTask('figma', async (): Promise<void> => {
    const figmaBaseCollection: DesignTokensCollection = baseCollection.clone();

    const modifiedTokens: Map<string /* token name */, string /* modifier */> = new Map();

    /*
     NOTES:
       modifiers override existing tokens, however, in figma, modifiers must form a chain:
         - t2, t3 must point to a modifier
         - references to a modified token must point to a modifier
         - this forms a chain, ex: t2 -> product -> theme -> t1
    */

    // for each modifier -> context -> token => add the token in the collection with the associated mode
    for (const [modifier, contexts] of modifiers.entries()) {
      for (const [context, collection] of sortDesignTokenContextEntries(modifier, contexts)) {
        for (const modifierToken of getTokensOfDesignTokensCollectionFilteredByPath(
          collection,
          `${modifier}/${context}`,
        )) {
          const tokenName: ArrayDesignTokenName = modifierToken.name;
          const tokenNameAsCurlyReference: string =
            DesignTokensCollection.arrayDesignTokenNameToCurlyReference(tokenName);

          const newModifierTokenName: ArrayDesignTokenName = [modifier, ...tokenName];

          if (!isCurlyReference(modifierToken.value)) {
            throw new Error(
              `<modifier>(${modifier}), <context>(${context}), <token>(${tokenNameAsCurlyReference}): token's value must be a curly reference.`,
            );
          }

          const mode: Record<string, string> = {
            ...(figmaBaseCollection.getOptional(newModifierTokenName)?.extensions?.['mode'] as
              object | undefined),
            [context]: modifierToken.value,
          };

          figmaBaseCollection.set({
            ...modifierToken,
            value: modifierToken.value,
            name: newModifierTokenName,
            extensions: {
              ...modifierToken.extensions,
              mode,
            },
          });

          if (modifiedTokens.has(tokenNameAsCurlyReference)) {
            if (modifiedTokens.get(tokenNameAsCurlyReference) !== modifier) {
              throw new Error(
                `<modifier>(${modifier}), <context>(${context}), <token>(${tokenNameAsCurlyReference}): token's already modified.`,
              );
            }
          } else {
            modifiedTokens.set(tokenNameAsCurlyReference, modifier);

            const modifiedToken: GenericDesignTokensCollectionToken =
              figmaBaseCollection.get(tokenName);

            figmaBaseCollection.set({
              ...modifiedToken,
              value: segmentsReferenceToCurlyReference(newModifierTokenName),
            });
          }
        }
      }
    }

    // handle "$root" tokens
    {
      const rootTokens: Set<GenericDesignTokensCollectionToken> = new Set();

      for (const tokenA of figmaBaseCollection.tokens()) {
        for (const tokenB of figmaBaseCollection.tokens()) {
          if (DesignTokensCollection.isRootTokenNameOf(tokenA.name, tokenB.name)) {
            // tokenA is a $root token of tokenB
            rootTokens.add(tokenA);
            break;
          }
        }
      }

      for (const token of rootTokens) {
        figmaBaseCollection.rename(token.name, [...token.name, '@root']);
      }
    }

    // restore "@root" tokens
    for (const token of Array.from(figmaBaseCollection.tokens())) {
      if (token.extensions !== undefined && Reflect.has(token.extensions, 'figmaName')) {
        let figmaName: readonly string[] = Reflect.get(
          token.extensions,
          'figmaName',
        ) as readonly string[];

        if (modifiers.has(token.name[0])) {
          figmaName = [token.name[0], ...figmaName];
        }

        figmaBaseCollection.rename(token.name, figmaName);
      }
    }

    // group tokens by tier
    for (const token of Array.from(figmaBaseCollection.tokens().filter(tokenBelongsToATier))) {
      const tier: DesignTokenTier | undefined = DESIGN_TOKEN_TIERS.find((tier: string): boolean => {
        return token.files.some((path: string): boolean => path.includes(tier));
      });

      if (tier === undefined) {
        throw new Error(
          `Token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} does not belong to a tier.`,
        );
      }

      figmaBaseCollection.rename(token.name, [
        DESIGN_TOKEN_TIERS_TO_FIGMA_COLLECTION_NAMES.get(tier)!,
        ...token.name,
      ]);
    }

    // convert collection to figma format
    const {
      [FIGMA_T1_COLLECTION_NAME]: t1,
      [FIGMA_T2_COLLECTION_NAME]: t2,
      [FIGMA_T3_COLLECTION_NAME]: t3,
      ...figmaModifiers
    }: FigmaDesignTokensGroup = designTokensCollectionToFigmaDesignTokensGroup(figmaBaseCollection);

    // re-order tokens
    const figmaTokens: FigmaDesignTokensGroup = {
      t1,
      t2,
      t3,
      ...figmaModifiers,
    };

    await writeJsonFileSafe(`${outputDirectory}/figma.tokens.json`, figmaTokens);
  });
}

/*---*/

function tokenBelongsToATier(token: GenericDesignTokensCollectionToken): boolean {
  return !token.files.some((path: string): boolean => path.includes('modifiers'));
}

/**
 * Sorts the design token contexts to have 'light' and 'infomaniak' as first "modes".
 *
 * This helps UX designers as _default_ values/modes.
 */
function sortDesignTokenContextEntries(
  modifier: string,
  contexts: DesignTokenContexts,
): IteratorObject<DesignTokenContextEntry> {
  switch (modifier) {
    case 'theme':
      return (function* () {
        yield* Array.from(contexts.entries()).sort(
          ([a]: DesignTokenContextEntry, [b]: DesignTokenContextEntry) => {
            if (a === 'light') {
              return -1;
            } else if (b === 'light') {
              return 1;
            } else {
              return 0;
            }
          },
        );
      })();
    case 'product':
      return (function* () {
        yield* Array.from(contexts.entries()).sort(
          ([a]: DesignTokenContextEntry, [b]: DesignTokenContextEntry) => {
            if (a === 'infomaniak') {
              return -1;
            } else if (b === 'infomaniak') {
              return 1;
            } else {
              return 0;
            }
          },
        );
      })();
    default:
      return contexts.entries();
  }
}
