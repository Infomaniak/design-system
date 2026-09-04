import type { LintContext } from '../context.ts';
import { partValueToLabel } from '../labels.ts';
import type { Finding } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `unbound-value` (error).
 *
 * Flags every checked property whose part carries a raw value with no design
 * token bound — the primary source of token drift.
 *
 * Examples:
 * - fill `#4A90D9` with no bound variable → error
 * - fill bound to a variable → pass
 * - zero-valued padding/gap/radius parts are never observed (the adapter omits
 *   them — 0 needs no token)
 */
export const unboundValueRule: LintRule = {
  id: 'unbound-value',
  title: 'Unbound value',
  severity: 'error',
  appliesTo: ['fill', 'stroke', 'padding', 'gap', 'cornerRadius'],
  evaluate: (observation: PropertyObservation, _context: LintContext): readonly Finding[] => {
    const { part } = observation;

    if (part.boundVariableId !== undefined) {
      return [];
    }

    return [
      buildFinding(
        unboundValueRule,
        observation,
        partValueToLabel(part.value),
        part.value.kind === 'color'
          ? 'Raw color value with no design token bound.'
          : 'Raw number value with no design token bound.',
      ),
    ];
  },
};
