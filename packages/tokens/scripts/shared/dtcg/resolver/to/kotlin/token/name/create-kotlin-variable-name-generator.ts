import type { ArrayDesignTokenName } from '../../../../token/name/array-design-token-name.ts';
import {
  arrayDesignTokenNameToKotlinVariableSegments,
  type ArrayDesignTokenNameToKotlinVariableSegmentsOptions,
} from './array-design-token-name-to-kotlin-variable-segments.ts';
import type { GenerateKotlinVariableNameFunction } from './generate-kotlin-variable-name-function.ts';

export interface CreateKotlinVariableNameGeneratorOptions extends ArrayDesignTokenNameToKotlinVariableSegmentsOptions {
  readonly prefix?: string;
}

export function createKotlinVariableNameGenerator({
  prefix = '',
  ...options
}: CreateKotlinVariableNameGeneratorOptions = {}): GenerateKotlinVariableNameFunction {
  return (name: ArrayDesignTokenName): string => {
    const newName: string = arrayDesignTokenNameToKotlinVariableSegments(name, options);

    return prefix === '' ? newName : `${prefix}${newName.at(0)!.toUpperCase()}${newName.slice(1)}`;
  };
}
