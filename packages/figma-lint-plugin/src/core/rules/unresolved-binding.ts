import type { LintContext } from '../context.ts';
import { partValueToLabel } from '../labels.ts';
import type { Finding } from '../model/finding.ts';
import { ALL_PROPERTY_KINDS } from '../model/lint-property.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import { resolveBoundVariable } from './resolve-bound-variable.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `unresolved-binding` (warning).
 *
 * A design token IS bound, but its variable cannot be resolved — it is neither in
 * the file's variables nor accessible from a published library. The other rules
 * cannot classify such bindings, so this rule makes the gap visible instead of
 * passing silently.
 */
export const unresolvedBindingRule: LintRule = {
  id: 'unresolved-binding',
  title: 'Unresolved token',
  severity: 'warning',
  appliesTo: ALL_PROPERTY_KINDS,
  evaluate: (observation: PropertyObservation, context: LintContext): readonly Finding[] => {
    // Unbound parts are `unbound-value`'s concern — this rule only sees bindings.
    if (observation.part.boundVariableId === undefined) {
      return [];
    }

    const variable = resolveBoundVariable(observation, context);

    if (variable !== undefined) {
      return [];
    }

    return [
      buildFinding(
        unresolvedBindingRule,
        observation,
        partValueToLabel(observation.part.value),
        'Bound token could not be resolved — the variable is neither in this file nor accessible from a published library.',
      ),
    ];
  },
};
