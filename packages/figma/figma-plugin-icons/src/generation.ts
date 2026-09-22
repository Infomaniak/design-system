import {
  CANVAS_SIZE,
  ICON_COLORS,
  ICON_SIZES,
  type IconSize,
  type StrokeConfig,
} from './tokens.ts';
import { validateSingleIcon } from './validation.ts';
import { detectVariants } from './variants.ts';

/** Fixed width applied to generated ComponentSets. */
const COMPONENT_SET_WIDTH = 176;

export interface ProgressUpdate {
  readonly step: number;
  readonly total: number;
  readonly message: string;
}

export interface GenerateOptions {
  readonly strokeConfig: StrokeConfig;
  readonly onProgress: (update: ProgressUpdate) => void;
}

/**
 * Generate all size variants (and Filled variants when available) for one icon
 * source, then assemble them into a `[generated]` ComponentSet placed next to
 * the source. The selection is updated to the generated ComponentSet.
 */
export async function generateIconSet(
  source: ComponentNode | ComponentSetNode,
  options: GenerateOptions & { readonly index: number; readonly total: number },
): Promise<void> {
  const { outlined, filled } = detectVariants(source);
  if (!outlined) {
    throw new Error(`Aucun variant de ${CANVAS_SIZE}px de large trouvé pour "${source.name}"`);
  }

  const isDualStyle = filled !== null;
  const totalSteps = ICON_SIZES.length * (isDualStyle ? 2 : 1);
  let currentStep = 0;
  const prefix = options.total > 1 ? `Icône ${options.index}/${options.total} - ` : '';

  const components: ComponentNode[] = [];

  for (const size of ICON_SIZES) {
    currentStep++;
    const styleLabel = isDualStyle ? 'Outlined' : 'Single';
    options.onProgress({
      step: currentStep,
      total: totalSteps,
      message: `${prefix}Taille ${size} / ${styleLabel}...`,
    });

    try {
      const outlinedVariant = await createScaledVariant(
        outlined,
        size,
        'Outlined',
        options.strokeConfig,
      );
      if (outlinedVariant) {
        components.push(outlinedVariant);
      }
    } catch (error) {
      log(
        `Impossible de créer la variante Outlined pour la taille ${size}: ${describeError(error)}`,
      );
    }

    if (filled) {
      currentStep++;
      options.onProgress({
        step: currentStep,
        total: totalSteps,
        message: `${prefix}Taille ${size} / Filled...`,
      });

      try {
        const filledVariant = await createScaledVariant(
          filled,
          size,
          'Filled',
          options.strokeConfig,
        );
        if (filledVariant) {
          components.push(filledVariant);
        }
      } catch (error) {
        log(
          `Impossible de créer la variante Filled pour la taille ${size}: ${describeError(error)}`,
        );
      }
    }
  }

  options.onProgress({ step: totalSteps, total: totalSteps, message: `${prefix}Assemblage...` });

  const componentSet = createComponentSet(components, source.name);
  componentSet.x = source.x + source.width + 48;
  componentSet.y = source.y;
  figma.currentPage.selection = [componentSet];
}

/**
 * Create a scaled variant for a target size: children are cloned (instances
 * detached), resized, stroked (and filled for the Filled style), then strokes
 * are vectorized (Outlined only) and everything is flattened into a `glyph`
 * layer placed at the center of a new component.
 */
async function createScaledVariant(
  sourceComponent: ComponentNode,
  targetSize: IconSize,
  styleName: 'Outlined' | 'Filled',
  strokeConfig: StrokeConfig,
): Promise<ComponentNode | null> {
  const scale = targetSize / CANVAS_SIZE;
  const strokeWeight = strokeConfig[targetSize];

  const tempFrame = figma.createFrame();
  tempFrame.name = `Temp_${targetSize}_${styleName}`;
  tempFrame.resize(targetSize, targetSize);

  try {
    for (const child of sourceComponent.children) {
      const processedChild: SceneNode =
        child.type === 'INSTANCE' ? child.detachInstance() : child.clone();

      if ('resize' in processedChild) {
        processedChild.resize(processedChild.width * scale, processedChild.height * scale);
      }

      applyStrokeWeight(processedChild, strokeWeight);
      if (styleName === 'Filled') {
        applyIconFills(processedChild);
      }

      tempFrame.appendChild(processedChild);
    }

    if (styleName === 'Outlined' && tempFrame.children.length > 0) {
      vectorizeStrokes(tempFrame);
    }

    let glyph: VectorNode | null = null;
    if (tempFrame.children.length > 0) {
      glyph = figma.flatten([...tempFrame.children], tempFrame);
      glyph.name = 'glyph';

      if (glyph.fills !== figma.mixed && glyph.fills.length > 0) {
        glyph.fills = [{ type: 'SOLID', color: ICON_COLORS.default }];
      }

      glyph.x = (targetSize - glyph.width) / 2;
      glyph.y = (targetSize - glyph.height) / 2;
      glyph.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
    }

    const newComponent = figma.createComponent();
    // Figma derives variant properties from component names; the property
    // names are lowercase ("size" and "filled"). "filled" is always present
    // so the generated ComponentSet exposes a boolean "filled" property.
    // Interleaved generation (filled=false first) makes filled=false the default.
    const filledValue = styleName === 'Filled' ? 'true' : 'false';
    newComponent.name = `size=${targetSize}, filled=${filledValue}`;
    newComponent.resize(targetSize, targetSize);

    if (glyph) {
      newComponent.appendChild(glyph);
    }

    return newComponent;
  } finally {
    tempFrame.remove();
  }
}

/** Recursively apply the configured stroke weight and icon color to a node tree. */
export function applyStrokeWeight(node: SceneNode, strokeWeight: number): void {
  if ('strokes' in node && node.strokes.length > 0) {
    node.strokeWeight = strokeWeight;
    if (node.strokes[0]?.type === 'SOLID') {
      node.strokes = [{ type: 'SOLID', color: ICON_COLORS.default }];
    }
  }
  if ('children' in node) {
    for (const child of node.children) {
      applyStrokeWeight(child, strokeWeight);
    }
  }
}

/** Recursively force solid black fills on a node tree (Filled style). */
export function applyIconFills(node: SceneNode): void {
  if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
    node.fills = [{ type: 'SOLID', color: ICON_COLORS.default }];
  }
  if ('children' in node) {
    for (const child of node.children) {
      applyIconFills(child);
    }
  }
}

/**
 * Convert strokes to filled outlines so icons render identically regardless of
 * scaling. Children are processed from the end to keep indexes stable while
 * replacing nodes.
 */
function vectorizeStrokes(frame: FrameNode): void {
  for (let index = frame.children.length - 1; index >= 0; index--) {
    const child = frame.children[index];
    if (!('strokes' in child) || child.strokes.length === 0 || !('outlineStroke' in child)) {
      continue;
    }
    try {
      const vectorized = child.outlineStroke();
      if (vectorized) {
        frame.insertChild(index, vectorized);
        child.remove();
      }
    } catch (error) {
      log(`Impossible de vectoriser les strokes de "${child.name}": ${describeError(error)}`);
    }
  }
}

/** Combine generated components into a laid-out `[generated]` ComponentSet. */
function createComponentSet(
  components: readonly ComponentNode[],
  baseName: string,
): ComponentSetNode {
  if (components.length === 0) {
    throw new Error('Aucun composant à assembler');
  }

  const componentSet = figma.combineAsVariants([...components], figma.currentPage);
  componentSet.name = `${baseName} [generated]`;

  // Layout matching the design-system source ComponentSets. Variant properties
  // are auto-detected by Figma from component names.
  componentSet.layoutMode = 'HORIZONTAL';
  componentSet.layoutWrap = 'WRAP';
  componentSet.primaryAxisSizingMode = 'FIXED';
  componentSet.counterAxisSizingMode = 'AUTO';
  componentSet.primaryAxisAlignItems = 'MIN';
  componentSet.counterAxisAlignItems = 'MIN';
  componentSet.itemSpacing = 32;
  componentSet.counterAxisSpacing = 32;
  componentSet.paddingTop = 32;
  componentSet.paddingBottom = 32;
  componentSet.paddingLeft = 32;
  componentSet.paddingRight = 32;
  componentSet.clipsContent = false;

  try {
    componentSet.resize(COMPONENT_SET_WIDTH, componentSet.height);
  } catch (error) {
    log(`Redimensionnement du ComponentSet impossible: ${describeError(error)}`);
  }

  return componentSet;
}

/** Validate a selection for generation, returning the valid icon sources. */
export function selectValidIcons(
  selection: readonly SceneNode[],
): (ComponentNode | ComponentSetNode)[] {
  const validIcons: (ComponentNode | ComponentSetNode)[] = [];
  for (const node of selection) {
    if (
      (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') &&
      validateSingleIcon(node).valid
    ) {
      validIcons.push(node);
    }
  }
  return validIcons;
}

export function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function log(message: string): void {
  if (__DEBUG__) {
    console.log('[Icon Plugin]', message);
  }
}
