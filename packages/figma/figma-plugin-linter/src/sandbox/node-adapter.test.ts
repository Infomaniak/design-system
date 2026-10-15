import { describe, expect, it } from 'vitest';
import type { AnyFigmaNode, FigmaPaint } from './figma-types.ts';
import { toLintNode } from './node-adapter.ts';

const MIXED: symbol = Symbol('mixed');

function solidPaint(hex: [number, number, number], boundVariableId?: string): FigmaPaint {
  return {
    type: 'SOLID',
    color: { r: hex[0]!, g: hex[1]!, b: hex[2]!, a: 1 },
    boundVariables:
      boundVariableId === undefined
        ? undefined
        : { color: { type: 'VARIABLE_ALIAS', id: boundVariableId } },
  };
}

describe('toLintNode — node mapping', () => {
  it('maps Figma node types to lint node types', () => {
    expect(toLintNode({ id: '1', name: 'Frame', type: 'FRAME' }).type).toBe('FRAME');
    expect(toLintNode({ id: '2', name: 'Component', type: 'COMPONENT' }).type).toBe('FRAME');
    expect(toLintNode({ id: '3', name: 'Set', type: 'COMPONENT_SET' }).type).toBe('FRAME');
    expect(toLintNode({ id: '4', name: 'Section', type: 'SECTION' }).type).toBe('FRAME');
    expect(toLintNode({ id: '5', name: 'Group', type: 'GROUP' }).type).toBe('GROUP');
    expect(toLintNode({ id: '6', name: 'Text', type: 'TEXT' }).type).toBe('TEXT');
    expect(toLintNode({ id: '7', name: 'Rect', type: 'RECTANGLE' }).type).toBe('SHAPE');
    expect(toLintNode({ id: '8', name: 'Vector', type: 'VECTOR' }).type).toBe('SHAPE');
    expect(toLintNode({ id: '9', name: 'Ellipse', type: 'ELLIPSE' }).type).toBe('SHAPE');
  });

  it('maps visibility, defaulting to visible', () => {
    expect(toLintNode({ id: '1', name: 'A', type: 'FRAME' }).visible).toBe(true);
    expect(toLintNode({ id: '1', name: 'A', type: 'FRAME', visible: false }).visible).toBe(false);
  });

  it('converts children recursively', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      children: [
        { id: '2', name: 'Text', type: 'TEXT' },
        {
          id: '3',
          name: 'Rect',
          type: 'RECTANGLE',
          children: [{ id: '4', name: 'Inner', type: 'ELLIPSE' }],
        },
      ],
    };

    const lintNode = toLintNode(node);

    expect(lintNode.children.map((child: { readonly id: string }): string => child.id)).toEqual([
      '2',
      '3',
    ]);
    expect(lintNode.children[1]!.children[0]!.id).toBe('4');
  });

  it('keeps instance properties and children (instances are linted)', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Instance',
      type: 'INSTANCE',
      fills: [solidPaint([0, 0, 0], 'V:7')],
      children: [{ id: '2', name: 'Child', type: 'RECTANGLE' }],
    };

    const lintNode = toLintNode(node);

    expect(lintNode.type).toBe('INSTANCE');
    expect(lintNode.properties.slice(1)).toEqual([
      {
        kind: 'fill',
        valueKind: 'color',
        parts: [
          { id: 'paint:0', boundVariableId: 'V:7', value: { kind: 'color', hex: '#000000' } },
        ],
      },
    ]);
    expect(lintNode.children.map((child: { readonly id: string }): string => child.id)).toEqual([
      '2',
    ]);
  });
});

describe('toLintNode — fills and strokes', () => {
  it('extracts solid paint fills with bound variables and hex values', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      fills: [solidPaint([74 / 255, 144 / 255, 217 / 255], 'V:1')],
    };

    const lintNode = toLintNode(node);

    expect(lintNode.properties.slice(1)).toEqual([
      {
        kind: 'fill',
        valueKind: 'color',
        parts: [
          { id: 'paint:0', boundVariableId: 'V:1', value: { kind: 'color', hex: '#4A90D9' } },
        ],
      },
    ]);
  });

  it('labels each paint when there are several', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      fills: [solidPaint([1, 0, 0]), solidPaint([0, 1, 0])],
    };

    const lintNode = toLintNode(node);
    const parts = lintNode.properties[1]!.parts;

    expect(parts).toHaveLength(2);
    expect(parts[0]!.label).toBe('paint 1');
    expect(parts[1]!.label).toBe('paint 2');
  });

  it('skips image, gradient and hidden paints', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      fills: [
        { type: 'IMAGE', imageHash: 'hash' },
        {
          type: 'GRADIENT_LINEAR',
          gradientTransform: [
            [1, 0, 0],
            [0, 1, 0],
          ],
          gradientStops: [],
        },
        { type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 }, visible: false },
        solidPaint([1, 1, 1]),
      ],
    };

    const lintNode = toLintNode(node);

    expect(lintNode.properties[1]!.parts).toHaveLength(1);
  });

  it('skips mixed fill arrays', () => {
    const node: AnyFigmaNode = { id: '1', name: 'Frame', type: 'FRAME', fills: MIXED };

    expect(toLintNode(node).properties.slice(1)).toEqual([]);
  });

  it('skips empty fill arrays', () => {
    const node: AnyFigmaNode = { id: '1', name: 'Frame', type: 'FRAME', fills: [] };

    expect(toLintNode(node).properties.slice(1)).toEqual([]);
  });

  it('extracts strokes with bound variables', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Rect',
      type: 'RECTANGLE',
      strokes: [solidPaint([0, 0, 0], 'V:9')],
    };

    const lintNode = toLintNode(node);

    expect(lintNode.properties.slice(1)).toEqual([
      {
        kind: 'stroke',
        valueKind: 'color',
        parts: [
          { id: 'paint:0', boundVariableId: 'V:9', value: { kind: 'color', hex: '#000000' } },
        ],
      },
    ]);
  });
});

describe('toLintNode — auto-layout padding and gap', () => {
  it('merges uniform padding into a single property-level part', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 16,
      paddingBottom: 16,
      boundVariables: {
        paddingLeft: { type: 'VARIABLE_ALIAS', id: 'V:6' },
        paddingRight: { type: 'VARIABLE_ALIAS', id: 'V:6' },
        paddingTop: { type: 'VARIABLE_ALIAS', id: 'V:6' },
        paddingBottom: { type: 'VARIABLE_ALIAS', id: 'V:6' },
      },
    };

    const lintNode = toLintNode(node);

    expect(lintNode.properties.slice(1)).toEqual([
      {
        kind: 'padding',
        valueKind: 'number',
        parts: [{ id: 'uniform', boundVariableId: 'V:6', value: { kind: 'number', value: 16 } }],
      },
    ]);
  });

  it('keeps distinct padding sides as separate parts and drops zeros', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      paddingLeft: 16,
      paddingRight: 0,
      paddingTop: 24,
      paddingBottom: 0,
      boundVariables: {
        paddingLeft: { type: 'VARIABLE_ALIAS', id: 'V:6' },
      },
    };

    const lintNode = toLintNode(node);

    expect(lintNode.properties.slice(1)).toEqual([
      {
        kind: 'padding',
        valueKind: 'number',
        parts: [
          { id: 'paddingTop', label: 'top', value: { kind: 'number', value: 24 } },
          {
            id: 'paddingLeft',
            label: 'left',
            boundVariableId: 'V:6',
            value: { kind: 'number', value: 16 },
          },
        ],
      },
    ]);
  });

  it('drops all-zero padding entirely', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    };

    expect(toLintNode(node).properties.slice(1)).toEqual([]);
  });

  it('extracts gap with its binding', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      itemSpacing: 12,
      boundVariables: { itemSpacing: { type: 'VARIABLE_ALIAS', id: 'V:6' } },
    };

    expect(toLintNode(node).properties.slice(1)).toEqual([
      {
        kind: 'gap',
        valueKind: 'number',
        parts: [{ id: 'uniform', boundVariableId: 'V:6', value: { kind: 'number', value: 12 } }],
      },
    ]);
  });

  it('drops zero gap', () => {
    const node: AnyFigmaNode = { id: '1', name: 'Frame', type: 'FRAME', itemSpacing: 0 };

    expect(toLintNode(node).properties.slice(1)).toEqual([]);
  });
});

describe('toLintNode — corner radius', () => {
  it('keeps the token binding when the uniform radius is bound on the four corners', () => {
    // Figma stores a corner-radius binding applied in the UI on the four
    // individual corner fields, never on `cornerRadius` (boundVariables docs).
    const alias = { type: 'VARIABLE_ALIAS' as const, id: 'V:2' };
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Card',
      type: 'FRAME',
      cornerRadius: 8,
      topLeftRadius: 8,
      topRightRadius: 8,
      bottomLeftRadius: 8,
      bottomRightRadius: 8,
      boundVariables: {
        topLeftRadius: alias,
        topRightRadius: alias,
        bottomLeftRadius: alias,
        bottomRightRadius: alias,
      },
    };

    expect(toLintNode(node).properties.slice(1)).toEqual([
      {
        kind: 'cornerRadius',
        valueKind: 'number',
        parts: [{ id: 'uniform', boundVariableId: 'V:2', value: { kind: 'number', value: 8 } }],
      },
    ]);
  });

  it('keeps per-corner parts when one corner is unbound', () => {
    const alias = { type: 'VARIABLE_ALIAS' as const, id: 'V:2' };
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Card',
      type: 'FRAME',
      cornerRadius: 8,
      topLeftRadius: 8,
      topRightRadius: 8,
      bottomLeftRadius: 8,
      bottomRightRadius: 8,
      boundVariables: {
        topLeftRadius: alias,
        topRightRadius: alias,
        bottomLeftRadius: alias,
      },
    };

    expect(toLintNode(node).properties.slice(1)).toEqual([
      {
        kind: 'cornerRadius',
        valueKind: 'number',
        parts: [
          {
            id: 'topLeftRadius',
            label: 'top left',
            boundVariableId: 'V:2',
            value: { kind: 'number', value: 8 },
          },
          {
            id: 'topRightRadius',
            label: 'top right',
            boundVariableId: 'V:2',
            value: { kind: 'number', value: 8 },
          },
          {
            id: 'bottomLeftRadius',
            label: 'bottom left',
            boundVariableId: 'V:2',
            value: { kind: 'number', value: 8 },
          },
          {
            id: 'bottomRightRadius',
            label: 'bottom right',
            value: { kind: 'number', value: 8 },
          },
        ],
      },
    ]);
  });

  it('uses the corner radius alias for nodes without independent corners', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Label',
      type: 'TEXT',
      cornerRadius: 8,
      boundVariables: { cornerRadius: { type: 'VARIABLE_ALIAS', id: 'V:2' } },
    };

    expect(toLintNode(node).properties[1]).toEqual({
      kind: 'cornerRadius',
      valueKind: 'number',
      parts: [{ id: 'uniform', boundVariableId: 'V:2', value: { kind: 'number', value: 8 } }],
    });
  });

  it('reads per-corner radii when the uniform value is mixed', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Bubble',
      type: 'RECTANGLE',
      cornerRadius: MIXED,
      topLeftRadius: 8,
      topRightRadius: 8,
      bottomLeftRadius: 0,
      bottomRightRadius: 24,
    };

    expect(toLintNode(node).properties.slice(1)).toEqual([
      {
        kind: 'cornerRadius',
        valueKind: 'number',
        parts: [
          { id: 'topLeftRadius', label: 'top left', value: { kind: 'number', value: 8 } },
          { id: 'topRightRadius', label: 'top right', value: { kind: 'number', value: 8 } },
          { id: 'bottomRightRadius', label: 'bottom right', value: { kind: 'number', value: 24 } },
        ],
      },
    ]);
  });

  it('skips corner radius when corners are partially missing', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Weird',
      type: 'RECTANGLE',
      cornerRadius: MIXED,
      topLeftRadius: 8,
    };

    expect(toLintNode(node).properties.slice(1)).toEqual([]);
  });

  it('reads per-corner bindings', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Bubble',
      type: 'RECTANGLE',
      cornerRadius: MIXED,
      topLeftRadius: 8,
      topRightRadius: 8,
      bottomLeftRadius: 8,
      bottomRightRadius: 8,
      boundVariables: {
        topLeftRadius: { type: 'VARIABLE_ALIAS', id: 'V:2' },
        topRightRadius: { type: 'VARIABLE_ALIAS', id: 'V:3' },
        bottomLeftRadius: { type: 'VARIABLE_ALIAS', id: 'V:2' },
        bottomRightRadius: { type: 'VARIABLE_ALIAS', id: 'V:3' },
      },
    };

    // Same values but distinct bindings → not uniform, kept per corner
    const parts = toLintNode(node).properties[1]!.parts;

    expect(parts).toHaveLength(4);
    expect(parts[0]!.boundVariableId).toBe('V:2');
    expect(parts[1]!.boundVariableId).toBe('V:3');
  });

  it('drops all-zero corner radius entirely', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Square',
      type: 'RECTANGLE',
      cornerRadius: 0,
    };

    expect(toLintNode(node).properties.slice(1)).toEqual([]);
  });
});

describe('toLintNode — stroke weight extraction', () => {
  function strokeWeightProperties(node: AnyFigmaNode) {
    return toLintNode(node).properties.filter(
      (property): boolean => property.kind === 'strokeWeight',
    );
  }

  it('extracts a raw stroke weight', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Rect',
      type: 'RECTANGLE',
      strokeWeight: 1,
      strokes: [solidPaint([0, 0, 0])],
    };

    expect(strokeWeightProperties(node)).toEqual([
      {
        kind: 'strokeWeight',
        valueKind: 'number',
        parts: [{ id: 'uniform', boundVariableId: undefined, value: { kind: 'number', value: 1 } }],
      },
    ]);
  });

  it('extracts a bound stroke weight', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Rect',
      type: 'RECTANGLE',
      strokeWeight: 2,
      strokes: [solidPaint([0, 0, 0])],
      boundVariables: { strokeWeight: { type: 'VARIABLE_ALIAS', id: 'V:stroke' } },
    };

    expect(strokeWeightProperties(node)[0]!.parts[0]!.boundVariableId).toBe('V:stroke');
  });

  it('skips zero and mixed stroke weights', () => {
    expect(
      strokeWeightProperties({
        id: '1',
        name: 'A',
        type: 'RECTANGLE',
        strokeWeight: 0,
        strokes: [solidPaint([0, 0, 0])],
      }),
    ).toEqual([]);
    expect(
      strokeWeightProperties({
        id: '1',
        name: 'A',
        type: 'RECTANGLE',
        strokeWeight: MIXED,
        strokes: [solidPaint([0, 0, 0])],
      }),
    ).toEqual([]);
    expect(strokeWeightProperties({ id: '1', name: 'A', type: 'RECTANGLE' })).toEqual([]);
  });

  it('skips stroke weights on nodes without visible strokes (Figma default)', () => {
    const strokeless: AnyFigmaNode = {
      id: '1',
      name: 'Text',
      type: 'TEXT',
      strokeWeight: 1,
    };

    expect(strokeWeightProperties(strokeless)).toEqual([]);

    const invisibleStrokes: AnyFigmaNode = {
      id: '2',
      name: 'Frame',
      type: 'FRAME',
      strokeWeight: 1,
      strokes: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 }, visible: false }],
    };

    expect(strokeWeightProperties(invisibleStrokes)).toEqual([]);

    const mixedStrokes: AnyFigmaNode = {
      id: '3',
      name: 'Frame',
      type: 'FRAME',
      strokeWeight: 1,
      strokes: MIXED,
    };

    expect(strokeWeightProperties(mixedStrokes)).toEqual([]);
  });
});

describe('toLintNode — opacity extraction', () => {
  it('extracts semi-transparent opacity as a raw number', () => {
    const node: AnyFigmaNode = { id: '1', name: 'Frame', type: 'FRAME', opacity: 0.5 };

    expect(toLintNode(node).properties.slice(1)).toEqual([
      {
        kind: 'opacity',
        valueKind: 'number',
        parts: [{ id: 'uniform', value: { kind: 'number', value: 0.5 } }],
      },
    ]);
  });

  it('skips the default (1), zero and mixed opacity', () => {
    const kinds = (node: AnyFigmaNode): readonly string[] =>
      toLintNode(node).properties.map((property): string => property.kind);

    expect(kinds({ id: '1', name: 'A', type: 'FRAME', opacity: 1 })).toEqual(['component']);
    expect(kinds({ id: '1', name: 'A', type: 'FRAME', opacity: 0 })).toEqual(['component']);
    expect(kinds({ id: '1', name: 'A', type: 'FRAME', opacity: MIXED })).toEqual(['component']);
    expect(kinds({ id: '1', name: 'A', type: 'FRAME' })).toEqual(['component']);
  });
});

describe('toLintNode — blend mode extraction', () => {
  it('extracts non-default blend modes', () => {
    const node: AnyFigmaNode = { id: '1', name: 'Frame', type: 'FRAME', blendMode: 'MULTIPLY' };

    expect(toLintNode(node).properties.slice(1)).toEqual([
      {
        kind: 'blendMode',
        valueKind: 'string',
        parts: [{ id: 'uniform', value: { kind: 'string', value: 'MULTIPLY' } }],
      },
    ]);
  });

  it('skips the accepted defaults, mixed and absent blend modes', () => {
    const kinds = (node: AnyFigmaNode): readonly string[] =>
      toLintNode(node).properties.map((property): string => property.kind);

    expect(kinds({ id: '1', name: 'A', type: 'FRAME', blendMode: 'NORMAL' })).toEqual([
      'component',
    ]);
    expect(kinds({ id: '1', name: 'A', type: 'FRAME', blendMode: 'PASS_THROUGH' })).toEqual([
      'component',
    ]);
    expect(kinds({ id: '1', name: 'A', type: 'FRAME', blendMode: MIXED })).toEqual(['component']);
    expect(kinds({ id: '1', name: 'A', type: 'FRAME' })).toEqual(['component']);
  });
});

describe('toLintNode — effect extraction', () => {
  it('extracts a raw drop shadow with type, radius and offset', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Card',
      type: 'FRAME',
      effects: [
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.25 },
          radius: 4,
          offset: { x: 0, y: 2 },
        },
      ],
    };

    expect(toLintNode(node).properties.slice(1)).toEqual([
      {
        kind: 'effect',
        valueKind: 'effect',
        parts: [
          {
            id: 'effect:0',
            boundVariableId: undefined,
            value: {
              kind: 'effect',
              effectType: 'DROP_SHADOW',
              radius: 4,
              offset: { x: 0, y: 2 },
            },
          },
        ],
      },
    ]);
  });

  it('extracts a variable-bound effect color', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Card',
      type: 'FRAME',
      effects: [
        {
          type: 'DROP_SHADOW',
          boundVariables: { color: { type: 'VARIABLE_ALIAS', id: 'V:shadow' } },
        },
      ],
    };

    expect(toLintNode(node).properties[1]!.parts[0]!.boundVariableId).toBe('V:shadow');
  });

  it('carries the applied effect style id on the parts', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Card',
      type: 'FRAME',
      effectStyleId: 'S:1',
      effects: [{ type: 'LAYER_BLUR', radius: 8 }],
    };

    expect(toLintNode(node).properties[1]!.parts[0]!.value).toEqual({
      kind: 'effect',
      effectType: 'LAYER_BLUR',
      radius: 8,
      styleId: 'S:1',
    });
  });

  it('labels each part when several effects are present and skips hidden ones', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Card',
      type: 'FRAME',
      effects: [
        { type: 'DROP_SHADOW', visible: false },
        { type: 'INNER_SHADOW', radius: 2 },
        { type: 'LAYER_BLUR', radius: 8 },
      ],
    };

    const parts = toLintNode(node).properties[1]!.parts;

    expect(parts).toHaveLength(2);
    expect(parts[0]!.label).toBe('inner shadow');
    expect(parts[0]!.id).toBe('effect:1');
    expect(parts[1]!.label).toBe('layer blur');
    expect(parts[1]!.id).toBe('effect:2');
  });

  it('skips mixed and empty effect arrays', () => {
    const kinds = (node: AnyFigmaNode): readonly string[] =>
      toLintNode(node).properties.map((property): string => property.kind);

    expect(kinds({ id: '1', name: 'A', type: 'FRAME', effects: MIXED })).toEqual(['component']);
    expect(kinds({ id: '1', name: 'A', type: 'FRAME', effects: [] })).toEqual(['component']);
    expect(kinds({ id: '1', name: 'A', type: 'FRAME' })).toEqual(['component']);
  });
});

describe('toLintNode — text content extraction', () => {
  it('extracts non-empty text content', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Headline',
      type: 'TEXT',
      characters: 'Lorem ipsum dolor sit amet',
    };

    expect(toLintNode(node).properties[1]).toEqual({
      kind: 'textContent',
      valueKind: 'string',
      parts: [{ id: 'uniform', value: { kind: 'string', value: 'Lorem ipsum dolor sit amet' } }],
    });
  });

  it('skips empty, whitespace-only and mixed text but keeps the text-style property', () => {
    const empty = toLintNode({ id: '1', name: 'A', type: 'TEXT', characters: '' });

    expect(empty.properties.map((property): string => property.kind)).toEqual([
      'component',
      'textStyle',
    ]);
    expect(
      toLintNode({ id: '1', name: 'A', type: 'TEXT', characters: '   ' }).properties.map(
        (property): string => property.kind,
      ),
    ).toEqual(['component', 'textStyle']);
    expect(
      toLintNode({ id: '1', name: 'A', type: 'TEXT', characters: MIXED }).properties.map(
        (property): string => property.kind,
      ),
    ).toEqual(['component', 'textStyle']);
  });
});

describe('toLintNode — icon library marking', () => {
  it('marks the subtree of an instance identified through its component-set name', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'size=24',
      type: 'INSTANCE',
      children: [{ id: '2', name: 'glyph', type: 'VECTOR' }],
    };

    const lintNode = toLintNode(node, {
      instanceIdentities: new Map([
        ['1', { componentName: 'size=24', componentSetName: 'esds/icon/plus' }],
      ]),
    });

    expect(lintNode.fromIconLibrary).toBe(true);
    expect(lintNode.children[0]!.fromIconLibrary).toBe(true);
  });

  it('marks the subtree through the main component name (flat components)', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'icon',
      type: 'INSTANCE',
      children: [{ id: '2', name: 'glyph', type: 'VECTOR' }],
    };

    const lintNode = toLintNode(node, {
      instanceIdentities: new Map([['1', { componentName: 'esds/icon/plus' }]]),
    });

    expect(lintNode.fromIconLibrary).toBe(true);
    expect(lintNode.children[0]!.fromIconLibrary).toBe(true);
  });

  it('falls back to the instance layer name when no component identity exists', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'esds/icon/close',
      type: 'INSTANCE',
      children: [{ id: '2', name: 'glyph', type: 'VECTOR' }],
    };

    expect(toLintNode(node).fromIconLibrary).toBe(true);
  });

  it('leaves non-icon instances unmarked but marks nested icon instances', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Button',
      type: 'INSTANCE',
      children: [{ id: '2', name: 'icon-slot', type: 'INSTANCE' }],
    };

    const lintNode = toLintNode(node, {
      instanceIdentities: new Map([
        ['1', { componentName: 'Button/Primary', componentSetName: 'Buttons' }],
        ['2', { componentName: 'esds/icon/plus' }],
      ]),
    });

    expect(lintNode.fromIconLibrary).toBeUndefined();
    expect(lintNode.children[0]!.fromIconLibrary).toBe(true);
  });

  it('ignores icon-like names on non-instance nodes', () => {
    const node: AnyFigmaNode = { id: '1', name: 'esds/icon/plus', type: 'FRAME' };

    expect(toLintNode(node).fromIconLibrary).toBeUndefined();
  });
});

describe('toLintNode — text style extraction', () => {
  it('extracts the applied style id and the node style props', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Title',
      type: 'TEXT',
      textStyleId: 'S:1',
      fontSize: 24,
      fontName: { family: 'Inter', style: 'Bold' },
      textDecoration: 'NONE',
      lineHeight: { value: 32, unit: 'PIXELS' },
    };

    expect(toLintNode(node).properties.at(-1)).toEqual({
      kind: 'textStyle',
      valueKind: 'string',
      parts: [
        {
          id: 'uniform',
          value: {
            kind: 'textStyle',
            styleId: 'S:1',
            fontSize: 24,
            fontWeight: 'Bold',
            textDecoration: 'NONE',
            lineHeight: '32px',
          },
        },
      ],
    });
  });

  it('emits the property without a style id for hand-styled text', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Body',
      type: 'TEXT',
      fontSize: 14,
      fontName: { family: 'Inter', style: 'Regular' },
      lineHeight: { value: 150, unit: 'PERCENT' },
    };

    expect(toLintNode(node).properties.at(-1)!.parts[0]!.value).toEqual({
      kind: 'textStyle',
      fontSize: 14,
      fontWeight: 'Regular',
      lineHeight: '150%',
    });
  });

  it('omits mixed props individually and skips non-TEXT nodes', () => {
    const node: AnyFigmaNode = {
      id: '1',
      name: 'Body',
      type: 'TEXT',
      textStyleId: 'S:1',
      fontSize: MIXED,
      fontName: MIXED,
      textDecoration: MIXED,
      lineHeight: MIXED,
    };

    expect(toLintNode(node).properties.at(-1)!.parts[0]!.value).toEqual({
      kind: 'textStyle',
      styleId: 'S:1',
    });
    expect(
      toLintNode({ id: '2', name: 'Frame', type: 'FRAME', fontSize: 16 }).properties.map(
        (property): string => property.kind,
      ),
    ).toEqual(['component']);
  });
});

describe('toLintNode — component identity extraction', () => {
  it('emits the raw Figma type as a string part on every node', () => {
    const cases: readonly [AnyFigmaNode['type'], string][] = [
      ['FRAME', 'FRAME'],
      ['COMPONENT', 'COMPONENT'],
      ['COMPONENT_SET', 'COMPONENT_SET'],
      ['SECTION', 'SECTION'],
      ['GROUP', 'GROUP'],
      ['INSTANCE', 'INSTANCE'],
      ['TEXT', 'TEXT'],
      ['RECTANGLE', 'RECTANGLE'],
    ];

    for (const [type, expected] of cases) {
      const node: AnyFigmaNode = { id: '1', name: 'X', type };

      expect(toLintNode(node).properties[0]).toEqual({
        kind: 'component',
        valueKind: 'string',
        parts: [{ id: 'uniform', value: { kind: 'string', value: expected } }],
      });
    }
  });
});
