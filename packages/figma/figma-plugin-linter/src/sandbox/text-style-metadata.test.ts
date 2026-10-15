import { describe, expect, it } from 'vitest';
import { loadTextStyleMetadata } from './text-style-metadata.ts';

/**
 * Data-only style mock: the loader reads id/name/remote/type plus the text
 * props, never the style methods — the cast keeps fixtures small while the
 * boundary stays officially typed. `type: 'TEXT'` drives the discriminating
 * narrow.
 */
function textStyleFixture(options: {
  readonly id: string;
  readonly name: string;
  readonly remote?: boolean;
  readonly type?: string;
  readonly fontSize?: number | symbol;
  readonly fontName?: { readonly family: string; readonly style: string } | symbol;
  readonly textDecoration?: string | symbol;
  readonly lineHeight?: { readonly value?: number; readonly unit: string } | symbol;
}): TextStyle {
  return {
    id: options.id,
    name: options.name,
    type: options.type ?? 'TEXT',
    remote: options.remote,
    fontSize: options.fontSize,
    fontName: options.fontName,
    textDecoration: options.textDecoration,
    lineHeight: options.lineHeight,
  } as unknown as TextStyle;
}

interface ApiFixtureOptions {
  readonly localStyles?: readonly TextStyle[];
  readonly stylesById?: ReadonlyMap<string, BaseStyle | null>;
}

function apiFixture(options: ApiFixtureOptions = {}): {
  readonly getLocalTextStylesAsync: () => Promise<readonly TextStyle[]>;
  readonly getStyleByIdAsync: (styleId: string) => Promise<BaseStyle | null>;
  readonly getStyleByIdAsyncCalls: readonly string[];
} {
  const calls: string[] = [];

  return {
    getLocalTextStylesAsync: async (): Promise<readonly TextStyle[]> => options.localStyles ?? [],
    getStyleByIdAsync: async (styleId: string): Promise<BaseStyle | null> => {
      calls.push(styleId);
      return options.stylesById?.get(styleId) ?? null;
    },
    getStyleByIdAsyncCalls: calls,
  };
}

describe('loadTextStyleMetadata', () => {
  it('maps local styles with remote false and normalized props', async () => {
    const api = apiFixture({
      localStyles: [
        textStyleFixture({
          id: 'S:1',
          name: 'Body/S',
          fontSize: 14,
          fontName: { family: 'Inter', style: 'Regular' },
          textDecoration: 'NONE',
          lineHeight: { value: 20, unit: 'PIXELS' },
        }),
      ],
    });

    const stylesById = await loadTextStyleMetadata(api);

    expect(stylesById.get('S:1')).toEqual({
      id: 'S:1',
      name: 'Body/S',
      remote: false,
      fontSize: 14,
      fontWeight: 'Regular',
      textDecoration: 'NONE',
      lineHeight: '20px',
    });
  });

  it('normalizes percent and auto line heights', async () => {
    const api = apiFixture({
      localStyles: [
        textStyleFixture({ id: 'S:1', name: 'A', lineHeight: { value: 150, unit: 'PERCENT' } }),
        textStyleFixture({ id: 'S:2', name: 'B', lineHeight: { value: 100, unit: 'AUTO' } }),
      ],
    });

    const stylesById = await loadTextStyleMetadata(api);

    expect(stylesById.get('S:1')!.lineHeight).toBe('150%');
    expect(stylesById.get('S:2')!.lineHeight).toBe('AUTO');
  });

  it('degrades a valueless non-auto line height to AUTO instead of guessing', async () => {
    const api = apiFixture({
      localStyles: [textStyleFixture({ id: 'S:1', name: 'A', lineHeight: { unit: 'PIXELS' } })],
    });

    const stylesById = await loadTextStyleMetadata(api);

    expect(stylesById.get('S:1')!.lineHeight).toBe('AUTO');
  });

  it('omits mixed props instead of guessing', async () => {
    const MIXED: symbol = Symbol('mixed');
    const api = apiFixture({
      localStyles: [textStyleFixture({ id: 'S:1', name: 'A', fontSize: MIXED, fontName: MIXED })],
    });

    const stylesById = await loadTextStyleMetadata(api);

    expect(stylesById.get('S:1')).toEqual({ id: 'S:1', name: 'A', remote: false });
  });

  it('resolves referenced non-local styles on demand', async () => {
    const api = apiFixture({
      stylesById: new Map([
        [
          'S:lib',
          textStyleFixture({
            id: 'S:lib',
            name: 'Title/L',
            remote: true,
            fontSize: 24,
            fontName: { family: 'Inter', style: 'Bold' },
          }),
        ],
      ]),
    });

    const stylesById = await loadTextStyleMetadata(api, ['S:lib']);

    expect(stylesById.get('S:lib')).toEqual({
      id: 'S:lib',
      name: 'Title/L',
      remote: true,
      fontSize: 24,
      fontWeight: 'Bold',
    });
    expect(api.getStyleByIdAsyncCalls).toEqual(['S:lib']);
  });

  it('deduplicates ids, skips local ones and drops non-text styles', async () => {
    const api = apiFixture({
      localStyles: [textStyleFixture({ id: 'S:1', name: 'Local' })],
      stylesById: new Map<string, BaseStyle | null>([
        ['S:lib', textStyleFixture({ id: 'S:lib', name: 'DS title', remote: true })],
        [
          'S:paint',
          textStyleFixture({ id: 'S:paint', name: 'A paint style', remote: true, type: 'PAINT' }),
        ],
        ['S:gone', null],
      ]),
    });

    const stylesById = await loadTextStyleMetadata(api, [
      'S:lib',
      'S:lib',
      'S:1',
      'S:paint',
      'S:gone',
    ]);

    expect(api.getStyleByIdAsyncCalls).toEqual(['S:lib', 'S:paint', 'S:gone']);
    expect(stylesById.has('S:1')).toBe(true);
    expect(stylesById.has('S:lib')).toBe(true);
    expect(stylesById.has('S:paint')).toBe(false);
    expect(stylesById.has('S:gone')).toBe(false);
  });
});
