import { createKotlinVariableNameGenerator } from './create-kotlin-variable-name-generator.ts';
import type { GenerateKotlinVariableNameFunction } from './generate-kotlin-variable-name-function.ts';

export const DEFAULT_GENERATE_KOTLIN_VARIABLE_NAME_FUNCTION: GenerateKotlinVariableNameFunction =
  createKotlinVariableNameGenerator();
