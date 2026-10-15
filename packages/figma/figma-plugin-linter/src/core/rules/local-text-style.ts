import type { LintContext } from '../context.ts';
import type { Finding } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `local-text-style` (warning).
 *
 * The TEXT node's text style is local to the file instead of being published
 * from the token library — the typography will drift from the design system as
 * soon as the published style evolves.
 *
 * Examples:
 * - style resolved to a local style → warning
 * - style resolved to a remote (published) style → pass (override-checked by
 *   `style-override`)
 * - style id that cannot be resolved (deleted style, lookup failure) → pass —
 *   never flag what we can't classify
 */
export const localTextStyleRule: LintRule = {
  id: 'local-text-style',
  title: 'Local text style',
  severity: 'warning',
  appliesTo: ['textStyle'],
  evaluate: (observation: PropertyObservation, context: LintContext): readonly Finding[] => {
    const { part } = observation;

    if (part.value.kind !== 'textStyle' || part.value.styleId === undefined) {
      return [];
    }

    const style = context.resolveTextStyle(part.value.styleId);

    if (style === undefined || style.remote) {
      return [];
    }

    return [
      buildFinding(
        localTextStyleRule,
        observation,
        style.name,
        `Text style "${style.name}" is local to this file — use a style published from the token library.`,
      ),
    ];
  },
};
