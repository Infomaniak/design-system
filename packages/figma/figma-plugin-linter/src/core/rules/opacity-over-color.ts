import type { LintContext } from '../context.ts';
import type { Finding } from '../model/finding.ts';
import type { LintNode } from '../model/lint-node.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

/**
 * Rule `opacity-over-color` (warning).
 *
 * The node's opacity is hand-set below 100% while the layer carries a colored
 * fill: the DS expresses transparency through tokens (e.g. dataviz `@root`
 * dim variants), not through node opacity, which breaks the token pipeline.
 *
 * Edges (decided, documented):
 * - opacity 1 is never observed (the adapter omits the default value)
 * - opacity 0 is never observed either — an invisible layer reads as
 *   intentional hiding, not as a transparency intent
 * - the node's fills are always observed as `fill` properties before this rule
 *   runs (the adapter extracts them independently)
 */
export const opacityOverColorRule: LintRule = {
  id: 'opacity-over-color',
  title: 'Opacity over color',
  severity: 'warning',
  appliesTo: ['opacity'],
  evaluate: (observation: PropertyObservation, _context: LintContext): readonly Finding[] => {
    const { node, part } = observation;

    if (part.value.kind !== 'number' || part.value.value >= 1) {
      return [];
    }

    if (!hasColoredFill(node)) {
      return [];
    }

    return [
      buildFinding(
        opacityOverColorRule,
        observation,
        `${Math.round(part.value.value * 100)}%`,
        'Semi-transparent layer over a colored fill — the DS expresses transparency with tokens, not node opacity.',
      ),
    ];
  },
};

function hasColoredFill(node: LintNode): boolean {
  return node.properties.some(
    (property): boolean =>
      property.kind === 'fill' &&
      property.parts.some((part): boolean => part.value.kind === 'color'),
  );
}
