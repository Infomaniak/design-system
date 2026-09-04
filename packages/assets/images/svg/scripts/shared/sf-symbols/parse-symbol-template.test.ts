import { describe, expect, test } from 'vitest';
import {
  getSymbolTemplateVariant,
  parseSymbolTemplate,
  readSymbolTemplate,
} from './parse-symbol-template.ts';

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

describe('parseSymbolTemplate', () => {
  test('parses a synthetic template', () => {
    const template = parseSymbolTemplate(SYNTHETIC_TEMPLATE);
    expect(template.variants).toEqual([
      { id: 'Ultralight-S', translateX: 1, translateY: 0, cellWidth: 10 },
      { id: 'Regular-S', translateX: 2, translateY: 0, cellWidth: 10 },
      { id: 'Black-S', translateX: 3, translateY: 0, cellWidth: 10 },
    ]);
    expect(template.caplineY).toBe(10);
    expect(template.baselineY).toBe(80);
  });

  test('parses the real template geometry', async () => {
    const template = await readSymbolTemplate();
    expect(template.caplineY).toBe(625.541);
    expect(template.baselineY).toBe(696);
    expect(template.variants).toHaveLength(3);

    const [ultralight, regular, black] = template.variants;
    expect(ultralight!.id).toBe('Ultralight-S');
    expect(ultralight!.translateX).toBe(520.721);
    expect(ultralight!.translateY).toBe(696);
    expect(ultralight!.cellWidth).toBeCloseTo(77.981, 3);

    expect(regular!.id).toBe('Regular-S');
    expect(regular!.translateX).toBe(1410.51);
    expect(regular!.cellWidth).toBeCloseTo(78.67, 3);

    expect(black!.id).toBe('Black-S');
    expect(black!.translateX).toBe(2886.13);
    expect(black!.cellWidth).toBeCloseTo(94.54, 3);
  });

  test('throws when a variant group is missing', () => {
    expect(() =>
      parseSymbolTemplate(SYNTHETIC_TEMPLATE.replace(/<g id="Black-S".*?<\/g>/s, '')),
    ).toThrow('Template group "Black-S" not found.');
  });

  test('throws when the left margin line is missing', () => {
    expect(() =>
      parseSymbolTemplate(
        SYNTHETIC_TEMPLATE.replace(/<line id="left-margin-Regular-S"[^>]*\/>/, ''),
      ),
    ).toThrow('Template line "left-margin-Regular-S" not found.');
  });

  test('throws when the right margin line is missing', () => {
    expect(() =>
      parseSymbolTemplate(
        SYNTHETIC_TEMPLATE.replace(/<line id="right-margin-Regular-S"[^>]*\/>/, ''),
      ),
    ).toThrow('Template line "right-margin-Regular-S" not found.');
  });

  test('throws when the capline is missing', () => {
    expect(() =>
      parseSymbolTemplate(SYNTHETIC_TEMPLATE.replace(/<line id="Capline-S"[^>]*\/>/, '')),
    ).toThrow('Template line "Capline-S" not found.');
  });

  test('throws when the baseline is missing', () => {
    expect(() =>
      parseSymbolTemplate(SYNTHETIC_TEMPLATE.replace(/<line id="Baseline-S"[^>]*\/>/, '')),
    ).toThrow('Template line "Baseline-S" not found.');
  });
});

describe('getSymbolTemplateVariant', () => {
  test('returns the matching variant', () => {
    const template = parseSymbolTemplate(SYNTHETIC_TEMPLATE);
    expect(getSymbolTemplateVariant(template, 'Regular-S')).toEqual({
      id: 'Regular-S',
      translateX: 2,
      translateY: 0,
      cellWidth: 10,
    });
  });

  test('throws when the variant does not exist', () => {
    const template = parseSymbolTemplate(SYNTHETIC_TEMPLATE);
    expect(() => getSymbolTemplateVariant(template, 'Heavy-S')).toThrow(
      'Template variant "Heavy-S" not found.',
    );
  });
});
