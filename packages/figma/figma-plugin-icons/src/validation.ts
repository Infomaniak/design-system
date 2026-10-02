import { GENERATED_SUFFIX, type IconValidation, type InvalidReason } from './messages.ts';
import { isCanvasSize } from './tokens.ts';
import { detectVariants } from './variants.ts';

export function isComponentOrSet(node: SceneNode): node is ComponentNode | ComponentSetNode {
  return node.type === 'COMPONENT' || node.type === 'COMPONENT_SET';
}

/** Check whether a component (or one of its descendants) declares any stroke. */
export function hasStrokesDeeply(node: SceneNode): boolean {
  if ('strokes' in node && node.strokes.length > 0) {
    return true;
  }
  if ('children' in node) {
    for (const child of node.children) {
      if (hasStrokesDeeply(child)) {
        return true;
      }
    }
  }
  return false;
}

export function isGenerated(name: string): boolean {
  return name.includes(GENERATED_SUFFIX);
}

function invalid(
  node: ComponentNode | ComponentSetNode,
  reason: InvalidReason,
  currentSize?: string,
): IconValidation {
  return { name: node.name, type: node.type, valid: false, reason, currentSize };
}

/**
 * Validate a single icon source node (pure logic, no Figma API calls).
 * The node must be a Component or ComponentSet:
 * - not already generated,
 * - every variant that generation will use (see `detectVariants`) must be
 *   exactly 24×24px, contain at least one child layer and some stroke.
 */
export function validateSingleIcon(node: ComponentNode | ComponentSetNode): IconValidation {
  if (isGenerated(node.name)) {
    return invalid(node, 'already-generated');
  }

  const { outlined, filled } = detectVariants(node);
  if (!outlined) {
    return invalid(node, 'no-24x24-variant');
  }

  for (const variant of filled ? [outlined, filled] : [outlined]) {
    if (!isCanvasSize(variant)) {
      return invalid(node, 'not-24x24', renderSize(variant));
    }
    if (variant.children.length === 0) {
      return invalid(node, 'empty');
    }
    if (!hasStrokesDeeply(variant)) {
      return invalid(node, 'no-strokes');
    }
  }

  return { name: node.name, type: node.type, valid: true, reason: null };
}

/** Validate a whole selection and return the summary expected by the UI. */
export function validateSelection(selection: readonly SceneNode[]): {
  readonly icons: IconValidation[];
  readonly validCount: number;
} {
  const icons = selection.map((node) =>
    isComponentOrSet(node)
      ? validateSingleIcon(node)
      : { name: node.name, type: node.type, valid: false, reason: 'not-a-component' as const },
  );
  const validCount = icons.filter((icon) => icon.valid).length;
  return { icons, validCount };
}

function renderSize(node: { readonly width: number; readonly height: number }): string {
  return `${Math.round(node.width)}×${Math.round(node.height)}`;
}
