import { describe, expect, test } from 'vitest';
import { computePathDataBoundingBox } from '../icons/bake-transform-into-path.ts';
import type { SvgOutlinePath } from '../icons/outline-path.ts';
import { buildSymbolSvg, fitSymbolOutlinePathsToVariant } from './build-symbol-svg.ts';
import type { SymbolTemplate } from './parse-symbol-template.ts';
import { parseSymbolTemplate, readSymbolTemplate } from './parse-symbol-template.ts';

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
<line id="right-margin-Ultralight-S" style="fill:none" x1="11" y1="1"/>
<line id="left-margin-Regular-S" style="fill:none" x1="2" y1="1"/>
<line id="right-margin-Regular-S" style="fill:none" x1="12" y1="1"/>
<line id="left-margin-Black-S" style="fill:none" x1="3" y1="1"/>
<line id="right-margin-Black-S" style="fill:none" x1="13" y1="1"/>
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

    // the outline canvas is mapped onto the cell (height-anchored): gaps and artwork keep their
    // canvas share of the capline-to-baseline height (square 4..20: 4 units padding, 16 units art)
    const cellHeight: number = template.baselineY - template.caplineY;
    expect((fittedBoundingBoxes[0]!.minY + cellHeight) / cellHeight).toBeCloseTo(4 / 24, 3);
    expect((0 - fittedBoundingBoxes[0]!.maxY) / cellHeight).toBeCloseTo(4 / 24, 3);
    expect((fittedBoundingBoxes[0]!.maxX - fittedBoundingBoxes[0]!.minX) / cellHeight).toBeCloseTo(
      16 / 24,
      3,
    );
    expect((fittedBoundingBoxes[0]!.minX + fittedBoundingBoxes[0]!.maxX) / 2).toBeCloseTo(
      template.variants[0]!.cellWidth / 2,
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

  test('transforms each path independently, supporting relative path starts', async () => {
    const template = await readSymbolTemplate();
    const svg = buildSymbolSvg({
      symbolName: 'relative',
      outlinedPaths: [
        { d: 'M 2 0 L 4 0', windingRule: 'NONZERO' },
        { d: 'm 1 1 L 3 3 Z', windingRule: 'NONZERO' },
      ],
      template,
    });

    const groupBody: string =
      new RegExp(`<g id="Regular-S"[^>]*>([\\s\\S]*?)</g>`).exec(svg)?.[1] ?? '';
    const fittedPathDataList: readonly string[] = [...groupBody.matchAll(/d="([^"]+)"/g)].map(
      (match: RegExpMatchArray): string => match[1]!,
    );

    // 'm 1 1' resolves its relative start within its own path data; 'L 3 3' is absolute
    expect(fittedPathDataList[0]).toBe('M 9.9771 -70.459 L 15.8487 -70.459');
    expect(fittedPathDataList[1]).toBe('M 7.0413 -67.5232 L 12.9129 -61.6516 Z');
  });

  test('preserves the padding designed inside the outline canvas', async () => {
    const template = await readSymbolTemplate();
    const regularVariant = template.variants.find(({ id }): boolean => id === 'Regular-S')!;
    const fittedPaths = fitSymbolOutlinePathsToVariant({
      outlinedPaths: [{ d: 'M 2 2 L 22 2 L 22 22 L 2 22 Z', windingRule: 'NONZERO' }],
      variant: regularVariant,
      template,
    });
    const fittedBoundingBox = computePathDataBoundingBox(fittedPaths[0]!.d);

    // square 2..22: 2 units of canvas padding on each side, 20 units of artwork; the padding
    // keeps its canvas share of the capline-to-baseline height instead of being squeezed out
    const cellHeight: number = template.baselineY - template.caplineY;
    expect((fittedBoundingBox.minY + cellHeight) / cellHeight).toBeCloseTo(2 / 24, 3);
    expect((0 - fittedBoundingBox.maxY) / cellHeight).toBeCloseTo(2 / 24, 3);
    expect((fittedBoundingBox.maxX - fittedBoundingBox.minX) / cellHeight).toBeCloseTo(20 / 24, 3);
    expect((fittedBoundingBox.minX + fittedBoundingBox.maxX) / 2).toBeCloseTo(
      regularVariant.cellWidth / 2,
      3,
    );
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
  test('fits the outline canvas into the variant cell, preserving designed padding', async () => {
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
