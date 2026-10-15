import type { LintContext } from '../context.ts';
import { ICON_NAMES } from '../generated/icon-names.ts';
import { matchesIconInventory } from '../icon-library.ts';
import type { Finding } from '../model/finding.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

/** Raw Figma types of local (file-owned) components. */
const LOCAL_COMPONENT_TYPES: ReadonlySet<string> = new Set(['COMPONENT', 'COMPONENT_SET']);

const ICON_NAME_SET: ReadonlySet<string> = new Set(ICON_NAMES);

/**
 * Rule `local-duplicate` (warning).
 *
 * A local COMPONENT (or component set) is named exactly like an icon from the
 * Edelweiss Iconography kit: a duplicated icon component living in the file
 * instead of being instanced from the published kit.
 *
 * The heuristic is name-match only, deliberately conservative: exact matches
 * against the generated icon inventory (bare names and the `esds/icon/`
 * prefix both match); renamed or partial names pass silently. Detached icon
 * instances are NOT reported here — detaching produces a frame, which
 * `icon-as-frame` reports as an error. Non-icon components (a duplicated
 * `Button`) are out of the inventory's scope and stay silent.
 *
 * Examples:
 * - local component named `esds/icon/plus` → warning
 * - instance of the kit → pass
 * - local component named `esds/icon/plus copy` → pass (no exact match)
 */
export const localDuplicateRule: LintRule = {
  id: 'local-duplicate',
  title: 'Local duplicate',
  severity: 'warning',
  appliesTo: ['component'],
  evaluate: (observation: PropertyObservation, _context: LintContext): readonly Finding[] => {
    const { node, part } = observation;

    if (part.value.kind !== 'string' || !LOCAL_COMPONENT_TYPES.has(part.value.value)) {
      return [];
    }

    if (!matchesIconInventory(node.name, ICON_NAME_SET)) {
      return [];
    }

    return [
      buildFinding(
        localDuplicateRule,
        observation,
        node.name,
        'Local duplicate of a kit icon — instance the published component instead.',
      ),
    ];
  },
};
