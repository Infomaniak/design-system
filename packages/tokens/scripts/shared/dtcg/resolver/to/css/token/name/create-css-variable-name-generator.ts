import type { ArrayDesignTokenName } from '../../../../token/name/array-design-token-name.ts';
import {
  arrayDesignTokenNameToCssVariableSegments,
  type ArrayDesignTokenNameToCssVariableSegmentsOptions,
} from './array-design-token-name-to-css-variable-segments.ts';
import type { GenerateCssVariableNameFunction } from './generate-css-variable-name-function.ts';

export interface CreateCssVariableNameGeneratorOptions extends ArrayDesignTokenNameToCssVariableSegmentsOptions {
  readonly prefix?: string;
}

export function createCssVariableNameGenerator({
  prefix = '',
  ...options
}: CreateCssVariableNameGeneratorOptions = {}): GenerateCssVariableNameFunction {
  if (prefix !== '' && !prefix.endsWith('-')) {
    prefix = `${prefix}-`;
  }
  return (name: ArrayDesignTokenName): string => {
    return `--${prefix}${arrayDesignTokenNameToCssVariableSegments(name, options)}`;
  };
}
