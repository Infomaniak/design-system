import type { LintContext } from '../context.ts';
import { partValueToLabel } from '../labels.ts';
import type { Finding } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `unbound-effect` (error).
 *
 * An effect (drop shadow, inner shadow, blur…) is set with raw settings: its
 * color is neither variable-bound nor does the effect come from an applied
 * effect style — shadows drift the moment the token set evolves.
 *
 * Examples:
 * - drop shadow with a raw color and no binding → error
 * - effect color bound to a variable → pass
 * - effect applied through an effect style → pass (checked by
 *   `local-effect-style` instead)
 */
export const unboundEffectRule: LintRule = {
  id: 'unbound-effect',
  title: 'Unbound effect',
  severity: 'error',
  appliesTo: ['effect'],
  evaluate: (observation: PropertyObservation, _context: LintContext): readonly Finding[] => {
    const { part } = observation;

    if (part.value.kind !== 'effect') {
      return [];
    }

    if (part.boundVariableId !== undefined || part.value.styleId !== undefined) {
      return [];
    }

    return [
      buildFinding(
        unboundEffectRule,
        observation,
        partValueToLabel(part.value),
        'Effect with raw settings and no effect style or variable bound.',
      ),
    ];
  },
};
