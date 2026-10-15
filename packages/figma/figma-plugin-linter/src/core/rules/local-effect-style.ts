import type { LintContext } from '../context.ts';
import type { Finding } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `local-effect-style` (warning).
 *
 * The effect comes from an applied effect style, but that style is local to
 * the file instead of being published from the token library — the effect will
 * drift from the design system as soon as the published style evolves.
 *
 * Examples:
 * - effect style resolved to a local style → warning
 * - effect style resolved to a remote (published) style → pass
 * - style id that cannot be resolved (deleted style, lookup failure) → pass —
 *   never flag what we can't classify
 */
export const localEffectStyleRule: LintRule = {
  id: 'local-effect-style',
  title: 'Local effect style',
  severity: 'warning',
  appliesTo: ['effect'],
  evaluate: (observation: PropertyObservation, context: LintContext): readonly Finding[] => {
    const { part } = observation;

    if (part.value.kind !== 'effect' || part.value.styleId === undefined) {
      return [];
    }

    const style = context.resolveEffectStyle(part.value.styleId);

    if (style === undefined || style.remote) {
      return [];
    }

    return [
      buildFinding(
        localEffectStyleRule,
        observation,
        style.name,
        `Effect style "${style.name}" is local to this file — use a style published from the token library.`,
      ),
    ];
  },
};
