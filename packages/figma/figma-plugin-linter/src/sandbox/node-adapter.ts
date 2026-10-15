import { rgbaToHex } from '../core/format-color.ts';
import { isIconLibraryComponent } from '../core/icon-library.ts';
import type { LintNode, LintNodeType } from '../core/model/lint-node.ts';
import type { LintProperty, LintPropertyPart } from '../core/model/lint-property.ts';
import type { AnyFigmaNode, FigmaEffect, FigmaPaint } from './figma-types.ts';
import type { InstanceIdentity } from './instance-identities.ts';

export interface ToLintNodeOptions {
  /**
   * Resolved component identities for the instances of the forest (see
   * `collectInstanceIdentities`) — the sync `mainComponent` getter is
   * forbidden in dynamic-page mode, so identities are pre-fetched async.
   */
  readonly instanceIdentities?: ReadonlyMap<string, InstanceIdentity>;
}

const FIGMA_NODE_TYPES_TO_LINT_NODE_TYPES: Readonly<Record<string, LintNodeType>> = {
  FRAME: 'FRAME',
  COMPONENT: 'FRAME',
  COMPONENT_SET: 'FRAME',
  SECTION: 'FRAME',
  GROUP: 'GROUP',
  TEXT: 'TEXT',
  INSTANCE: 'INSTANCE',
};

const EFFECT_TYPE_LABELS: Readonly<Record<string, string>> = {
  DROP_SHADOW: 'drop shadow',
  INNER_SHADOW: 'inner shadow',
  LAYER_BLUR: 'layer blur',
  BACKGROUND_BLUR: 'background blur',
};

/** Blend modes the DS accepts — anything else is linted. */
const DEFAULT_BLEND_MODES: readonly string[] = ['NORMAL', 'PASS_THROUGH'];

const PADDING_SIDES: readonly {
  readonly valueKey: 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft';
  readonly label: string;
}[] = [
  { valueKey: 'paddingTop', label: 'top' },
  { valueKey: 'paddingRight', label: 'right' },
  { valueKey: 'paddingBottom', label: 'bottom' },
  { valueKey: 'paddingLeft', label: 'left' },
];

const CORNERS: readonly {
  readonly valueKey: 'topLeftRadius' | 'topRightRadius' | 'bottomLeftRadius' | 'bottomRightRadius';
  readonly label: string;
}[] = [
  { valueKey: 'topLeftRadius', label: 'top left' },
  { valueKey: 'topRightRadius', label: 'top right' },
  { valueKey: 'bottomLeftRadius', label: 'bottom left' },
  { valueKey: 'bottomRightRadius', label: 'bottom right' },
];

/**
 * Converts a Figma node into a `LintNode`.
 *
 * Not lintable (silently omitted): mixed paint/effect/blend/opacity/text
 * values, image/video/gradient paints, hidden paint layers and hidden effects,
 * zero-valued padding/gap/radius/stroke-weight parts, the default opacity
 * (1 — token-bindable, flagged by `opacity-over-color` only when 0 < opacity
 * < 1) and default blend modes (NORMAL/PASS_THROUGH). Uniform padding sides /
 * corners (same value and same binding) are merged into a single
 * property-level part.
 *
 * Component instances from the DS icon library (`esds/icon/…` — resolved from
 * the pre-fetched component identity, its component-set parent, or the
 * instance's own name)
 * mark their whole subtree `fromIconLibrary` so tier-classifying rules can
 * exempt the library's own token collection.
 */
export function toLintNode(node: AnyFigmaNode, options: ToLintNodeOptions = {}): LintNode {
  return toLintNodeWithLibraryFlag(node, false, options.instanceIdentities ?? new Map());
}

function toLintNodeWithLibraryFlag(
  node: AnyFigmaNode,
  fromIconLibrary: boolean,
  identities: ReadonlyMap<string, InstanceIdentity>,
): LintNode {
  const type: LintNodeType = toLintNodeType(node.type);
  const isIconInstance: boolean =
    type === 'INSTANCE' && isIconLibraryComponent(resolveInstanceIdentityName(node, identities));
  const inIconLibrary: boolean = fromIconLibrary || isIconInstance;

  return {
    id: node.id,
    name: node.name,
    type,
    visible: node.visible !== false,
    properties: extractProperties(node),
    ...(inIconLibrary ? { fromIconLibrary: true } : {}),
    children: (node.children ?? []).map((child: AnyFigmaNode): LintNode =>
      toLintNodeWithLibraryFlag(child, inIconLibrary, identities),
    ),
  };
}

/**
 * Resolves the stable identity name of a component instance: the main
 * component's component-set name (variant icons), the component's own name, or
 * the instance's layer name as the last resort. Identities come pre-fetched
 * (async) — no Figma API is touched here.
 */
function resolveInstanceIdentityName(
  node: AnyFigmaNode,
  identities: ReadonlyMap<string, InstanceIdentity>,
): string {
  const identity: InstanceIdentity | undefined = identities.get(node.id);

  return identity?.componentSetName ?? identity?.componentName ?? node.name;
}

function toLintNodeType(figmaType: string): LintNodeType {
  return FIGMA_NODE_TYPES_TO_LINT_NODE_TYPES[figmaType] ?? 'SHAPE';
}

function extractProperties(node: AnyFigmaNode): readonly LintProperty[] {
  const properties: LintProperty[] = [];

  const component: LintProperty = extractComponentIdentity(node);
  properties.push(component);

  const fills: LintProperty | undefined = extractPaintProperty('fill', node.fills);
  if (fills !== undefined) {
    properties.push(fills);
  }

  const strokes: LintProperty | undefined = extractPaintProperty('stroke', node.strokes);
  if (strokes !== undefined) {
    properties.push(strokes);
  }

  const padding: LintProperty | undefined = extractPadding(node);
  if (padding !== undefined) {
    properties.push(padding);
  }

  const gap: LintProperty | undefined = extractGap(node);
  if (gap !== undefined) {
    properties.push(gap);
  }

  const cornerRadius: LintProperty | undefined = extractCornerRadius(node);
  if (cornerRadius !== undefined) {
    properties.push(cornerRadius);
  }

  const strokeWeight: LintProperty | undefined = extractStrokeWeight(node);
  if (strokeWeight !== undefined) {
    properties.push(strokeWeight);
  }

  const opacity: LintProperty | undefined = extractOpacity(node);
  if (opacity !== undefined) {
    properties.push(opacity);
  }

  const blendMode: LintProperty | undefined = extractBlendMode(node);
  if (blendMode !== undefined) {
    properties.push(blendMode);
  }

  const effects: LintProperty | undefined = extractEffects(node);
  if (effects !== undefined) {
    properties.push(effects);
  }

  const textContent: LintProperty | undefined = extractTextContent(node);
  if (textContent !== undefined) {
    properties.push(textContent);
  }

  return properties;
}

function extractPaintProperty(
  kind: 'fill' | 'stroke',
  paints: readonly FigmaPaint[] | symbol | undefined,
): LintProperty | undefined {
  if (!Array.isArray(paints)) {
    return undefined;
  }

  const parts: LintPropertyPart[] = [];

  for (const [index, paint] of paints.entries()) {
    if (paint.type !== 'SOLID' || paint.visible === false || paint.color === undefined) {
      continue;
    }

    parts.push({
      id: `paint:${index}`,
      ...(parts.length === 0 && paints.length === 1 ? {} : { label: `paint ${parts.length + 1}` }),
      boundVariableId: paint.boundVariables?.color?.id,
      value: { kind: 'color', hex: rgbaToHex(paint.color) },
    });
  }

  if (parts.length === 0) {
    return undefined;
  }

  return { kind, valueKind: 'color', parts };
}

function extractPadding(node: AnyFigmaNode): LintProperty | undefined {
  const sides: (LintPropertyPart | undefined)[] = PADDING_SIDES.map(
    ({ valueKey, label }): LintPropertyPart | undefined => {
      const value = node[valueKey];

      if (typeof value !== 'number' || value === 0) {
        return undefined;
      }

      return {
        id: valueKey,
        label,
        boundVariableId: node.boundVariables?.[valueKey]?.id,
        value: { kind: 'number', value },
      };
    },
  );

  return mergeUniformParts('padding', sides);
}

function extractGap(node: AnyFigmaNode): LintProperty | undefined {
  const { itemSpacing } = node;

  if (typeof itemSpacing !== 'number' || itemSpacing === 0) {
    return undefined;
  }

  return {
    kind: 'gap',
    valueKind: 'number',
    parts: [
      {
        id: 'uniform',
        boundVariableId: node.boundVariables?.itemSpacing?.id,
        value: { kind: 'number', value: itemSpacing },
      },
    ],
  };
}

function extractCornerRadius(node: AnyFigmaNode): LintProperty | undefined {
  const corners: (LintPropertyPart | undefined)[] = CORNERS.map(
    ({ valueKey, label }): LintPropertyPart | undefined => {
      const value = node[valueKey];

      if (typeof value !== 'number') {
        return undefined;
      }

      return {
        id: valueKey,
        label,
        boundVariableId: node.boundVariables?.[valueKey]?.id,
        value: { kind: 'number', value },
      };
    },
  );

  // Nodes with independent corners (frames, rectangles) store a binding applied
  // in the editor on the four corner fields, never on `cornerRadius`.
  if (corners.every((part: LintPropertyPart | undefined): boolean => part !== undefined)) {
    return mergeUniformParts('cornerRadius', corners);
  }

  // Nodes without independent corners (e.g. text) expose the binding as
  // `cornerRadius` instead.
  const uniformValue = node.cornerRadius;

  if (typeof uniformValue !== 'number' || uniformValue === 0) {
    return undefined;
  }

  return {
    kind: 'cornerRadius',
    valueKind: 'number',
    parts: [
      {
        id: 'uniform',
        boundVariableId: node.boundVariables?.cornerRadius?.id,
        value: { kind: 'number', value: uniformValue },
      },
    ],
  };
}

/**
 * Drops zero-valued parts (0 needs no token), merges parts when they are uniform
 * (same value and same binding) into a single property-level part, and drops the
 * property entirely when nothing is lintable.
 */
function mergeUniformParts(
  kind: 'padding' | 'cornerRadius',
  parts: readonly (LintPropertyPart | undefined)[],
): LintProperty | undefined {
  const defined: readonly NumberLintPropertyPart[] = parts.filter(
    (part: LintPropertyPart | undefined): part is NumberLintPropertyPart =>
      part !== undefined && part.value.kind === 'number' && part.value.value !== 0,
  );

  if (defined.length === 0) {
    return undefined;
  }

  const first: NumberLintPropertyPart = defined[0]!;
  const isUniform: boolean = defined.every(
    (part: NumberLintPropertyPart): boolean =>
      part.value.value === first.value.value && part.boundVariableId === first.boundVariableId,
  );

  if (isUniform) {
    return {
      kind,
      valueKind: 'number',
      parts: [{ id: 'uniform', boundVariableId: first.boundVariableId, value: first.value }],
    };
  }

  return { kind, valueKind: 'number', parts: defined };
}

/**
 * A `LintPropertyPart` whose value is known to be a number (padding/gap/radius
 * parts are always numbers).
 */
type NumberLintPropertyPart = LintPropertyPart & {
  readonly value: { readonly kind: 'number'; readonly value: number };
};

/**
 * Stroke weight, in points — only when the node actually carries a visible
 * stroke. Figma defaults `strokeWeight` to 1 on every node (text included)
 * even with no stroke applied: a weight without a stroke paint is the Figma
 * default, not a design decision, so nothing is observed. Mixed stroke arrays
 * are skipped too (can't tell whether a stroke exists).
 */
function extractStrokeWeight(node: AnyFigmaNode): LintProperty | undefined {
  if (!hasVisibleStrokes(node)) {
    return undefined;
  }

  const value: number | symbol | undefined = node.strokeWeight;

  if (typeof value !== 'number' || value === 0) {
    return undefined;
  }

  return {
    kind: 'strokeWeight',
    valueKind: 'number',
    parts: [
      {
        id: 'uniform',
        boundVariableId: node.boundVariables?.strokeWeight?.id,
        value: { kind: 'number', value },
      },
    ],
  };
}

function hasVisibleStrokes(node: AnyFigmaNode): boolean {
  const strokes: readonly FigmaPaint[] | symbol | undefined = node.strokes;

  return (
    Array.isArray(strokes) && strokes.some((paint: FigmaPaint): boolean => paint.visible !== false)
  );
}

/**
 * Node opacity. Only the semi-transparent band is observed: 1 is the default
 * (and not variable-bindable anyway), 0 reads as intentional hiding.
 */
function extractOpacity(node: AnyFigmaNode): LintProperty | undefined {
  const value: number | symbol | undefined = node.opacity;

  if (typeof value !== 'number' || value <= 0 || value >= 1) {
    return undefined;
  }

  return {
    kind: 'opacity',
    valueKind: 'number',
    parts: [{ id: 'uniform', value: { kind: 'number', value } }],
  };
}

/**
 * Blend mode, only when it differs from the accepted defaults.
 */
function extractBlendMode(node: AnyFigmaNode): LintProperty | undefined {
  const value: string | symbol | undefined = node.blendMode;

  if (typeof value !== 'string' || DEFAULT_BLEND_MODES.includes(value)) {
    return undefined;
  }

  return {
    kind: 'blendMode',
    valueKind: 'string',
    parts: [{ id: 'uniform', value: { kind: 'string', value } }],
  };
}

/**
 * Effects, one part per visible effect. The color binding is read from the
 * effect's own `boundVariables.color`; when the node uses an effect style, the
 * style id rides on every part (the style is the binding the rules check).
 */
function extractEffects(node: AnyFigmaNode): LintProperty | undefined {
  const effects: readonly FigmaEffect[] | symbol | undefined = node.effects;

  if (!Array.isArray(effects)) {
    return undefined;
  }

  const styleId: string | symbol | undefined = node.effectStyleId;
  const appliedStyleId: string | undefined = typeof styleId === 'string' ? styleId : undefined;

  const parts: LintPropertyPart[] = [];

  for (const [index, effect] of effects.entries()) {
    if (effect.visible === false) {
      continue;
    }

    parts.push({
      id: `effect:${index}`,
      ...(parts.length === 0 && effects.length === 1 ? {} : { label: effectToLabel(effect) }),
      boundVariableId: effect.boundVariables?.color?.id,
      value: {
        kind: 'effect',
        effectType: effect.type,
        ...(effect.radius === undefined ? {} : { radius: effect.radius }),
        ...(effect.offset === undefined ? {} : { offset: effect.offset }),
        ...(appliedStyleId === undefined ? {} : { styleId: appliedStyleId }),
      },
    });
  }

  if (parts.length === 0) {
    return undefined;
  }

  return { kind: 'effect', valueKind: 'effect', parts };
}

function effectToLabel(effect: FigmaEffect): string {
  return EFFECT_TYPE_LABELS[effect.type] ?? effect.type.toLowerCase();
}

/**
 * Text content of TEXT nodes (placeholder-copy linting). Mixed or empty text
 * is skipped.
 */
function extractTextContent(node: AnyFigmaNode): LintProperty | undefined {
  const value: string | symbol | undefined = node.characters;

  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }

  return {
    kind: 'textContent',
    valueKind: 'string',
    parts: [{ id: 'uniform', value: { kind: 'string', value } }],
  };
}

/**
 * Component identity, observed on every node: the part value is the node's
 * RAW Figma type (pre-mapping — `LintNodeType` collapses COMPONENT into
 * FRAME), which the component rules (`icon-as-frame`, `local-duplicate`) match
 * against; the node's name rides on the observation.
 */
function extractComponentIdentity(node: AnyFigmaNode): LintProperty {
  return {
    kind: 'component',
    valueKind: 'string',
    parts: [{ id: 'uniform', value: { kind: 'string', value: node.type } }],
  };
}
