import type { KotlinVariableDeclarationValue } from './value/kotlin-variable-declaration-value.ts';

export interface KotlinVariableDeclaration {
  readonly name: string;
  readonly value: KotlinVariableDeclarationValue;
  readonly description?: string;
  readonly deprecated?: boolean | string;
}
