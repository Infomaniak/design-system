import type { DurationDesignTokensCollectionToken } from '../../../../../../token/types/base/duration/duration-design-tokens-collection-token.ts';
import type { CssVariableDeclaration } from '../../../../css-variable-declaration/css-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToCssVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-css-variable-declaration.ts';
import { durationDesignTokensCollectionTokenValueToCssValue } from './value/duration-design-tokens-collection-token-value-to-css-value.ts';

export interface DurationDesignTokensCollectionTokenToCssVariableDeclarationOptions extends DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions {}

export function durationDesignTokensCollectionTokenToCssVariableDeclaration(
  token: DurationDesignTokensCollectionToken,
  options?: DurationDesignTokensCollectionTokenToCssVariableDeclarationOptions,
): CssVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToCssVariableDeclaration(
    token,
    durationDesignTokensCollectionTokenValueToCssValue,
    options,
  );
}
