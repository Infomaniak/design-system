import type { ArrayDesignTokenName } from '../../../../token/name/array-design-token-name.ts';
import type { GenerateCssVariableNameFunction } from './generate-css-variable-name-function.ts';

export const DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION: GenerateCssVariableNameFunction = (
  name: ArrayDesignTokenName,
): string => `--${name.join('-')}`;
