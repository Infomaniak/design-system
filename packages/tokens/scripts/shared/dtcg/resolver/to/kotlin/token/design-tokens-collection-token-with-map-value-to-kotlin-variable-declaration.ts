import type { DesignTokensCollectionTokenWithType } from '../../../token/design-tokens-collection-token.ts';
import type { KotlinVariableDeclaration } from '../kotlin-variable-declaration/kotlin-variable-declaration.ts';
import type { KotlinVariableDeclarationValue } from '../kotlin-variable-declaration/value/kotlin-variable-declaration-value.ts';
import {
  valueOrCurlyReferenceToKotlinVariableReference,
  type ValueOrCurlyReferenceToKotlinVariableReferenceOptions,
} from '../reference/value-or-curly-reference-to-kotlin-variable-reference.ts';
import { DEFAULT_GENERATE_KOTLIN_VARIABLE_NAME_FUNCTION } from './name/default-generate-kotlin-variable-name-function.ts';
import type { GenerateKotlinVariableNameFunction } from './name/generate-kotlin-variable-name-function.ts';

export interface DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions extends ValueOrCurlyReferenceToKotlinVariableReferenceOptions {
  readonly generateKotlinVariableName?: GenerateKotlinVariableNameFunction;
}

export function designTokensCollectionTokenWithMapValueToKotlinVariableDeclaration<GValue>(
  token: DesignTokensCollectionTokenWithType<string, GValue>,
  mapValue: (value: GValue) => KotlinVariableDeclarationValue,
  {
    generateKotlinVariableName = DEFAULT_GENERATE_KOTLIN_VARIABLE_NAME_FUNCTION,
  }: DesignTokensCollectionTokenWithMapValueToKotlinVariableDeclarationOptions = {},
): KotlinVariableDeclaration {
  return {
    name: generateKotlinVariableName(token.name),
    value: valueOrCurlyReferenceToKotlinVariableReference(token.value, mapValue, {
      generateKotlinVariableName,
    }),
    description: token.description,
    deprecated: token.deprecated,
  };
}
