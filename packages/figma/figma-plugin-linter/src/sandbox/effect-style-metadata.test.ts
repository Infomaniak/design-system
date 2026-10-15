import { describe, expect, it } from 'vitest';
import { loadEffectStyleMetadata } from './effect-style-metadata.ts';

/**
 * Data-only style mock: the loader reads id/name/remote/type, never the style
 * methods — the cast keeps fixtures small while the boundary stays officially
 * typed.
 */
function effectStyleFixture(options: {
  readonly id: string;
  readonly name: string;
  readonly remote?: boolean;
  readonly type?: string;
}): EffectStyle {
  return {
    id: options.id,
    name: options.name,
    type: options.type ?? 'EFFECT',
    remote: options.remote,
  } as unknown as EffectStyle;
}

interface ApiFixtureOptions {
  readonly localStyles?: readonly EffectStyle[];
  readonly stylesById?: ReadonlyMap<string, EffectStyle | null>;
}

function apiFixture(options: ApiFixtureOptions = {}): {
  readonly getLocalEffectStylesAsync: () => Promise<readonly EffectStyle[]>;
  readonly getStyleByIdAsync: (styleId: string) => Promise<BaseStyle | null>;
  readonly getStyleByIdAsyncCalls: readonly string[];
} {
  const calls: string[] = [];

  return {
    getLocalEffectStylesAsync: async (): Promise<readonly EffectStyle[]> =>
      options.localStyles ?? [],
    getStyleByIdAsync: async (styleId: string): Promise<BaseStyle | null> => {
      calls.push(styleId);
      return options.stylesById?.get(styleId) ?? null;
    },
    getStyleByIdAsyncCalls: calls,
  };
}

describe('loadEffectStyleMetadata', () => {
  it('maps local styles with remote false', async () => {
    const api = apiFixture({
      localStyles: [effectStyleFixture({ id: 'S:1', name: 'Shadows/soft' })],
    });

    const stylesById = await loadEffectStyleMetadata(api);

    expect(stylesById.get('S:1')).toEqual({ id: 'S:1', name: 'Shadows/soft', remote: false });
  });

  it('resolves referenced non-local styles on demand', async () => {
    const api = apiFixture({
      stylesById: new Map([
        ['S:lib', effectStyleFixture({ id: 'S:lib', name: 'DS shadows', remote: true })],
      ]),
    });

    const stylesById = await loadEffectStyleMetadata(api, ['S:lib']);

    expect(stylesById.get('S:lib')).toEqual({ id: 'S:lib', name: 'DS shadows', remote: true });
    expect(api.getStyleByIdAsyncCalls).toEqual(['S:lib']);
  });

  it('deduplicates referenced ids and keeps local ones out of the lookups', async () => {
    const api = apiFixture({
      localStyles: [effectStyleFixture({ id: 'S:1', name: 'Local shadow' })],
      stylesById: new Map([
        ['S:lib', effectStyleFixture({ id: 'S:lib', name: 'DS shadows', remote: true })],
      ]),
    });

    await loadEffectStyleMetadata(api, ['S:lib', 'S:lib', 'S:1']);

    expect(api.getStyleByIdAsyncCalls).toEqual(['S:lib']);
  });

  it('drops ids that resolve to nothing', async () => {
    const api = apiFixture({ stylesById: new Map([['S:gone', null]]) });

    const stylesById = await loadEffectStyleMetadata(api, ['S:gone']);

    expect(stylesById.has('S:gone')).toBe(false);
  });

  it('treats remote as true when the fetched style omits the flag', async () => {
    const api = apiFixture({
      stylesById: new Map([['S:x', effectStyleFixture({ id: 'S:x', name: 'Mystery' })]]),
    });

    const stylesById = await loadEffectStyleMetadata(api, ['S:x']);

    expect(stylesById.get('S:x')!.remote).toBe(true);
  });

  it('ignores ids that resolve to a non-effect style', async () => {
    const api = apiFixture({
      stylesById: new Map([
        ['S:text', effectStyleFixture({ id: 'S:text', name: 'Body', type: 'TEXT' })],
      ]),
    });

    const stylesById = await loadEffectStyleMetadata(api, ['S:text']);

    expect(stylesById.has('S:text')).toBe(false);
  });
});
