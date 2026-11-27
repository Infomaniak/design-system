import type { LintContext } from '../context.ts';
import { ICON_NAMES } from '../generated/icon-names.ts';
import { matchesIconInventory } from '../icon-library.ts';
import type { Finding } from '../model/finding.ts';
import type { LintNode } from '../model/lint-node.ts';
import type { PropertyObservation } from '../model/property-observation.ts';
import { buildFinding } from './build-finding.ts';
import type { LintRule } from './rule.ts';

/**
 * Raw Figma types this rule polices: icon-carrier shapes (vector family —
 * a local SVG import lands as one of these) and component instances. Drawn
 * containers (FRAME/SECTION/GROUP) are `icon-as-frame`'s turf, local
 * components (COMPONENT/COMPONENT_SET) are `local-duplicate`'s — those two
 * report their own severities.
 */
const LOCAL_ICON_CARRIER_TYPES: ReadonlySet<string> = new Set([
  'VECTOR',
  'ELLIPSE',
  'RECTANGLE',
  'POLYGON',
  'STAR',
  'LINE',
  'BOOLEAN_OPERATION',
  'INSTANCE',
]);

/**
 * The only sizes the Edelweiss Iconography kit publishes (its `size` variant
 * values). A vector or instance bounded to exactly one of them is treated as
 * icon-shaped even when Figma's `isAsset` heuristic stays quiet.
 */
const ICON_SIZES: readonly number[] = [16, 20, 24, 32, 40];

/** Float dust around a canonical size (scaled bounds, rounding). */
const SIZE_TOLERANCE: number = 0.01;

const ICON_NAME_SET: ReadonlySet<string> = new Set(ICON_NAMES);

/**
 * Whether the node's bounds match a canonical kit icon size on both axes.
 */
function isIconSized(node: LintNode): boolean {
  if (node.width === undefined || node.height === undefined) {
    return false;
  }

  return ICON_SIZES.some(
    (size: number): boolean =>
      Math.abs(node.width! - size) < SIZE_TOLERANCE &&
      Math.abs(node.height! - size) < SIZE_TOLERANCE,
  );
}

/**
 * Rule `icon-local-import` (warning).
 *
 * A shape or instance that looks like an icon from the Edelweiss Iconography
 * kit but is not a verified instance of the published kit. Two detection
 * paths, both skipped inside verified kit instances (`fromIconLibrary`):
 *
 * - **Name**: the layer is named exactly like an inventory icon (bare name or
 *   `esds/icon/` prefix) — a local SVG import, a renamed detached glyph, or an
 *   instance of a local (non-remote) component. Renamed or partial names
 *   (`plus copy`, `icon plus`) pass silently — the name heuristic is
 *   deliberately conservative.
 * - **Shape**: the node carries Figma's own asset heuristic (`isAsset` — small
 *   vector graphic) or is bounded to a canonical kit icon size (16/20/24/32/40)
 *   — catches generically named local imports (`Vector path`) and instances of
 *   local icon components (`Icon`, reported as "From this file" by Figma).
 *   Nodes whose subtree carries an image fill stay silent: `isAsset` fires for
 *   raster images too, and photos/avatars are not icons.
 *
 * Examples:
 * - vector named `chevron-right` (local SVG import) → warning
 * - unnamed 24×24 vector (`Vector path`) → warning
 * - instance of a local icon component (`Icon`, 24×24) → warning
 * - instance of the published kit named `esds/icon/chevron-right` → pass
 * - image-filled rectangle (a placed photo) → pass
 */
export const iconLocalImportRule: LintRule = {
  id: 'icon-local-import',
  title: 'Icon local import',
  description:
    'A layer that looks like a kit icon (name, size or asset heuristic) is not an instance of the published kit.',
  severity: 'warning',
  appliesTo: ['component'],
  evaluate: (observation: PropertyObservation, _context: LintContext): readonly Finding[] => {
    const { node, part } = observation;

    if (part.value.kind !== 'string' || !LOCAL_ICON_CARRIER_TYPES.has(part.value.value)) {
      return [];
    }

    if (node.fromIconLibrary === true) {
      return [];
    }

    if (matchesIconInventory(node.name, ICON_NAME_SET)) {
      return [
        buildFinding(
          iconLocalImportRule,
          observation,
          node.name,
          'Named like a kit icon but not instanced from the Edelweiss Iconography library — instance the published component instead.',
        ),
      ];
    }

    const shapeTriggered: boolean =
      node.hasImageFill !== true && (node.isAsset === true || isIconSized(node));

    if (!shapeTriggered) {
      return [];
    }

    return [
      buildFinding(
        iconLocalImportRule,
        observation,
        node.name,
        'Looks like an icon but is not instanced from the Edelweiss Iconography library — use the published component instead.',
      ),
    ];
  },
};
