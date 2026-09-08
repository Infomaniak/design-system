import type { LintContext } from '../context.ts';
import { resolveEffectiveVariable } from '../effective-variable.ts';
import { variableToLabel } from '../labels.ts';
import type { Finding } from '../model/finding.ts';
import { ALL_PROPERTY_KINDS } from '../model/lint-property.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import { resolveBoundVariable } from './resolve-bound-variable.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `unknown-collection` (warning).
 *
 * A variable IS bound and resolves, but it effectively points at no known token
 * tier (t1/t2/t3): its collection is unrecognized (e.g. tokens from a
 * third-party kit) and its alias chain — if any — dead-ends on a raw value, an
 * unresolvable target or a cycle. Third-party tokens re-pointed to DS t2/t3
 * tokens ARE accepted (known effective tier) and pass silently. The other rules
 * cannot classify unknown bindings, so this rule surfaces them instead of
 * passing silently.
 */
export const unknownCollectionRule: LintRule = {
  id: 'unknown-collection',
  title: 'Unknown collection',
  severity: 'warning',
  appliesTo: ALL_PROPERTY_KINDS,
  evaluate: (observation: PropertyObservation, context: LintContext): readonly Finding[] => {
    const variable = resolveBoundVariable(observation, context);

    if (variable === undefined || resolveEffectiveVariable(variable, context) !== undefined) {
      return [];
    }

    const message: string =
      variable.collectionName === ''
        ? 'Bound token’s collection could not be resolved — expected t1/t2/t3.'
        : `Bound token comes from collection “${variable.collectionName}” — expected t1/t2/t3.`;

    return [buildFinding(unknownCollectionRule, observation, variableToLabel(variable), message)];
  },
};
