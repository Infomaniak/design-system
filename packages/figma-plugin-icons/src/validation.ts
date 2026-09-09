import { GENERATED_SUFFIX, type IconValidation, type InvalidReason } from './messages.ts';
import { CANVAS_SIZE } from './tokens.ts';

/** Sizing tolerance (in px) when comparing node dimensions to the canvas size. */
const SIZE_TOLERANCE = 0.1;

export function isComponentOrSet(node: SceneNode): node is ComponentNode | ComponentSetNode {
  return node.type === 'COMPONENT' || node.type === 'COMPONENT_SET';
}

/** A node matches the canvas size when both dimensions are within tolerance of 24px. */
export function isCanvasSize(node: { readonly width: number; readonly height: number }): boolean {
  return (
    Math.abs(node.width - CANVAS_SIZE) < SIZE_TOLERANCE &&
    Math.abs(node.height - CANVAS_SIZE) < SIZE_TOLERANCE
  );
}

/** Find the first child component matching the canvas size (24×24px). */
export function findCanvasVariant(componentSet: ComponentSetNode): ComponentNode | null {
  for (const child of componentSet.children) {
    if (child.type === 'COMPONENT' && isCanvasSize(child)) {
      return child;
    }
  }
  return null;
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
 * - containing a 24×24px variant (for ComponentSets),
 * - with at least one stroke somewhere in its tree.
 */
export function validateSingleIcon(node: ComponentNode | ComponentSetNode): IconValidation {
  if (isGenerated(node.name)) {
    return invalid(node, 'already-generated');
  }

  let nodeToCheck: ComponentNode | ComponentSetNode = node;
  if (node.type === 'COMPONENT_SET') {
    const variant = findCanvasVariant(node);
    if (!variant) {
      return invalid(node, 'no-24x24-variant');
    }
    nodeToCheck = variant;
  }

  if (!isCanvasSize(nodeToCheck)) {
    return invalid(node, 'not-24x24', renderSize(nodeToCheck));
  }

  if (!hasStrokesDeeply(nodeToCheck)) {
    return invalid(node, 'no-strokes');
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
