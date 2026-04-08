import { writeJsonFileSafe } from '../../../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { isCurlyReference } from '../../../../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../../../shared/dtcg/design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import { getTokensOfDesignTokensCollectionFilteredByPath } from '../../../../../../shared/dtcg/resolver/helpers/filter-by-path/get-tokens-of-design-tokens-collection-filtered-by-path.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
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
  T1_DIRECTORY_NAME,
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

    // for each modifier -> context -> token => add the token in the collection with the associated mode
    for (const [modifier, contexts] of modifiers.entries()) {
      for (const [context, collection] of contexts.entries()) {
        for (const token of getTokensOfDesignTokensCollectionFilteredByPath(
          collection,
          `${modifier}/${context}`,
        )) {
          const newName: ArrayDesignTokenName = [modifier, ...token.name];

          if (!isCurlyReference(token.value)) {
            throw new Error(
              `<modifier>(${modifier}), <context>(${context}), <token>(${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)}): token's value must be a curly reference.`,
            );
          }

          const mode: Record<string, string> = {
            ...(figmaBaseCollection.getOptional(newName)?.extensions?.['mode'] as
              | object
              | undefined),
            [context]: token.value,
          };

          figmaBaseCollection.set({
            ...token,
            name: newName,
            extensions: {
              ...token.extensions,
              mode,
            },
          });
        }
      }
    }

    /*
      NOTES:
        modifiers override existing tokens, however, in figma, modifiers must form a chain:
          - t2, t3 must point to a modifier
          - references to a modified token must point to a modifier
          - this forms a chain, ex: t2 -> product -> theme -> t1
     */

    // for each modifier -> context -> token => make existing tokens point to the corresponding modifier
    for (const [modifier, contexts] of modifiers.entries()) {
      for (const [context, collection] of contexts.entries()) {
        for (const token of getTokensOfDesignTokensCollectionFilteredByPath(
          collection,
          `${modifier}/${context}`,
        )) {
          const existingToken: GenericDesignTokensCollectionToken | undefined =
            figmaBaseCollection.getOptional(token.name);

          if (existingToken !== undefined) {
            if (!isCurlyReference(existingToken.value)) {
              throw new Error(
                `<modifier>(${modifier}), <context>(${context}), <token>(${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)}): token's value must be a curly reference.`,
              );
            }

            if (
              !tokenBelongsToATier(existingToken) &&
              !existingToken.files.some((path: string): boolean => path.includes(T1_DIRECTORY_NAME))
            ) {
              throw new Error(
                `<modifier>(${modifier}), <context>(${context}), <token>(${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)}): expected t2 or t3 token.`,
              );
            }

            // t2, t3 tokens must point to the modifier
            figmaBaseCollection.set({
              ...existingToken,
              value: segmentsReferenceToCurlyReference([modifier, ...existingToken.name]),
            });
          }

          // references to this token must point now on the modifier
          figmaBaseCollection.rename(token.name, [modifier, ...token.name], {
            onExistingTokenBehaviour: 'only-references',
          });
        }
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
