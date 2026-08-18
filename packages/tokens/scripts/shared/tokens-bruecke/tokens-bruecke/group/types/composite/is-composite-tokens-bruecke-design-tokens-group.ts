import { isObject } from '@vitest/utils/helpers';
import type { GenericTokensBrueckeDesignToken } from '../../../token/generic-tokens-bruecke-design-token.ts';
import { isTokensBrueckeDesignToken } from '../../../token/is-tokens-bruecke-design-token.ts';
import type { TokensBrueckeDesignTokensTree } from '../../../tree/tokens-bruecke-design-tokens-tree.ts';
import type { TokensBrueckeDesignTokensGroup } from '../../tokens-bruecke-design-tokens-group.ts';

export type IsCompositeTokensBrueckeDesignTokensGroupRecord<
  GCompositeToken extends TokensBrueckeDesignTokensGroup,
> = {
  [
    GKey in Exclude<keyof GCompositeToken, keyof TokensBrueckeDesignTokensGroup>
  ]: GCompositeToken[GKey] extends GenericTokensBrueckeDesignToken
    ? (input: GenericTokensBrueckeDesignToken) => input is GCompositeToken[GKey]
    : never;
};

export function isCompositeTokensBrueckeDesignTokensGroup<
  GCompositeToken extends TokensBrueckeDesignTokensGroup,
>(
  input: TokensBrueckeDesignTokensGroup,
  members: IsCompositeTokensBrueckeDesignTokensGroupRecord<GCompositeToken>,
): input is GCompositeToken {
  return Object.entries<(input: GenericTokensBrueckeDesignToken) => boolean>(members).every(
    ([name, validateMember]: [string, (input: GenericTokensBrueckeDesignToken) => boolean]) => {
      const token: unknown = Reflect.get(input, name);

      return (
        isObject(token) &&
        isTokensBrueckeDesignToken(token as TokensBrueckeDesignTokensTree) &&
        validateMember(token as GenericTokensBrueckeDesignToken)
      );
    },
  );
}
