import { describe, expect, it } from 'vitest';
import type { FigmaNode, FigmaPaint } from './figma-types.ts';
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
    const node: FigmaNode = {
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
    const node: FigmaNode = {
      id: '1',
      name: 'Instance',
      type: 'INSTANCE',
      fills: [solidPaint([0, 0, 0], 'V:7')],
      children: [{ id: '2', name: 'Child', type: 'RECTANGLE' }],
    };

    const lintNode = toLintNode(node);

    expect(lintNode.type).toBe('INSTANCE');
    expect(lintNode.properties).toEqual([
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
    const node: FigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      fills: [solidPaint([74 / 255, 144 / 255, 217 / 255], 'V:1')],
    };

    const lintNode = toLintNode(node);

    expect(lintNode.properties).toEqual([
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
    const node: FigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      fills: [solidPaint([1, 0, 0]), solidPaint([0, 1, 0])],
    };

    const lintNode = toLintNode(node);
    const parts = lintNode.properties[0]!.parts;

    expect(parts).toHaveLength(2);
    expect(parts[0]!.label).toBe('paint 1');
    expect(parts[1]!.label).toBe('paint 2');
  });

  it('skips image, gradient and hidden paints', () => {
    const node: FigmaNode = {
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

    expect(lintNode.properties[0]!.parts).toHaveLength(1);
  });

  it('skips mixed fill arrays', () => {
    const node: FigmaNode = { id: '1', name: 'Frame', type: 'FRAME', fills: MIXED };

    expect(toLintNode(node).properties).toEqual([]);
  });

  it('skips empty fill arrays', () => {
    const node: FigmaNode = { id: '1', name: 'Frame', type: 'FRAME', fills: [] };

    expect(toLintNode(node).properties).toEqual([]);
  });

  it('extracts strokes with bound variables', () => {
    const node: FigmaNode = {
      id: '1',
      name: 'Rect',
      type: 'RECTANGLE',
      strokes: [solidPaint([0, 0, 0], 'V:9')],
    };

    const lintNode = toLintNode(node);

    expect(lintNode.properties).toEqual([
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
    const node: FigmaNode = {
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

    expect(lintNode.properties).toEqual([
      {
        kind: 'padding',
        valueKind: 'number',
        parts: [{ id: 'uniform', boundVariableId: 'V:6', value: { kind: 'number', value: 16 } }],
      },
    ]);
  });

  it('keeps distinct padding sides as separate parts and drops zeros', () => {
    const node: FigmaNode = {
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

    expect(lintNode.properties).toEqual([
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
    const node: FigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    };

    expect(toLintNode(node).properties).toEqual([]);
  });

  it('extracts gap with its binding', () => {
    const node: FigmaNode = {
      id: '1',
      name: 'Frame',
      type: 'FRAME',
      itemSpacing: 12,
      boundVariables: { itemSpacing: { type: 'VARIABLE_ALIAS', id: 'V:6' } },
    };

    expect(toLintNode(node).properties).toEqual([
      {
        kind: 'gap',
        valueKind: 'number',
        parts: [{ id: 'uniform', boundVariableId: 'V:6', value: { kind: 'number', value: 12 } }],
      },
    ]);
  });

  it('drops zero gap', () => {
    const node: FigmaNode = { id: '1', name: 'Frame', type: 'FRAME', itemSpacing: 0 };

    expect(toLintNode(node).properties).toEqual([]);
  });
});

describe('toLintNode — corner radius', () => {
  it('keeps the token binding when the uniform radius is bound on the four corners', () => {
    // Figma stores a corner-radius binding applied in the UI on the four
    // individual corner fields, never on `cornerRadius` (boundVariables docs).
    const alias = { type: 'VARIABLE_ALIAS' as const, id: 'V:2' };
    const node: FigmaNode = {
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

    expect(toLintNode(node).properties).toEqual([
      {
        kind: 'cornerRadius',
        valueKind: 'number',
        parts: [{ id: 'uniform', boundVariableId: 'V:2', value: { kind: 'number', value: 8 } }],
      },
    ]);
  });

  it('keeps per-corner parts when one corner is unbound', () => {
    const alias = { type: 'VARIABLE_ALIAS' as const, id: 'V:2' };
    const node: FigmaNode = {
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

    expect(toLintNode(node).properties).toEqual([
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
    const node: FigmaNode = {
      id: '1',
      name: 'Label',
      type: 'TEXT',
      cornerRadius: 8,
      boundVariables: { cornerRadius: { type: 'VARIABLE_ALIAS', id: 'V:2' } },
    };

    expect(toLintNode(node).properties).toEqual([
      {
        kind: 'cornerRadius',
        valueKind: 'number',
        parts: [{ id: 'uniform', boundVariableId: 'V:2', value: { kind: 'number', value: 8 } }],
      },
    ]);
  });

  it('reads per-corner radii when the uniform value is mixed', () => {
    const node: FigmaNode = {
      id: '1',
      name: 'Bubble',
      type: 'RECTANGLE',
      cornerRadius: MIXED,
      topLeftRadius: 8,
      topRightRadius: 8,
      bottomLeftRadius: 0,
      bottomRightRadius: 24,
    };

    expect(toLintNode(node).properties).toEqual([
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
    const node: FigmaNode = {
      id: '1',
      name: 'Weird',
      type: 'RECTANGLE',
      cornerRadius: MIXED,
      topLeftRadius: 8,
    };

    expect(toLintNode(node).properties).toEqual([]);
  });

  it('reads per-corner bindings', () => {
    const node: FigmaNode = {
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
    const parts = toLintNode(node).properties[0]!.parts;

    expect(parts).toHaveLength(4);
    expect(parts[0]!.boundVariableId).toBe('V:2');
    expect(parts[1]!.boundVariableId).toBe('V:3');
  });

  it('drops all-zero corner radius entirely', () => {
    const node: FigmaNode = {
      id: '1',
      name: 'Square',
      type: 'RECTANGLE',
      cornerRadius: 0,
    };

    expect(toLintNode(node).properties).toEqual([]);
  });
});
