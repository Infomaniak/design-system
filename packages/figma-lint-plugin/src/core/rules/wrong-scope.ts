import type { LintContext } from '../context.ts';
import { variableToLabel } from '../labels.ts';
import type { Finding } from '../model/finding.ts';
import { ALL_PROPERTY_KINDS } from '../model/lint-property.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import type { FigmaScope } from '../scopes.ts';
import { describeRequiredProperty, getRequiredScopes, scopesCoverProperty } from '../scopes.ts';
import { buildFinding } from './build-finding.ts';
import { resolveBoundVariable } from './resolve-bound-variable.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `wrong-scope` (error).
 *
 * A variable IS bound, but its Figma scopes don't cover the observed property
 * (e.g. a stroke-color token bound to a frame fill). Empty scopes are allowed
 * everywhere; `ALL_SCOPES`/`ALL_FILLS` cover accordingly. Variables that cannot
 * be resolved (deleted) are skipped.
 *
 * If the file's variables carry no scopes, this rule stays dormant and the
 * `wrong-token` rule still applies.
 */
export const wrongScopeRule: LintRule = {
  id: 'wrong-scope',
  title: 'Wrong scope',
  severity: 'error',
  appliesTo: ALL_PROPERTY_KINDS,
  evaluate: (observation: PropertyObservation, context: LintContext): readonly Finding[] => {
    const { node, property } = observation;
    const variable = resolveBoundVariable(observation, context);

    if (variable === undefined) {
      return [];
    }

    const required: readonly FigmaScope[] = getRequiredScopes(property.kind, node.type);

    if (scopesCoverProperty(variable.scopes, required)) {
      return [];
    }

    return [
      buildFinding(
        wrongScopeRule,
        observation,
        variableToLabel(variable),
        `Variable scopes don't cover ${describeRequiredProperty(property.kind, node.type)}.`,
      ),
    ];
  },
};
