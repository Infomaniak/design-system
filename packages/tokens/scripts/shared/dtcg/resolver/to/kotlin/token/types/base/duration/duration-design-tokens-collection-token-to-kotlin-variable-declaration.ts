import type { DurationDesignTokensCollectionToken } from '../../../../../../token/types/base/duration/duration-design-tokens-collection-token.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import { durationDesignTokensCollectionTokenValueToKotlinValue } from './value/duration-design-tokens-collection-token-value-to-kotlin-value.ts';

export type DurationDesignTokensCollectionTokenToKotlinVariableDeclarationOptions =
  DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions;

export function durationDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: DurationDesignTokensCollectionToken,
  options?: DurationDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    durationDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );
}
