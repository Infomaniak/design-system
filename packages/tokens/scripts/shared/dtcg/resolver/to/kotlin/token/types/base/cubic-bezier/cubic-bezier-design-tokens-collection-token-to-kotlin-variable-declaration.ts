import type { CubicBezierDesignTokensCollectionToken } from '../../../../../../token/types/base/cubic-bezier/cubic-bezier-design-tokens-collection-token.ts';
import type { KotlinVariableDeclaration } from '../../../../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import {
  designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions,
} from '../../../design-tokens-collection-token-with-map-value-to-kotlin-variable-declaration.ts';
import { cubicBezierDesignTokensCollectionTokenValueToKotlinValue } from './value/cubic-bezier-design-tokens-collection-token-value-to-kotlin-value.ts';

export type CubicBezierDesignTokensCollectionTokenToKotlinVariableDeclarationOptions =
  DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions;

export function cubicBezierDesignTokensCollectionTokenToKotlinVariableDeclaration(
  token: CubicBezierDesignTokensCollectionToken,
  options?: CubicBezierDesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  return designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration(
    token,
    cubicBezierDesignTokensCollectionTokenValueToKotlinValue,
    options,
  );
}
