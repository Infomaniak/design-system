import { createCssVariableNameGenerator } from './create-css-variable-name-generator.ts';
import type { GenerateCssVariableNameFunction } from './generate-css-variable-name-function.ts';

export const DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION: GenerateCssVariableNameFunction =
  createCssVariableNameGenerator();
