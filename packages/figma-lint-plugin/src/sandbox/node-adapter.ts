import type { LintNode, LintNodeType } from '../core/model/lint-node.ts';
import type { LintProperty, LintPropertyPart } from '../core/model/lint-property.ts';
import { figmaRgbaToHex } from './color.ts';
import type { FigmaNode, FigmaPaint } from './figma-types.ts';

const FIGMA_NODE_TYPES_TO_LINT_NODE_TYPES: Readonly<Record<string, LintNodeType>> = {
  FRAME: 'FRAME',
  COMPONENT: 'FRAME',
  COMPONENT_SET: 'FRAME',
  SECTION: 'FRAME',
  GROUP: 'GROUP',
  TEXT: 'TEXT',
  INSTANCE: 'INSTANCE',
};

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
 * Not lintable (silently omitted): mixed paint arrays, image/video/gradient
 * paints, hidden paint layers, zero-valued padding/gap/radius parts.
 * Uniform padding sides / corners (same value and same binding) are merged into
 * a single property-level part.
 */
export function toLintNode(node: FigmaNode): LintNode {
  const type: LintNodeType = toLintNodeType(node.type);

  return {
    id: node.id,
    name: node.name,
    type,
    visible: node.visible !== false,
    properties: extractProperties(node),
    children: (node.children ?? []).map(toLintNode),
  };
}

function toLintNodeType(figmaType: string): LintNodeType {
  return FIGMA_NODE_TYPES_TO_LINT_NODE_TYPES[figmaType] ?? 'SHAPE';
}

function extractProperties(node: FigmaNode): readonly LintProperty[] {
  const properties: LintProperty[] = [];

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
      value: { kind: 'color', hex: figmaRgbaToHex(paint.color) },
    });
  }

  if (parts.length === 0) {
    return undefined;
  }

  return { kind, valueKind: 'color', parts };
}

function extractPadding(node: FigmaNode): LintProperty | undefined {
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

function extractGap(node: FigmaNode): LintProperty | undefined {
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

function extractCornerRadius(node: FigmaNode): LintProperty | undefined {
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
