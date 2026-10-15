import type { LintContext } from '../context.ts';
import type { Finding } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `blend-mode` (warning).
 *
 * The node's blend mode differs from the defaults (`NORMAL`, `PASS_THROUGH`):
 * blends interact with the backdrop and break the design system's flat,
 * composable rendering.
 *
 * The adapter only emits non-default blend modes, so every observed
 * `blendMode` part is a finding.
 */
export const blendModeRule: LintRule = {
  id: 'blend-mode',
  title: 'Blend mode',
  severity: 'warning',
  appliesTo: ['blendMode'],
  evaluate: (observation: PropertyObservation, _context: LintContext): readonly Finding[] => {
    const { part } = observation;

    if (part.value.kind !== 'string') {
      return [];
    }

    return [
      buildFinding(
        blendModeRule,
        observation,
        part.value.value,
        'Non-default blend mode — the DS expects NORMAL or PASS_THROUGH.',
      ),
    ];
  },
};
