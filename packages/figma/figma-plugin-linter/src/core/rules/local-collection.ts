import type { LintContext } from '../context.ts';
import { resolveEffectiveVariable } from '../effective-variable.ts';
import { variableToLabel } from '../labels.ts';
import type { Finding } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import { resolveBoundVariable } from './resolve-bound-variable.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `local-collection` (warning).
 *
 * The effective binding (end of the alias chain) lives in a collection local
 * to the file — unpublished, so it will silently diverge from the token
 * library. Fires everywhere, including inside the design-system source file:
 * the only acceptable bindings come from published collections.
 *
 * Chains that dead-end (raw value, deleted target, cycle) stay silent — the
 * `unresolved-binding` rule reports those.
 *
 * Examples:
 * - local variable, well-named t2 or not → warning
 * - kit token aliasing a local t2 → warning (the chain ends locally)
 * - variable from a published library → pass
 */
export const localCollectionRule: LintRule = {
  id: 'local-collection',
  title: 'Local collection',
  severity: 'warning',
  appliesTo: ['fill', 'stroke', 'padding', 'gap', 'cornerRadius', 'strokeWeight', 'effect'],
  evaluate: (observation: PropertyObservation, context: LintContext): readonly Finding[] => {
    const boundVariable = resolveBoundVariable(observation, context);

    if (boundVariable === undefined) {
      return [];
    }

    const variable = resolveEffectiveVariable(boundVariable, context);

    if (variable === undefined || variable.remote) {
      return [];
    }

    const collection: string =
      variable.collectionName === '' ? 'a local collection' : `"${variable.collectionName}"`;

    return [
      buildFinding(
        localCollectionRule,
        observation,
        variableToLabel(variable),
        `Bound to a variable from ${collection}, which is local to this file — publish it to the token library.`,
      ),
    ];
  },
};
