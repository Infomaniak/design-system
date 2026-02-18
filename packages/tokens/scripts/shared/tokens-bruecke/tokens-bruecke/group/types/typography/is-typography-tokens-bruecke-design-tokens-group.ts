import { isObject } from '@vitest/utils/helpers';
import type { GenericTokensBrueckeDesignToken } from '../../../token/generic-tokens-bruecke-design-token.ts';
import { isTokensBrueckeDesignToken } from '../../../token/is-tokens-bruecke-design-token.ts';
import { isDimensionTokensBrueckeDesignToken } from '../../../token/types/dimension/is-dimension-tokens-bruecke-design-token.ts';
import { isStringTokensBrueckeDesignToken } from '../../../token/types/string/is-string-tokens-bruecke-design-token.ts';
import type { TokensBrueckeDesignTokensTree } from '../../../tree/tokens-bruecke-design-tokens-tree.ts';
import type { TokensBrueckeDesignTokensGroup } from '../../tokens-bruecke-design-tokens-group.ts';
import type { TypographyTokensBrueckeDesignTokensGroup } from './typography-tokens-bruecke-design-tokens-group.ts';

export function isTypographyTokensBrueckeDesignTokensGroup(
  input: TokensBrueckeDesignTokensGroup,
): input is TypographyTokensBrueckeDesignTokensGroup {
  const testMember = (
    name: string,
    validateMember: (input: GenericTokensBrueckeDesignToken) => boolean,
  ): boolean => {
    const token: unknown = Reflect.get(input, name);

    return (
      isObject(token) &&
      isTokensBrueckeDesignToken(token as TokensBrueckeDesignTokensTree) &&
      validateMember(token as GenericTokensBrueckeDesignToken)
    );
  };

  return (
    testMember('family', isStringTokensBrueckeDesignToken) &&
    testMember('weight', isStringTokensBrueckeDesignToken) &&
    testMember('size', isDimensionTokensBrueckeDesignToken) &&
    testMember('line-height', isDimensionTokensBrueckeDesignToken) &&
    testMember('letter-spacing', isDimensionTokensBrueckeDesignToken)
  );
}
