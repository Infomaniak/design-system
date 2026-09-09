import { CANVAS_SIZE } from './tokens.ts';

/** Sizing tolerance (in px) used when matching variant widths to the canvas size. */
const SIZE_TOLERANCE = 0.1;

export interface IconVariants {
  readonly outlined: ComponentNode | null;
  readonly filled: ComponentNode | null;
}

function isFilledVariantName(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.includes('filled=true') ||
    lower.includes('filled=yes') ||
    (lower.includes('filled') && !lower.includes('false') && !lower.includes('no'))
  );
}

function isOutlinedVariantName(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.includes('filled=false') ||
    lower.includes('filled=no') ||
    lower.includes('outlined') ||
    lower.includes('outline')
  );
}

/**
 * Detect the Outlined and Filled source components to use for generation.
 *
 * - A plain Component is used directly as the Outlined source.
 * - A ComponentSet's variants are detected by name (`Filled=true`, `filled=yes`,
 *   `Outlined`, `Outline`, ...). Filled takes priority when a name matches both.
 * - When no Outlined variant is found, the first canvas-size component is used
 *   as fallback (matches legacy behavior).
 */
export function detectVariants(source: ComponentNode | ComponentSetNode): IconVariants {
  if (source.type !== 'COMPONENT_SET') {
    return { outlined: source, filled: null };
  }

  let outlined: ComponentNode | null = null;
  let filled: ComponentNode | null = null;

  for (const child of source.children) {
    if (child.type !== 'COMPONENT' || Math.abs(child.width - CANVAS_SIZE) > SIZE_TOLERANCE) {
      continue;
    }
    if (isFilledVariantName(child.name) && filled === null) {
      filled = child;
    } else if (isOutlinedVariantName(child.name) && outlined === null) {
      outlined = child;
    }
  }

  if (outlined === null) {
    for (const child of source.children) {
      if (child.type === 'COMPONENT' && Math.abs(child.width - CANVAS_SIZE) < SIZE_TOLERANCE) {
        outlined = child;
        break;
      }
    }
  }

  return { outlined, filled };
}
