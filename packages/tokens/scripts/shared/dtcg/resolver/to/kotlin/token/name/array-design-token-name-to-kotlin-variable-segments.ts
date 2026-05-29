import { toCamelCase } from '../../../../../../../../../../scripts/helpers/misc/case/to-camel-case/to-camel-case.ts';
import { toPascalCase } from '../../../../../../../../../../scripts/helpers/misc/case/to-pascal-case/to-pascal-case.ts';
import type { ArrayDesignTokenName } from '../../../../token/name/array-design-token-name.ts';

export interface ArrayDesignTokenNameToKotlinVariableSegmentsOptions {
  readonly textCase?: KotlinTextCase;
}

export type KotlinTextCase = 'pascal' | 'camel';

export function arrayDesignTokenNameToKotlinVariableSegments(
  name: ArrayDesignTokenName,
  { textCase = 'pascal' }: ArrayDesignTokenNameToKotlinVariableSegmentsOptions = {},
): string {
  const convertToCase = textCase === 'pascal' ? toPascalCase : toCamelCase;

  return convertToCase(name.join('-'));
}
