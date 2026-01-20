import type { ArrayDesignTokenName } from '../../../../token/name/array-design-token-name.ts';
import type { GenerateCssVariableNameFunction } from './generate-css-variable-name-function.ts';

export function createCssVariableNameGenerator(
  prefix: string = '',
): GenerateCssVariableNameFunction {
  if (prefix !== '' && !prefix.endsWith('-')) {
    prefix = `${prefix}-`;
  }
  return (name: ArrayDesignTokenName): string => `--${prefix}${name.join('-')}`;
}
