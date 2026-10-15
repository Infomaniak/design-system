import type { LintContext } from '../context.ts';
import { ICON_NAMES } from '../generated/icon-names.ts';
import { matchesIconInventory } from '../icon-library.ts';
import type { Finding } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

/** Raw Figma types a drawn container can have (instances/components excluded). */
const DRAWN_CONTAINER_TYPES: ReadonlySet<string> = new Set(['FRAME', 'SECTION', 'GROUP']);

const ICON_NAME_SET: ReadonlySet<string> = new Set(ICON_NAMES);

/**
 * Rule `icon-as-frame` (error).
 *
 * A drawn container (frame, section, group — NOT a component instance) is
 * named exactly like an icon from the Edelweiss Iconography kit: the icon
 * should be an instance of the published kit instead. Detached icon instances
 * surface here too — detaching produces a frame with the original name.
 *
 * Name matching is exact against the generated icon inventory (bare names and
 * the `esds/icon/` prefix both match): renamed or partial names (`plus copy`,
 * `icon plus`) pass silently — the heuristic is deliberately conservative
 * (name-based false-positive policy). Shapes (rectangles, vectors…) named
 * like an icon are not flagged: they may be genuine asset imports.
 *
 * Examples:
 * - frame named `chevron-right` or `esds/icon/chevron-right` → error
 * - instance of the kit named `esds/icon/chevron-right` → pass
 * - local COMPONENT named like an icon → pass (reported by `local-duplicate`)
 */
export const iconAsFrameRule: LintRule = {
  id: 'icon-as-frame',
  title: 'Icon as frame',
  severity: 'error',
  appliesTo: ['component'],
  evaluate: (observation: PropertyObservation, _context: LintContext): readonly Finding[] => {
    const { node, part } = observation;

    if (part.value.kind !== 'string' || !DRAWN_CONTAINER_TYPES.has(part.value.value)) {
      return [];
    }

    if (!matchesIconInventory(node.name, ICON_NAME_SET)) {
      return [];
    }

    return [
      buildFinding(
        iconAsFrameRule,
        observation,
        node.name,
        'Named like a kit icon but is a drawn container — instance the published icon instead.',
      ),
    ];
  },
};
