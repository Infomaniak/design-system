import { DesignTokensCollection } from '../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import { getTokensOfDesignTokensCollectionFilteredByPath } from '../../../../../shared/dtcg/resolver/helpers/filter-by-path/get-tokens-of-design-tokens-collection-filtered-by-path.ts';
import type { DesignTokenModifiers } from '../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import {
  T1_DIRECTORY_NAME,
  T2_DIRECTORY_NAME,
  T3_DIRECTORY_NAME,
} from '../../constants/design-token-tiers.ts';

export function validateModifiers(modifiers: DesignTokenModifiers): void {
  const tokenNameToModifier: Map<string, string> = new Map();

  for (const [modifier, contexts] of modifiers.entries()) {
    // the list of token names used by this modifier
    const tokenNamesOfThisModifier: Set<string> = new Set();
    let tokenNamesOfThisModifierInitialized: boolean = false;

    for (const [context, collection] of contexts.entries()) {
      let tokensCount: number = 0;

      for (const token of getTokensOfDesignTokensCollectionFilteredByPath(
        collection,
        `${modifier}/${context}`,
      )) {
        tokensCount++;

        const asCurlyReference: string =
          DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name);

        // check if the modifiers contain only existing tokens (present in t2 and t3)
        if (
          !token.files.some((path: string): boolean => {
            return (
              path.includes(T1_DIRECTORY_NAME) ||
              path.includes(T2_DIRECTORY_NAME) ||
              path.includes(T3_DIRECTORY_NAME)
            );
          })
        ) {
          throw new Error(
            `<modifier>(${modifier}), <context>(${context}), <token>(${asCurlyReference}): token is not present in t1, t2 or t3.`,
          );
        }

        if (tokenNamesOfThisModifierInitialized) {
          // check that contexts of a single modifier contain the same list of tokens
          if (!tokenNamesOfThisModifier.has(asCurlyReference)) {
            throw new Error(
              `<modifier>(${modifier}), <context>(${context}), <token>(${asCurlyReference}): contexts do not share this token.`,
            );
          }
        } else {
          tokenNamesOfThisModifier.add(asCurlyReference);

          // check if many modifiers do not modify the same token
          if (tokenNameToModifier.has(asCurlyReference)) {
            throw new Error(
              `<modifier>(${modifier}), <context>(${context}), <token>(${asCurlyReference}): this token is already used by the modifier ${JSON.stringify(tokenNameToModifier.get(asCurlyReference))}`,
            );
          } else {
            tokenNameToModifier.set(asCurlyReference, modifier);
          }
        }
      }

      if (tokenNamesOfThisModifierInitialized) {
        if (tokensCount !== tokenNamesOfThisModifier.size) {
          throw new Error(
            `<modifier>(${modifier}), <context>(${context}): contexts do not share the same number of tokens.`,
          );
        }
      } else {
        tokenNamesOfThisModifierInitialized = true;
      }
    }
  }
}
