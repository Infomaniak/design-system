import type { LintContext } from './context.ts';
import type { VariableInfo } from './model/variable-info.ts';

/**
 * Maximum number of alias hops followed when resolving a variable to its
 * effective (known-tier) target — guards against pathological chains. Kept in
 * sync with the metadata loader's expansion cap.
 */
export const MAX_ALIAS_CHAIN_DEPTH: number = 5;

/**
 * Resolves a bound variable to the first variable with a known tier (t1/t2/t3)
 * along its alias chain — the DS token it effectively points to.
 *
 * - a variable whose own tier is known is returned as-is (no chain walking)
 * - returns undefined when the chain stays unknown: raw value, unresolvable
 *   target, alias cycle, or the depth cap is exceeded
 *
 * The alias chain is what lets third-party tokens (e.g. a kit's `foreground`)
 * be accepted: they are accepted exactly when they resolve to a DS token.
 */
export function resolveEffectiveVariable(
  variable: VariableInfo,
  context: LintContext,
): VariableInfo | undefined {
  if (variable.tier !== 'unknown') {
    return variable;
  }

  const visited: Set<string> = new Set([variable.id]);
  let current: VariableInfo = variable;

  for (let depth: number = 0; depth < MAX_ALIAS_CHAIN_DEPTH; depth += 1) {
    if (current.aliasTargetId === undefined || visited.has(current.aliasTargetId)) {
      return undefined;
    }

    const next: VariableInfo | undefined = context.resolveVariable(current.aliasTargetId);

    if (next === undefined) {
      return undefined;
    }

    if (next.tier !== 'unknown') {
      return next;
    }

    visited.add(next.id);
    current = next;
  }

  return undefined;
}
