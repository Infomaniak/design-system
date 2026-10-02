import { describe, expect, test } from 'vitest';
import { computePathDataBoundingBox } from '../icons/bake-transform-into-path.ts';
import type { SvgOutlinePath } from '../icons/outline-path.ts';
import {
  buildSymbolSvg,
  fitSymbolOutlinePathsToVariant,
  getSymbolCanvasOverflowWarnings,
  getSymbolCanvasScale,
} from './build-symbol-svg.ts';
import type { SymbolTemplate, SymbolTemplateVariant } from './parse-symbol-template.ts';
import { parseSymbolTemplate, readSymbolTemplate } from './parse-symbol-template.ts';
import { SYMBOL_CANVAS_SIZE, SYMBOL_FILL_RATIO } from './sf-symbols-config.ts';

const SQUARE_OUTLINED_PATH: readonly SvgOutlinePath[] = [
  { d: 'M 4 4 L 20 4 L 20 20 L 4 20 Z', windingRule: 'NONZERO' },
];

const SYNTHETIC_TEMPLATE: string = `
<g id="Ultralight-S" transform="matrix(1 0 0 1 1 0)">
  <path class="SFSymbolsPreviewWireframe" d="M 0 0" />
</g>
<g id="Regular-S" transform="matrix(1 0 0 1 2 0)">
  <path class="SFSymbolsPreviewWireframe" d="M 0 0" />
</g>
<g id="Black-S" transform="matrix(1 0 0 1 3 0)">
  <path class="SFSymbolsPreviewWireframe" d="M 0 0" />
</g>
<line id="left-margin-Ultralight-S" style="fill:none" x1="1" y1="1"/>
<line id="right-margin-Ultralight-S" style="fill:none" x1="91" y1="1"/>
<line id="left-margin-Regular-S" style="fill:none" x1="2" y1="1"/>
<line id="right-margin-Regular-S" style="fill:none" x1="82" y1="1"/>
<line id="left-margin-Black-S" style="fill:none" x1="3" y1="1"/>
<line id="right-margin-Black-S" style="fill:none" x1="93" y1="1"/>
<line id="Capline-S" style="fill:none" x1="1" y1="10"/>
<line id="Baseline-S" style="fill:none" x1="1" y1="80"/>
`;

describe('buildSymbolSvg', () => {
  test('bakes identical geometry into the three weight variants', async () => {
    const template = await readSymbolTemplate();
    const svg = buildSymbolSvg({
      symbolName: 'square',
      outlinedPaths: SQUARE_OUTLINED_PATH,
      template,
    });

    const groupContents: readonly string[] = template.variants.map(({ id }) => {
      const match = new RegExp(`<g id="${id}"[^>]*>\\s*([\\s\\S]*?)\\s*</g>`).exec(svg);
      expect(match).not.toBeNull();
      return match![1]!;
    });

    const pathDataList: readonly string[] = groupContents.map((content: string): string => {
      const match = /d="([^"]+)"/.exec(content);
      expect(match).not.toBeNull();
      return match![1]!;
    });
    expect(groupContents[0]).toContain('class="SFSymbolsPreviewWireframe"');
    expect(groupContents[0]).not.toContain('fill-rule');

    const fittedBoundingBoxes = pathDataList.map((d: string) => computePathDataBoundingBox(d));

    expect(
      new Set(fittedBoundingBoxes.map(({ minY, maxY }): string => `${minY}/${maxY}`)).size,
    ).toBe(1);
    expect(
      new Set(fittedBoundingBoxes.map(({ minX, maxX }): string => (maxX - minX).toFixed(3))).size,
    ).toBe(1);

    const cellHeight: number = template.baselineY - template.caplineY;
    const ultralightVariant = template.variants.find(({ id }): boolean => id === 'Ultralight-S')!;
    const canvasScale: number = getSymbolCanvasScale({ variant: ultralightVariant, template });

    // the 24×24 design canvas is mapped onto the cell: the square (4..20) keeps its inset
    expect(fittedBoundingBoxes[0]!.minY).toBeCloseTo(-cellHeight + canvasScale * 4, 3);
    expect(fittedBoundingBoxes[0]!.maxY).toBeCloseTo(-cellHeight + canvasScale * 20, 3);
    expect(fittedBoundingBoxes[0]!.minX).toBeCloseTo(
      ultralightVariant.cellWidth / 2 - canvasScale * 8,
      3,
    );

    expect(svg).toContain('Generated from square');
    expect(svg).not.toContain('Generated from symbol');
  });

  test('keeps the Apple guide lines required by Xcode for every scale row', async () => {
    const template = await readSymbolTemplate();
    const svg = buildSymbolSvg({
      symbolName: 'square',
      outlinedPaths: SQUARE_OUTLINED_PATH,
      template,
    });

    const guideLineIds: readonly string[] = [
      'Capline-S',
      'Baseline-S',
      'Capline-M',
      'Baseline-M',
      'Capline-L',
      'Baseline-L',
    ];
    for (const guideLineId of guideLineIds) {
      expect(svg).toContain(`<line id="${guideLineId}"`);
    }
  });

  test('computes the bounding box per path, supporting relative path starts', async () => {
    const template = await readSymbolTemplate();
    const svg = buildSymbolSvg({
      symbolName: 'relative',
      outlinedPaths: [
        { d: 'M 2 0 L 4 0', windingRule: 'NONZERO' },
        { d: 'm 1 1 L 3 3 Z', windingRule: 'NONZERO' },
      ],
      template,
    });

    const regularVariant = template.variants.find(({ id }): boolean => id === 'Regular-S')!;
    const groupBody: string =
      new RegExp(`<g id="Regular-S"[^>]*>([\\s\\S]*?)</g>`).exec(svg)?.[1] ?? '';
    const fittedPathDataList: readonly string[] = [...groupBody.matchAll(/d="([^"]+)"/g)].map(
      (match: RegExpMatchArray): string => match[1]!,
    );
    const fittedBoundingBox = computePathDataBoundingBox(fittedPathDataList.join(' '));

    const scale: number = getSymbolCanvasScale({ variant: regularVariant, template });

    // the source artwork spans x 1..4 on the 24 design canvas (the relative path start
    // is resolved per path)
    expect(fittedBoundingBox.minX).toBeCloseTo(regularVariant.cellWidth / 2 - 11 * scale, 3);
    expect(fittedBoundingBox.maxX).toBeCloseTo(regularVariant.cellWidth / 2 - 8 * scale, 3);
  });

  test('adds a fill-rule attribute for EVENODD winding', async () => {
    const template = await readSymbolTemplate();
    const svg = buildSymbolSvg({
      symbolName: 'evenodd',
      outlinedPaths: [{ d: SQUARE_OUTLINED_PATH[0]!.d, windingRule: 'EVENODD' }],
      template,
    });

    expect(svg).toContain('fill-rule="evenodd"');
  });

  test('does not add a fill-rule attribute for NONZERO winding', async () => {
    const template = await readSymbolTemplate();
    const svg = buildSymbolSvg({
      symbolName: 'nonzero',
      outlinedPaths: SQUARE_OUTLINED_PATH,
      template,
    });

    expect(svg).not.toContain('fill-rule');
  });

  test('throws when a template group is missing', () => {
    const template: SymbolTemplate = parseSymbolTemplate(SYNTHETIC_TEMPLATE);
    const brokenTemplate: SymbolTemplate = {
      ...template,
      content: template.content.replace(/<g id="Black-S".*?<\/g>/s, ''),
    };

    expect(() =>
      buildSymbolSvg({
        symbolName: 'square',
        outlinedPaths: SQUARE_OUTLINED_PATH,
        template: brokenTemplate,
      }),
    ).toThrow('Template group "Black-S" not found.');
  });

  test('throws when there are no outline paths', async () => {
    const template = await readSymbolTemplate();
    expect(() => buildSymbolSvg({ symbolName: 'empty', outlinedPaths: [], template })).toThrow(
      'Symbol "empty" has no outline paths.',
    );
  });
});

describe('fitSymbolOutlinePathsToVariant', () => {
  test('maps the design canvas onto the variant cell', async () => {
    const template = await readSymbolTemplate();
    const regularVariant = template.variants.find(({ id }) => id === 'Regular-S')!;
    const fittedPaths = fitSymbolOutlinePathsToVariant({
      outlinedPaths: SQUARE_OUTLINED_PATH,
      variant: regularVariant,
      template,
    });

    expect(fittedPaths).toHaveLength(1);
    expect(fittedPaths[0]!.windingRule).toBe('NONZERO');
    expect(fittedPaths[0]!.d).toBe(
      'M 15.8487 -58.7158 L 62.8213 -58.7158 L 62.8213 -11.7432 L 15.8487 -11.7432 Z',
    );
  });
});

describe('getSymbolCanvasScale', () => {
  test('scales the design canvas onto the cap height, identically for every variant', async () => {
    const template = await readSymbolTemplate();
    const cellHeight: number = template.baselineY - template.caplineY;

    const scales: readonly number[] = template.variants.map((variant): number => {
      return getSymbolCanvasScale({ variant, template });
    });

    expect(new Set(scales).size).toBe(1);
    expect(scales[0]).toBe((cellHeight / SYMBOL_CANVAS_SIZE) * SYMBOL_FILL_RATIO);
  });

  test('throws when a template cell is narrower than the cell height', () => {
    const template: SymbolTemplate = parseSymbolTemplate(SYNTHETIC_TEMPLATE);
    const narrowTemplate: SymbolTemplate = {
      ...template,
      variants: template.variants.map((variant): SymbolTemplateVariant => {
        return { ...variant, cellWidth: 69 };
      }),
    };

    expect(() => {
      getSymbolCanvasScale({ variant: narrowTemplate.variants[0]!, template: narrowTemplate });
    }).toThrow(
      'Template cell "Ultralight-S" width 69 is smaller than the cell height 70; the design-canvas mapping requires wider cells.',
    );
  });
});

describe('getSymbolCanvasOverflowWarnings', () => {
  test('returns no warning for artwork exactly on the canvas edges', async () => {
    const template = await readSymbolTemplate();
    expect(
      getSymbolCanvasOverflowWarnings({
        symbolName: 'edge',
        outlinedPaths: [{ d: 'M 0 0 L 24 24', windingRule: 'NONZERO' }],
        template,
      }),
    ).toEqual([]);
  });

  test('returns no warning for artwork within the tolerance of the canvas edges', async () => {
    const template = await readSymbolTemplate();
    expect(
      getSymbolCanvasOverflowWarnings({
        symbolName: 'tolerated',
        outlinedPaths: [{ d: 'M 0 0 L 24.005 5', windingRule: 'NONZERO' }],
        template,
      }),
    ).toEqual([]);
  });

  test('warns that vertical overflow renders outside the symbol cell', async () => {
    const template = await readSymbolTemplate();
    expect(
      getSymbolCanvasOverflowWarnings({
        symbolName: 'tall',
        outlinedPaths: [{ d: 'M 5 0 L 10 24.437', windingRule: 'NONZERO' }],
        template,
      }),
    ).toEqual([
      'Symbol "tall" artwork overflows the 24×24 design canvas (bottom 0.437: renders outside the symbol cell); it is kept proportional.',
    ]);
  });

  test('warns that horizontal overflow within the cell margins renders inside', async () => {
    const template = await readSymbolTemplate();
    expect(
      getSymbolCanvasOverflowWarnings({
        symbolName: 'wide',
        outlinedPaths: [{ d: 'M 0 0 L 24.437 2', windingRule: 'NONZERO' }],
        template,
      }),
    ).toEqual([
      'Symbol "wide" artwork overflows the 24×24 design canvas (right 0.437: renders within the symbol cell margins); it is kept proportional.',
    ]);
  });

  test('warns that horizontal overflow beyond the cell margins renders outside', async () => {
    const template = await readSymbolTemplate();
    expect(
      getSymbolCanvasOverflowWarnings({
        symbolName: 'wider',
        outlinedPaths: [{ d: 'M -2 0 L 22 2', windingRule: 'NONZERO' }],
        template,
      }),
    ).toEqual([
      'Symbol "wider" artwork overflows the 24×24 design canvas (left 2: renders outside the symbol cell); it is kept proportional.',
    ]);
  });

  test('annotates every overflowing side with its own consequence', async () => {
    const template = await readSymbolTemplate();
    expect(
      getSymbolCanvasOverflowWarnings({
        symbolName: 'overflowing',
        outlinedPaths: [{ d: 'M -1 0 L 25 5', windingRule: 'NONZERO' }],
        template,
      }),
    ).toEqual([
      'Symbol "overflowing" artwork overflows the 24×24 design canvas (left 1: renders within the symbol cell margins, right 1: renders within the symbol cell margins); it is kept proportional.',
    ]);
  });

  test('computes the rendering slack from the narrowest variant', () => {
    const template: SymbolTemplate = parseSymbolTemplate(SYNTHETIC_TEMPLATE);
    expect(
      getSymbolCanvasOverflowWarnings({
        symbolName: 'narrowest',
        outlinedPaths: [{ d: 'M 0 0 L 26.5 5', windingRule: 'NONZERO' }],
        template,
      }),
    ).toEqual([
      'Symbol "narrowest" artwork overflows the 24×24 design canvas (right 2.5: renders outside the symbol cell); it is kept proportional.',
    ]);
  });

  test('merges the overflow of every path', async () => {
    const template = await readSymbolTemplate();
    expect(
      getSymbolCanvasOverflowWarnings({
        symbolName: 'multi',
        outlinedPaths: [
          { d: 'M 2 2 L 4 4', windingRule: 'NONZERO' },
          { d: 'M 0 0 L 24.437 2', windingRule: 'NONZERO' },
        ],
        template,
      }),
    ).toEqual([
      'Symbol "multi" artwork overflows the 24×24 design canvas (right 0.437: renders within the symbol cell margins); it is kept proportional.',
    ]);
  });
});
