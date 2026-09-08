import { describe, expect, test } from 'vitest';
import type { GenericFigmaNodeBase } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/base/figma-node-base.ts';
import type { FigmaComponentNode } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/component/figma-component-node.ts';
import { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import {
  buildOutlinedSvgFromFigmaComponent,
  buildOutlinedSvgsFromFigmaComponents,
  extractSymbolOutlinePathsFromFigmaComponent,
} from './build-outlined-svg-from-figma-component.ts';

const logger = Logger.never();

function buildComponentNode(children: readonly GenericFigmaNodeBase[]): FigmaComponentNode {
  return {
    id: '1:1',
    name: 'esds/icon/test-icon',
    type: 'COMPONENT',
    scrollBehavior: 'SCROLLS',
    children,
    blendMode: 'PASS_THROUGH',
    clipsContent: true,
    background: [],
    fills: [],
    strokes: [],
    strokeWeight: 1,
    strokeAlign: 'INSIDE',
    fillGeometry: [],
    strokeGeometry: [],
    absoluteBoundingBox: { x: 0, y: 0, width: 24, height: 24 },
    absoluteRenderBounds: { x: 0, y: 0, width: 24, height: 24 },
    relativeTransform: [
      [1, 0, 40],
      [0, 1, 92],
    ],
    size: { x: 24, y: 24 },
    constraints: { vertical: 'TOP', horizontal: 'LEFT' },
    interactions: [],
  } as unknown as FigmaComponentNode;
}

function buildVectorNode({
  name = 'glyph',
  fillGeometry = [],
  strokeGeometry = [],
  relativeTransform = [
    [1, 0, 0],
    [0, 1, 0],
  ],
  visible,
}: {
  readonly name?: string;
  readonly fillGeometry?: readonly { path: string; windingRule: string }[];
  readonly strokeGeometry?: readonly { path: string; windingRule: string }[];
  readonly relativeTransform?: readonly [
    readonly [number, number, number],
    readonly [number, number, number],
  ];
  readonly visible?: boolean;
} = {}): GenericFigmaNodeBase {
  return {
    id: '1:2',
    name,
    type: 'VECTOR',
    scrollBehavior: 'SCROLLS',
    blendMode: 'PASS_THROUGH',
    visible,
    fills: [],
    fillGeometry,
    strokes: [
      {
        blendMode: 'NORMAL',
        type: 'SOLID',
        color: { r: 0, g: 0, b: 0, a: 1 },
      },
    ],
    strokeWeight: 1.75,
    strokeAlign: 'CENTER',
    strokeCap: 'ROUND',
    strokeJoin: 'ROUND',
    strokeGeometry,
    absoluteBoundingBox: { x: 2, y: 2, width: 20, height: 20 },
    absoluteRenderBounds: { x: 1.125, y: 1.125, width: 21.75, height: 21.75 },
    constraints: { vertical: 'SCALE', horizontal: 'SCALE' },
    relativeTransform,
    size: { x: 20, y: 20 },
    effects: [],
    interactions: [],
  } as unknown as GenericFigmaNodeBase;
}

function buildBooleanSubtractNode({
  fillGeometry = [],
  strokeGeometry = [],
  children = [],
}: {
  readonly fillGeometry?: readonly { path: string; windingRule: string }[];
  readonly strokeGeometry?: readonly { path: string; windingRule: string }[];
  readonly children?: readonly GenericFigmaNodeBase[];
}): GenericFigmaNodeBase {
  return {
    id: '1:3',
    name: 'Subtract',
    type: 'BOOLEAN_OPERATION',
    scrollBehavior: 'SCROLLS',
    blendMode: 'PASS_THROUGH',
    booleanOperation: 'SUBTRACT',
    children,
    fillGeometry,
    strokeGeometry,
    fills: [],
    strokes: [],
    strokeWeight: 1.75,
    strokeAlign: 'CENTER',
    absoluteBoundingBox: { x: 0, y: 0, width: 24, height: 24 },
    absoluteRenderBounds: null,
    relativeTransform: [
      [1, 0, 0],
      [0, 1, 0],
    ],
  } as unknown as GenericFigmaNodeBase;
}

const STROKE_GEOMETRY: readonly { path: string; windingRule: string }[] = [
  {
    path: 'M 2.125 11 C 2.125 6.098 6.098 2.125 11 2.125 C 15.902 2.125 19.875 6.098 19.875 11 C 19.875 15.902 15.902 19.875 11 19.875 C 6.098 19.875 2.125 15.902 2.125 11 Z',
    windingRule: 'NONZERO',
  },
];

const FILL_GEOMETRY: readonly { path: string; windingRule: string }[] = [
  {
    path: 'M 1.125 1.125 L 22.875 1.125 L 22.875 22.875 L 1.125 22.875 Z',
    windingRule: 'NONZERO',
  },
];

describe('extractSymbolOutlinePathsFromFigmaComponent', () => {
  test('extracts stroked vector geometry as outline paths with transforms composed', () => {
    const outlinedPaths = extractSymbolOutlinePathsFromFigmaComponent({
      node: buildComponentNode([
        buildVectorNode({
          strokeGeometry: STROKE_GEOMETRY,
          relativeTransform: [
            [1, 0, 1],
            [0, 1, 2],
          ],
        }),
      ]),
      logger,
    });

    expect(outlinedPaths).toHaveLength(1);
    expect(outlinedPaths[0]!.windingRule).toBe('NONZERO');
    expect(outlinedPaths[0]!.d).toContain('M 3.125 13');
  });

  test('extracts filled vector geometry', () => {
    const outlinedPaths = extractSymbolOutlinePathsFromFigmaComponent({
      node: buildComponentNode([buildVectorNode({ fillGeometry: FILL_GEOMETRY })]),
      logger,
    });

    expect(outlinedPaths).toHaveLength(1);
    expect(outlinedPaths[0]!.d).toBe(FILL_GEOMETRY[0]!.path);
  });

  test('extracts both fill and stroke geometry when a node has both', () => {
    const outlinedPaths = extractSymbolOutlinePathsFromFigmaComponent({
      node: buildComponentNode([
        buildVectorNode({
          fillGeometry: FILL_GEOMETRY,
          strokeGeometry: STROKE_GEOMETRY,
        }),
      ]),
      logger,
    });

    expect(outlinedPaths).toHaveLength(2);
  });

  test('uses the boolean node own geometry for SUBTRACT operations', () => {
    const outlinedPaths = extractSymbolOutlinePathsFromFigmaComponent({
      node: buildComponentNode([buildBooleanSubtractNode({ fillGeometry: FILL_GEOMETRY })]),
      logger,
    });

    expect(outlinedPaths).toHaveLength(1);
    expect(outlinedPaths[0]!.windingRule).toBe('NONZERO');
  });

  test('emits SUBTRACT children as EVENODD compound when the boolean node has no own geometry', () => {
    const outlinedPaths = extractSymbolOutlinePathsFromFigmaComponent({
      node: buildComponentNode([
        buildBooleanSubtractNode({
          children: [
            buildVectorNode({ name: 'base', fillGeometry: FILL_GEOMETRY }),
            buildVectorNode({ name: 'cutout', strokeGeometry: STROKE_GEOMETRY }),
          ],
        }),
      ]),
      logger,
    });

    expect(outlinedPaths).toHaveLength(2);
    expect(outlinedPaths.every(({ windingRule }) => windingRule === 'EVENODD')).toBe(true);
  });

  test('recurses into groups and composes transforms', () => {
    const groupNode = {
      id: '1:4',
      name: 'group',
      type: 'GROUP',
      scrollBehavior: 'SCROLLS',
      children: [buildVectorNode({ strokeGeometry: STROKE_GEOMETRY })],
      absoluteBoundingBox: { x: 0, y: 0, width: 24, height: 24 },
      absoluteRenderBounds: { x: 0, y: 0, width: 24, height: 24 },
      relativeTransform: [
        [1, 0, 2],
        [0, 1, 3],
      ],
    } as unknown as GenericFigmaNodeBase;

    const outlinedPaths = extractSymbolOutlinePathsFromFigmaComponent({
      node: buildComponentNode([groupNode]),
      logger,
    });

    expect(outlinedPaths).toHaveLength(1);
    expect(outlinedPaths[0]!.d).toContain('M 4.125 14');
  });

  test('skips invisible children', () => {
    const outlinedPaths = extractSymbolOutlinePathsFromFigmaComponent({
      node: buildComponentNode([
        buildVectorNode({ strokeGeometry: STROKE_GEOMETRY, visible: false }),
      ]),
      logger,
    });

    expect(outlinedPaths).toHaveLength(0);
  });

  test('skips children without geometry', () => {
    const outlinedPaths = extractSymbolOutlinePathsFromFigmaComponent({
      node: buildComponentNode([buildVectorNode()]),
      logger,
    });

    expect(outlinedPaths).toHaveLength(0);
  });

  test('skips geometry-less vector nodes without geometry fields', () => {
    const bareVectorNode = {
      id: '1:7',
      name: 'bare',
      type: 'VECTOR',
      scrollBehavior: 'SCROLLS',
      blendMode: 'PASS_THROUGH',
      size: { x: 20, y: 20 },
    } as unknown as GenericFigmaNodeBase;

    const outlinedPaths = extractSymbolOutlinePathsFromFigmaComponent({
      node: buildComponentNode([bareVectorNode]),
      logger,
    });

    expect(outlinedPaths).toHaveLength(0);
  });

  test('skips children when the node has no children property', () => {
    const childlessNode: FigmaComponentNode = buildComponentNode([]);
    delete (childlessNode as unknown as Record<string, unknown>)['children'];

    expect(
      extractSymbolOutlinePathsFromFigmaComponent({ node: childlessNode, logger }),
    ).toHaveLength(0);
  });

  test('skips children when the children property is not an array', () => {
    const weirdNode = {
      ...buildComponentNode([]),
      children: 'unexpected',
    } as unknown as FigmaComponentNode;

    expect(extractSymbolOutlinePathsFromFigmaComponent({ node: weirdNode, logger })).toHaveLength(
      0,
    );
  });

  test('extracts geometry from shape nodes like ellipses', () => {
    const ellipseNode = {
      id: '1:6',
      name: 'circle',
      type: 'ELLIPSE',
      scrollBehavior: 'SCROLLS',
      blendMode: 'PASS_THROUGH',
      fills: [],
      fillGeometry: [],
      strokes: [],
      strokeWeight: 1.75,
      strokeAlign: 'CENTER',
      strokeGeometry: STROKE_GEOMETRY,
      relativeTransform: [
        [1, 0, 1],
        [0, 1, 1],
      ],
    } as unknown as GenericFigmaNodeBase;

    const outlinedPaths = extractSymbolOutlinePathsFromFigmaComponent({
      node: buildComponentNode([ellipseNode]),
      logger,
    });

    expect(outlinedPaths).toHaveLength(1);
    expect(outlinedPaths[0]!.d).toContain('M 3.125 12');
  });

  test('throws on unsupported node types', () => {
    const textNode = {
      id: '1:5',
      name: 'text',
      type: 'TEXT',
      scrollBehavior: 'SCROLLS',
      blendMode: 'PASS_THROUGH',
      characters: 'hello',
    } as unknown as GenericFigmaNodeBase;

    expect(() =>
      extractSymbolOutlinePathsFromFigmaComponent({
        node: buildComponentNode([textNode]),
        logger,
      }),
    ).toThrow('Unsupported node type "TEXT" in component "esds/icon/test-icon".');
  });

  test('throws on an unexpected Figma winding rule', () => {
    expect(() =>
      extractSymbolOutlinePathsFromFigmaComponent({
        node: buildComponentNode([
          buildVectorNode({
            fillGeometry: [{ path: FILL_GEOMETRY[0]!.path, windingRule: 'INVERTED' }],
          }),
        ]),
        logger,
      }),
    ).toThrow('Unexpected winding rule: "INVERTED".');
  });
});

describe('buildOutlinedSvgFromFigmaComponent', () => {
  test('builds a 24x24 outlined svg', () => {
    const svg = buildOutlinedSvgFromFigmaComponent({
      node: buildComponentNode([buildVectorNode({ strokeGeometry: STROKE_GEOMETRY })]),
      logger,
    });

    expect(svg).toBe(
      `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M 2.125 11 C 2.125 6.098 6.098 2.125 11 2.125 C 15.902 2.125 19.875 6.098 19.875 11 C 19.875 15.902 15.902 19.875 11 19.875 C 6.098 19.875 2.125 15.902 2.125 11 Z" fill="black"/>
</svg>
`,
    );
  });

  test('adds a fill-rule attribute for EVENODD winding', () => {
    const svg = buildOutlinedSvgFromFigmaComponent({
      node: buildComponentNode([
        buildVectorNode({ fillGeometry: [{ path: 'M 1 1 L 2 2 Z', windingRule: 'EVENODD' }] }),
      ]),
      logger,
    });

    expect(svg).toContain('fill-rule="evenodd"');
  });

  test('throws when no outline geometry is extracted', () => {
    expect(() =>
      buildOutlinedSvgFromFigmaComponent({
        node: buildComponentNode([]),
        logger,
      }),
    ).toThrow('No outline geometry extracted for component "esds/icon/test-icon".');
  });
});

describe('buildOutlinedSvgsFromFigmaComponents', () => {
  test('builds and writes an outlined svg per component', async () => {
    const written: { name: string; svg: string }[] = [];

    await buildOutlinedSvgsFromFigmaComponents({
      components: [
        ['a', buildComponentNode([buildVectorNode({ strokeGeometry: STROKE_GEOMETRY })])],
        ['b', buildComponentNode([buildVectorNode({ fillGeometry: FILL_GEOMETRY })])],
      ],
      writeSvg: async (write): Promise<void> => {
        written.push(write);
      },
      logger,
    });

    expect(written.map(({ name }): string => name)).toEqual(['a', 'b']);
    expect(written.every(({ svg }): boolean => svg.startsWith('<svg'))).toBe(true);
  });

  test('isolates failing components, writes the rest, and aggregates all failures into a single error', async () => {
    const writtenNames: string[] = [];
    const textNode = {
      id: '1:5',
      name: 'text',
      type: 'TEXT',
      scrollBehavior: 'SCROLLS',
      blendMode: 'PASS_THROUGH',
      characters: 'hello',
    } as unknown as GenericFigmaNodeBase;

    await expect(
      buildOutlinedSvgsFromFigmaComponents({
        components: [
          ['ok-1', buildComponentNode([buildVectorNode({ strokeGeometry: STROKE_GEOMETRY })])],
          ['bad-2', buildComponentNode([])],
          ['bad-1', buildComponentNode([textNode])],
          ['ok-2', buildComponentNode([buildVectorNode({ fillGeometry: FILL_GEOMETRY })])],
        ],
        writeSvg: async ({ name }): Promise<void> => {
          writtenNames.push(name);
        },
        logger,
      }),
    ).rejects.toThrow(
      'Failed to generate 2 of 4 outlined SVG(s):\n' +
        '- "bad-1": Unsupported node type "TEXT" in component "esds/icon/test-icon".\n' +
        '- "bad-2": No outline geometry extracted for component "esds/icon/test-icon".',
    );

    expect(writtenNames.sort()).toEqual(['ok-1', 'ok-2']);
  });

  test('stringifies non-Error build failures', async () => {
    const throwingVectorNode: GenericFigmaNodeBase = buildVectorNode();
    Object.defineProperty(throwingVectorNode, 'fillGeometry', {
      get(): string {
        throw 'boom';
      },
    });

    await expect(
      buildOutlinedSvgsFromFigmaComponents({
        components: [['bad', buildComponentNode([throwingVectorNode])]],
        writeSvg: async (): Promise<void> => {
          throw new Error('should not be reached');
        },
        logger,
      }),
    ).rejects.toThrow('Failed to generate 1 of 1 outlined SVG(s):\n- "bad": boom');
  });

  test('propagates write errors immediately', async () => {
    await expect(
      buildOutlinedSvgsFromFigmaComponents({
        components: [
          ['a', buildComponentNode([buildVectorNode({ strokeGeometry: STROKE_GEOMETRY })])],
        ],
        writeSvg: async (): Promise<void> => {
          throw new Error('disk full');
        },
        logger,
      }),
    ).rejects.toThrow('disk full');
  });
});
