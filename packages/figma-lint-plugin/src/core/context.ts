import type { VariableInfo } from './model/variable-info.ts';

export interface LintContext {
  resolveVariable(variableId: string): VariableInfo | undefined;
}

export function createLintContext(variablesById: ReadonlyMap<string, VariableInfo>): LintContext {
  return {
    resolveVariable: (variableId: string): VariableInfo | undefined =>
      variablesById.get(variableId),
  };
}
