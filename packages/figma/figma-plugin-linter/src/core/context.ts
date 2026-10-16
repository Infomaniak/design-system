import type { EffectStyleInfo } from './model/effect-style-info.ts';
import type { TextStyleInfo } from './model/text-style-info.ts';
import type { VariableInfo } from './model/variable-info.ts';

export interface LintContext {
  /** Read-only view of the run's variable metadata (id → info with values). */
  readonly variablesById: ReadonlyMap<string, VariableInfo>;
  resolveVariable(variableId: string): VariableInfo | undefined;
  resolveEffectStyle(styleId: string): EffectStyleInfo | undefined;
  resolveTextStyle(styleId: string): TextStyleInfo | undefined;
}

export function createLintContext(
  variablesById: ReadonlyMap<string, VariableInfo>,
  effectStylesById: ReadonlyMap<string, EffectStyleInfo> = new Map(),
  textStylesById: ReadonlyMap<string, TextStyleInfo> = new Map(),
): LintContext {
  return {
    variablesById,
    resolveVariable: (variableId: string): VariableInfo | undefined =>
      variablesById.get(variableId),
    resolveEffectStyle: (styleId: string): EffectStyleInfo | undefined =>
      effectStylesById.get(styleId),
    resolveTextStyle: (styleId: string): TextStyleInfo | undefined => textStylesById.get(styleId),
  };
}
