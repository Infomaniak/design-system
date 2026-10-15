import type { LintContext } from '../context.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import type { VariableInfo } from '../model/variable-info.ts';

/**
 * Resolves the variable bound to the observed part, or `undefined` when the
 * part carries no binding or the binding cannot be resolved.
 *
 * Shared precondition of the rules that classify *bound* values: they stay
 * silent on missing/unresolvable bindings, which are flagged instead by the
 * `unbound-value` and `unresolved-binding` rules.
 */
export function resolveBoundVariable(
  observation: PropertyObservation,
  context: LintContext,
): VariableInfo | undefined {
  const boundVariableId: string | undefined = observation.part.boundVariableId;

  if (boundVariableId === undefined) {
    return undefined;
  }

  return context.resolveVariable(boundVariableId);
}
