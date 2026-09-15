import { describe, expect, it } from 'vitest';
import type { VariableInfo } from '../core/model/variable-info.ts';
import type { FigmaVariable, FigmaVariableCollection, FigmaVariablesApi } from './figma-types.ts';
import {
  buildVariableInfo,
  buildVariableInfoMap,
  getTokenTier,
  loadTokenMetadata,
} from './token-metadata.ts';

function variableFixture(
  id: string,
  name: string,
  collectionId: string,
  scopes: readonly string[] = [],
): FigmaVariable {
  return { id, name, resolvedType: 'COLOR', scopes, variableCollectionId: collectionId };
}

interface ApiSpies {
  readonly getVariableByIdAsyncCalls: string[];
  readonly getVariableCollectionByIdAsyncCalls: string[];
}

function apiFixture(
  options: {
    readonly localVariables?: readonly FigmaVariable[];
    readonly localCollections?: readonly FigmaVariableCollection[];
    readonly variablesById?: ReadonlyMap<string, FigmaVariable | null>;
    readonly collectionsById?: ReadonlyMap<string, FigmaVariableCollection | null>;
  } = {},
): FigmaVariablesApi & ApiSpies {
  const getVariableByIdAsyncCalls: string[] = [];
  const getVariableCollectionByIdAsyncCalls: string[] = [];

  return {
    getVariableByIdAsyncCalls,
    getVariableCollectionByIdAsyncCalls,
    getLocalVariablesAsync: async (): Promise<readonly FigmaVariable[]> =>
      options.localVariables ?? [],
    getLocalVariableCollectionsAsync: async (): Promise<readonly FigmaVariableCollection[]> =>
      options.localCollections ?? [],
    getVariableByIdAsync: async (variableId: string): Promise<FigmaVariable | null> => {
      getVariableByIdAsyncCalls.push(variableId);
      return options.variablesById?.get(variableId) ?? null;
    },
    getVariableCollectionByIdAsync: async (
      collectionId: string,
    ): Promise<FigmaVariableCollection | null> => {
      getVariableCollectionByIdAsyncCalls.push(collectionId);
      return options.collectionsById?.get(collectionId) ?? null;
    },
  };
}

describe('getTokenTier', () => {
  it('maps token collection names to tiers', () => {
    expect(getTokenTier('t1')).toBe('t1');
    expect(getTokenTier('t2')).toBe('t2');
    expect(getTokenTier('t3')).toBe('t3');
  });

  it('returns unknown for other collections (modifiers, etc.)', () => {
    expect(getTokenTier('theme')).toBe('unknown');
    expect(getTokenTier('product')).toBe('unknown');
  });
});

describe('buildVariableInfo', () => {
  it('builds VariableInfo with tier and name segments', () => {
    expect(buildVariableInfo(variableFixture('V:1', 'color/content/primary', 'C:2'), 't2')).toEqual(
      {
        id: 'V:1',
        nameSegments: ['color', 'content', 'primary'],
        collectionName: 't2',
        tier: 't2',
        scopes: [],
      },
    );
  });

  it('captures the alias target when the value is a variable alias', () => {
    const variable: FigmaVariable = {
      ...variableFixture('V:1', 'foreground', 'C:9'),
      value: { type: 'VARIABLE_ALIAS', id: 'V:t2' },
    };

    expect(buildVariableInfo(variable, 'mode').aliasTargetId).toBe('V:t2');
  });

  it('captures no alias target for raw values', () => {
    const variable: FigmaVariable = {
      ...variableFixture('V:1', 'foreground', 'C:9'),
      value: { r: 0, g: 0, b: 0, a: 1 },
    };

    expect(buildVariableInfo(variable, 'mode').aliasTargetId).toBeUndefined();
  });
});

describe('buildVariableInfoMap', () => {
  it('maps variables to VariableInfo with tier and name segments', () => {
    const variables: readonly FigmaVariable[] = [
      variableFixture('V:1', 'color/content/primary', 'C:2', ['ALL_FILLS']),
    ];
    const collections: readonly FigmaVariableCollection[] = [{ id: 'C:2', name: 't2' }];

    const map: Map<string, VariableInfo> = buildVariableInfoMap(variables, collections);

    expect(map.get('V:1')).toEqual({
      id: 'V:1',
      nameSegments: ['color', 'content', 'primary'],
      collectionName: 't2',
      tier: 't2',
      scopes: ['ALL_FILLS'],
    });
  });

  it('marks variables of unknown collections as unknown tier', () => {
    const variables: readonly FigmaVariable[] = [variableFixture('V:1', 'theme/light', 'C:9')];

    const map = buildVariableInfoMap(variables, [{ id: 'C:9', name: 'theme' }]);

    expect(map.get('V:1')!.tier).toBe('unknown');
  });

  it('handles variables whose collection is missing', () => {
    const variables: readonly FigmaVariable[] = [variableFixture('V:1', 'color/gray/0', 'C:gone')];

    const map = buildVariableInfoMap(variables, []);

    expect(map.get('V:1')!.tier).toBe('unknown');
    expect(map.get('V:1')!.collectionName).toBe('');
  });
});

describe('loadTokenMetadata', () => {
  it('preloads variables and collections from the file', async () => {
    const api = apiFixture({
      localCollections: [
        { id: 'C:1', name: 't1' },
        { id: 'C:2', name: 't2' },
      ],
      localVariables: [
        variableFixture('V:1', 'color/gray/0', 'C:1'),
        variableFixture('V:2', 'color/content/primary', 'C:2'),
      ],
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api);

    expect(metadata.size).toBe(2);
    expect(metadata.get('V:2')!.tier).toBe('t2');
    expect(metadata.get('V:1')!.tier).toBe('t1');
  });
});

describe('loadTokenMetadata — on-demand resolution', () => {
  it('resolves bound ids that are not local to the file (published library)', async () => {
    const api = apiFixture({
      localCollections: [{ id: 'C:2', name: 't2' }],
      localVariables: [variableFixture('V:2', 'color/content/primary', 'C:2')],
      variablesById: new Map([['V:lib', variableFixture('V:lib', 'color/gray/0', 'C:lib')]]),
      collectionsById: new Map([['C:lib', { id: 'C:lib', name: 't1' }]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:lib']);

    expect(metadata.get('V:lib')).toEqual({
      id: 'V:lib',
      nameSegments: ['color', 'gray', '0'],
      collectionName: 't1',
      tier: 't1',
      scopes: [],
    });
    expect(api.getVariableCollectionByIdAsyncCalls).toEqual(['C:lib']);
  });

  it('skips ids that are already local', async () => {
    const api = apiFixture({
      localVariables: [variableFixture('V:1', 'color/content/primary', 'C:1')],
      localCollections: [{ id: 'C:1', name: 't2' }],
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:1']);

    expect(metadata.size).toBe(1);
    expect(api.getVariableByIdAsyncCalls).toEqual([]);
  });

  it('deduplicates requested ids', async () => {
    const api = apiFixture({
      variablesById: new Map([['V:lib', variableFixture('V:lib', 'color/gray/0', 'C:lib')]]),
      collectionsById: new Map([['C:lib', { id: 'C:lib', name: 't1' }]]),
    });

    await loadTokenMetadata(api, ['V:lib', 'V:lib']);

    expect(api.getVariableByIdAsyncCalls).toEqual(['V:lib']);
  });

  it('leaves ids whose variable cannot be fetched out of the map', async () => {
    const api = apiFixture();

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:gone']);

    expect(metadata.size).toBe(0);
  });

  it('marks resolved variables whose collection cannot be fetched as unknown tier', async () => {
    const api = apiFixture({
      variablesById: new Map([['V:lib', variableFixture('V:lib', 'theme/light', 'C:gone')]]),
      collectionsById: new Map([['C:gone', null]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:lib']);

    expect(metadata.get('V:lib')!.tier).toBe('unknown');
    expect(metadata.get('V:lib')!.collectionName).toBe('');
  });

  it('reuses local collections for non-local variables without fetching them', async () => {
    const api = apiFixture({
      localCollections: [{ id: 'C:1', name: 't2' }],
      variablesById: new Map([['V:lib', variableFixture('V:lib', 'color/content/primary', 'C:1')]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:lib']);

    expect(metadata.get('V:lib')!.tier).toBe('t2');
    expect(api.getVariableCollectionByIdAsyncCalls).toEqual([]);
  });

  it('caches collection lookups across variables', async () => {
    const api = apiFixture({
      variablesById: new Map([
        ['V:1', variableFixture('V:1', 'color/gray/0', 'C:lib')],
        ['V:2', variableFixture('V:2', 'color/gray/100', 'C:lib')],
      ]),
      collectionsById: new Map([['C:lib', { id: 'C:lib', name: 't1' }]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:1', 'V:2']);

    expect(metadata.get('V:1')!.tier).toBe('t1');
    expect(metadata.get('V:2')!.tier).toBe('t1');
    expect(api.getVariableCollectionByIdAsyncCalls).toEqual(['C:lib']);
  });
});

describe('loadTokenMetadata — alias chain expansion', () => {
  it('fetches the published target of an unknown-tier alias (kit token re-pointed to DS)', async () => {
    const kitVariable: FigmaVariable = {
      ...variableFixture('V:kit', 'foreground', 'C:kit'),
      value: { type: 'VARIABLE_ALIAS', id: 'V:lib' },
    };
    const api = apiFixture({
      localCollections: [{ id: 'C:kit', name: 'mode' }],
      localVariables: [kitVariable],
      variablesById: new Map([
        ['V:lib', variableFixture('V:lib', 'color/content/primary', 'C:lib')],
      ]),
      collectionsById: new Map([['C:lib', { id: 'C:lib', name: 't2' }]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:kit']);

    expect(metadata.get('V:kit')!.tier).toBe('unknown');
    expect(metadata.get('V:lib')!.tier).toBe('t2');
    expect(api.getVariableByIdAsyncCalls).toEqual(['V:lib']);
  });

  it('does not fetch alias targets of known-tier variables', async () => {
    const semanticVariable: FigmaVariable = {
      ...variableFixture('V:2', 'color/content/primary', 'C:2'),
      value: { type: 'VARIABLE_ALIAS', id: 'V:lib' },
    };
    const api = apiFixture({
      localCollections: [{ id: 'C:2', name: 't2' }],
      localVariables: [semanticVariable],
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:2']);

    expect(metadata.get('V:2')!.tier).toBe('t2');
    expect(api.getVariableByIdAsyncCalls).toEqual([]);
  });

  it('does not refetch alias targets that failed to resolve', async () => {
    const kitVariable: FigmaVariable = {
      ...variableFixture('V:kit', 'foreground', 'C:kit'),
      value: { type: 'VARIABLE_ALIAS', id: 'V:gone' },
    };
    const api = apiFixture({
      localCollections: [{ id: 'C:kit', name: 'mode' }],
      localVariables: [kitVariable],
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:kit']);

    expect(metadata.size).toBe(1);
    expect(api.getVariableByIdAsyncCalls).toEqual(['V:gone']);
  });

  it('terminates on alias cycles between local variables', async () => {
    const first: FigmaVariable = {
      ...variableFixture('V:a', 'one', 'C:kit'),
      value: { type: 'VARIABLE_ALIAS', id: 'V:b' },
    };
    const second: FigmaVariable = {
      ...variableFixture('V:b', 'two', 'C:kit'),
      value: { type: 'VARIABLE_ALIAS', id: 'V:a' },
    };
    const api = apiFixture({
      localCollections: [{ id: 'C:kit', name: 'mode' }],
      localVariables: [first, second],
      variablesById: new Map([['V:lib', variableFixture('V:lib', 'x', 'C:lib')]]),
      collectionsById: new Map([['C:lib', { id: 'C:lib', name: 't2' }]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, []);

    expect(metadata.size).toBe(2);
    expect(metadata.get('V:a')!.aliasTargetId).toBe('V:b');
    expect(metadata.get('V:b')!.aliasTargetId).toBe('V:a');
  });

  it('expands multi-hop chains through unknown-tier targets', async () => {
    const kitVariable: FigmaVariable = {
      ...variableFixture('V:kit', 'foreground', 'C:kit'),
      value: { type: 'VARIABLE_ALIAS', id: 'V:lib' },
    };
    const remoteVariable: FigmaVariable = {
      ...variableFixture('V:lib', 'intermediate', 'C:lib'),
      value: { type: 'VARIABLE_ALIAS', id: 'V:lib2' },
    };
    const api = apiFixture({
      localCollections: [{ id: 'C:kit', name: 'mode' }],
      localVariables: [kitVariable],
      variablesById: new Map([
        ['V:lib', remoteVariable],
        ['V:lib2', variableFixture('V:lib2', 'color/gray/0', 'C:lib2')],
      ]),
      collectionsById: new Map([
        ['C:lib', { id: 'C:lib', name: 'mode' }],
        ['C:lib2', { id: 'C:lib2', name: 't1' }],
      ]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:kit']);

    expect(metadata.get('V:kit')!.tier).toBe('unknown');
    expect(metadata.get('V:lib')!.tier).toBe('unknown');
    expect(metadata.get('V:lib2')!.tier).toBe('t1');
    expect(api.getVariableByIdAsyncCalls).toEqual(['V:lib', 'V:lib2']);
  });
});
