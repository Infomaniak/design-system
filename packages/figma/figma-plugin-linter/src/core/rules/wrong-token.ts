import type { LintContext } from '../context.ts';
import { variableToLabel } from '../labels.ts';
import type { Finding } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import {
  describeWrongColorUsage,
  getColorTokenCategory,
  isAllowedColorUsage,
} from '../semantic-usage.ts';
import { buildFinding } from './build-finding.ts';
import { resolveBoundVariable } from './resolve-bound-variable.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `wrong-token` (error).
 *
 * A t2 color variable IS bound, but its semantic category (derived from its own
 * name: `color/background/…`, `color/content/…`, `color/border/…`, `color/shadow/…`)
 * doesn't match the observed property — e.g. a content token on a background fill,
 * a background token on text, a border token on a fill.
 *
 * Anything the rule cannot classify (non-color root, unknown sub-category, t1/t3
 * variables) is skipped silently — never flag what we can't classify.
 */
export const wrongTokenRule: LintRule = {
  id: 'wrong-token',
  title: 'Wrong token',
  severity: 'error',
  appliesTo: ['fill', 'stroke'],
  evaluate: (observation: PropertyObservation, context: LintContext): readonly Finding[] => {
    const { node, property } = observation;
    const variable = resolveBoundVariable(observation, context);

    if (variable === undefined || variable.tier !== 't2') {
      return [];
    }

    const category = getColorTokenCategory(variable.nameSegments);

    if (category === 'unknown' || isAllowedColorUsage(category, property.kind, node.type)) {
      return [];
    }

    return [
      buildFinding(
        wrongTokenRule,
        observation,
        variableToLabel(variable),
        describeWrongColorUsage(category, property.kind, node.type),
      ),
    ];
  },
};
