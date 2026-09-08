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
      symbolName: 'esds-square',
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
    expect(fittedBoundingBoxes[0]!.minY).toBeCloseTo(-70.459, 3);
    expect(fittedBoundingBoxes[0]!.maxY).toBeCloseTo(0, 3);
    expect(fittedBoundingBoxes[0]!.minX).toBeCloseTo(3.761, 3);

    expect(svg).toContain('Generated from esds-square');
    expect(svg).not.toContain('Generated from symbol');
  });

  test('adds a fill-rule attribute for EVENODD winding', async () => {
    const template = await readSymbolTemplate();
    const svg = buildSymbolSvg({
      symbolName: 'esds-evenodd',
      outlinedPaths: [{ d: SQUARE_OUTLINED_PATH[0]!.d, windingRule: 'EVENODD' }],
      template,
    });

    expect(svg).toContain('fill-rule="evenodd"');
  });

  test('does not add a fill-rule attribute for NONZERO winding', async () => {
    const template = await readSymbolTemplate();
    const svg = buildSymbolSvg({
      symbolName: 'esds-nonzero',
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
        symbolName: 'esds-square',
        outlinedPaths: SQUARE_OUTLINED_PATH,
        template: brokenTemplate,
      }),
    ).toThrow('Template group "Black-S" not found.');
  });

  test('throws when there are no outline paths', async () => {
    const template = await readSymbolTemplate();
    expect(() => buildSymbolSvg({ symbolName: 'esds-empty', outlinedPaths: [], template })).toThrow(
      'Symbol "esds-empty" has no outline paths.',
    );
  });
});

describe('fitSymbolOutlinePathsToVariant', () => {
  test('fits the icon into the variant cell', async () => {
    const template = await readSymbolTemplate();
    const regularVariant = template.variants.find(({ id }) => id === 'Regular-S')!;
    const fittedPaths = fitSymbolOutlinePathsToVariant({
      outlinedPaths: SQUARE_OUTLINED_PATH,
      boundingBox: { minX: 4, minY: 4, maxX: 20, maxY: 20 },
      variant: regularVariant,
      template,
    });

    expect(fittedPaths).toHaveLength(1);
    expect(fittedPaths[0]!.windingRule).toBe('NONZERO');
    expect(fittedPaths[0]!.d).toBe('M 4.1055 -70.459 L 74.5645 -70.459 L 74.5645 0 L 4.1055 0 Z');
  });
});
