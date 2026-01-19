import type { DesignTokensCollectionTokenWithType } from '../../../token/design-tokens-collection-token.ts';
import type { CssVariableDeclaration } from '../css-variable-declaration.ts';
import {
  valueOrCurlyReferenceToCssVariableReference,
  type ValueOrCurlyReferenceToCssVariableReferenceOptions,
} from '../reference/value-or-curly-reference-to-css-variable-reference.ts';
import { DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION } from './name/default-generate-css-variable-name-function.ts';
import type { GenerateCssVariableNameFunction } from './name/generate-css-variable-name-function.ts';

export interface DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions extends ValueOrCurlyReferenceToCssVariableReferenceOptions {
  readonly generateCssVariableName?: GenerateCssVariableNameFunction;
}

export function designTokensCollectionTokenWithMapValueToCssVariableDeclaration<GValue>(
  token: DesignTokensCollectionTokenWithType<string, GValue>,
  mapValue: (value: GValue) => string,
  {
    generateCssVariableName = DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION,
  }: DesignTokensCollectionTokenWithMapValueToCssVariableDeclarationOptions = {},
): CssVariableDeclaration {
  return {
    name: generateCssVariableName(token.name),
    value: valueOrCurlyReferenceToCssVariableReference(token.value, mapValue, {
      generateCssVariableName,
    }),
    description: token.description,
    deprecated: token.deprecated,
  };
}
