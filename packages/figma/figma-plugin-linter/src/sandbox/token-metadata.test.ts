import { describe, expect, it, vi } from 'vitest';
import type { VariableInfo } from '../core/model/variable-info.ts';
import type { TokenVariablesApi } from './token-metadata.ts';
import {
  buildVariableInfo,
  buildVariableInfoMap,
  getTokenTier,
  loadTokenMetadata,
} from './token-metadata.ts';

/**
 * Data-only variable mock: the official `Variable` interface carries ~20
 * required members (plus methods) that the loader never reads — the cast keeps
 * fixtures minimal while the boundary stays officially typed. The first
 * mode's value arrives as `firstModeValue` (object-form `valuesByMode`).
 */
function variableFixture(
  id: string,
  name: string,
  collectionId: string,
  scopes: readonly string[] = [],
  firstModeValue?: unknown,
): Variable {
  return {
    id,
    name,
    resolvedType: 'COLOR',
    scopes,
    variableCollectionId: collectionId,
    remote: false,
    ...(firstModeValue === undefined ? {} : { valuesByMode: { 'mode-1': firstModeValue } }),
  } as unknown as Variable;
}

function collectionFixture(id: string, name: string): VariableCollection {
  return { id, name } as unknown as VariableCollection;
}

interface ApiSpies {
  readonly getVariableByIdAsyncCalls: string[];
  readonly getVariableCollectionByIdAsyncCalls: string[];
}

function apiFixture(
  options: {
    readonly localVariables?: readonly Variable[];
    readonly localCollections?: readonly VariableCollection[];
    readonly variablesById?: ReadonlyMap<string, Variable | null>;
    readonly collectionsById?: ReadonlyMap<string, VariableCollection | null>;
    readonly libraryKeys?: readonly string[];
    readonly importedVariablesByKey?: ReadonlyMap<string, Variable | null>;
  } = {},
): TokenVariablesApi & ApiSpies {
  const getVariableByIdAsyncCalls: string[] = [];
  const getVariableCollectionByIdAsyncCalls: string[] = [];

  return {
    getVariableByIdAsyncCalls,
    getVariableCollectionByIdAsyncCalls,
    getLocalVariablesAsync: async (): Promise<Variable[]> => [...(options.localVariables ?? [])],
    getLocalVariableCollectionsAsync: async (): Promise<VariableCollection[]> => [
      ...(options.localCollections ?? []),
    ],
    getVariableByIdAsync: async (variableId: string): Promise<Variable | null> => {
      getVariableByIdAsyncCalls.push(variableId);
      return options.variablesById?.get(variableId) ?? null;
    },
    getVariableCollectionByIdAsync: async (
      collectionId: string,
    ): Promise<VariableCollection | null> => {
      getVariableCollectionByIdAsyncCalls.push(collectionId);
      return options.collectionsById?.get(collectionId) ?? null;
    },
    // Officially this never returns null; the defensive branch in the loader
    // is kept covered through the cast.
    importVariableByKeyAsync: async (key: string): Promise<Variable> => {
      const variable: Variable | null | undefined = options.importedVariablesByKey?.get(key);

      return variable ?? (null as unknown as Variable);
    },
  };
}

function teamLibraryFixture(
  libraryVariables: readonly LibraryVariable[] | undefined,
  libraryName: string = 'DS tokens',
): () => TeamLibraryAPI | undefined {
  return (): TeamLibraryAPI | undefined => ({
    getAvailableLibraryVariableCollectionsAsync: async (): Promise<LibraryVariableCollection[]> => [
      { name: 't2', key: 'lib-collection', libraryName },
    ],
    getVariablesInLibraryCollectionAsync: async (): Promise<LibraryVariable[]> => [
      ...(libraryVariables ?? []),
    ],
  });
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
        remote: false,
      },
    );
  });

  it('captures the alias target when the value is a variable alias', () => {
    const variable: Variable = variableFixture('V:1', 'foreground', 'C:9', [], {
      type: 'VARIABLE_ALIAS',
      id: 'V:t2',
    });

    expect(buildVariableInfo(variable, 'mode').aliasTargetId).toBe('V:t2');
  });

  it('captures no alias target for raw values', () => {
    const variable: Variable = variableFixture('V:1', 'foreground', 'C:9', [], {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    });

    expect(buildVariableInfo(variable, 'mode').aliasTargetId).toBeUndefined();
  });

  it('defensively reads array-form valuesByMode (a shape some Figma surfaces return)', () => {
    const variable = {
      ...variableFixture('V:1', 'foreground', 'C:9'),
      valuesByMode: [{ type: 'VARIABLE_ALIAS', id: 'V:t2' }],
    } as unknown as Variable;

    expect(buildVariableInfo(variable, 'mode').aliasTargetId).toBe('V:t2');
  });
});

describe('buildVariableInfoMap', () => {
  it('maps variables to VariableInfo with tier and name segments', () => {
    const variables: readonly Variable[] = [
      variableFixture('V:1', 'color/content/primary', 'C:2', ['ALL_FILLS']),
    ];
    const collections: readonly VariableCollection[] = [collectionFixture('C:2', 't2')];

    const map: Map<string, VariableInfo> = buildVariableInfoMap(variables, collections);

    expect(map.get('V:1')).toEqual({
      id: 'V:1',
      nameSegments: ['color', 'content', 'primary'],
      collectionName: 't2',
      tier: 't2',
      scopes: ['ALL_FILLS'],
      remote: false,
    });
  });

  it('marks variables of unknown collections as unknown tier', () => {
    const variables: readonly Variable[] = [variableFixture('V:1', 'theme/light', 'C:9')];

    const map = buildVariableInfoMap(variables, [collectionFixture('C:9', 'theme')]);

    expect(map.get('V:1')!.tier).toBe('unknown');
  });

  it('handles variables whose collection is missing', () => {
    const variables: readonly Variable[] = [variableFixture('V:1', 'color/gray/0', 'C:gone')];

    const map = buildVariableInfoMap(variables, []);

    expect(map.get('V:1')!.tier).toBe('unknown');
    expect(map.get('V:1')!.collectionName).toBe('');
  });
});

describe('loadTokenMetadata', () => {
  it('preloads variables and collections from the file', async () => {
    const api = apiFixture({
      localCollections: [collectionFixture('C:1', 't1'), collectionFixture('C:2', 't2')],
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
      localCollections: [collectionFixture('C:2', 't2')],
      localVariables: [variableFixture('V:2', 'color/content/primary', 'C:2')],
      variablesById: new Map([
        ['V:lib', { ...variableFixture('V:lib', 'color/gray/0', 'C:lib'), remote: true }],
      ]),
      collectionsById: new Map([['C:lib', collectionFixture('C:lib', 't1')]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:lib']);

    expect(metadata.get('V:lib')).toEqual({
      id: 'V:lib',
      nameSegments: ['color', 'gray', '0'],
      collectionName: 't1',
      tier: 't1',
      scopes: [],
      remote: true,
    });
    expect(api.getVariableCollectionByIdAsyncCalls).toEqual(['C:lib']);
  });

  it('skips ids that are already local', async () => {
    const api = apiFixture({
      localVariables: [variableFixture('V:1', 'color/content/primary', 'C:1')],
      localCollections: [collectionFixture('C:1', 't2')],
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:1']);

    expect(metadata.size).toBe(1);
    expect(api.getVariableByIdAsyncCalls).toEqual([]);
  });

  it('deduplicates requested ids', async () => {
    const api = apiFixture({
      variablesById: new Map([['V:lib', variableFixture('V:lib', 'color/gray/0', 'C:lib')]]),
      collectionsById: new Map([['C:lib', collectionFixture('C:lib', 't1')]]),
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
      localCollections: [collectionFixture('C:1', 't2')],
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
      collectionsById: new Map([['C:lib', collectionFixture('C:lib', 't1')]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:1', 'V:2']);

    expect(metadata.get('V:1')!.tier).toBe('t1');
    expect(metadata.get('V:2')!.tier).toBe('t1');
    expect(api.getVariableCollectionByIdAsyncCalls).toEqual(['C:lib']);
  });
});

describe('loadTokenMetadata — alias chain expansion', () => {
  it('fetches the published target of an unknown-tier alias (kit token re-pointed to DS)', async () => {
    const kitVariable: Variable = variableFixture('V:kit', 'foreground', 'C:kit', [], {
      type: 'VARIABLE_ALIAS',
      id: 'V:lib',
    });
    const api = apiFixture({
      localCollections: [collectionFixture('C:kit', 'mode')],
      localVariables: [kitVariable],
      variablesById: new Map([
        ['V:lib', variableFixture('V:lib', 'color/content/primary', 'C:lib')],
      ]),
      collectionsById: new Map([['C:lib', collectionFixture('C:lib', 't2')]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:kit']);

    expect(metadata.get('V:kit')!.tier).toBe('unknown');
    expect(metadata.get('V:lib')!.tier).toBe('t2');
    expect(api.getVariableByIdAsyncCalls).toEqual(['V:lib']);
  });

  it('fetches alias targets of known-tier variables too (fix-mode value resolution)', async () => {
    const semanticVariable: Variable = variableFixture('V:2', 'color/content/primary', 'C:2', [], {
      type: 'VARIABLE_ALIAS',
      id: 'V:lib',
    });
    const api = apiFixture({
      localCollections: [collectionFixture('C:2', 't2')],
      localVariables: [semanticVariable],
      variablesById: new Map([['V:lib', variableFixture('V:lib', 'color/gray/0', 'C:lib')]]),
      collectionsById: new Map([['C:lib', collectionFixture('C:lib', 't1')]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:2']);

    expect(metadata.get('V:2')!.tier).toBe('t2');
    expect(metadata.get('V:lib')!.tier).toBe('t1');
    expect(api.getVariableByIdAsyncCalls).toEqual(['V:lib']);
  });

  it('does not refetch alias targets that failed to resolve', async () => {
    const kitVariable: Variable = variableFixture('V:kit', 'foreground', 'C:kit', [], {
      type: 'VARIABLE_ALIAS',
      id: 'V:gone',
    });
    const api = apiFixture({
      localCollections: [collectionFixture('C:kit', 'mode')],
      localVariables: [kitVariable],
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:kit']);

    expect(metadata.size).toBe(1);
    expect(api.getVariableByIdAsyncCalls).toEqual(['V:gone']);
  });

  it('terminates on alias cycles between local variables', async () => {
    const first: Variable = variableFixture('V:a', 'one', 'C:kit', [], {
      type: 'VARIABLE_ALIAS',
      id: 'V:b',
    });
    const second: Variable = variableFixture('V:b', 'two', 'C:kit', [], {
      type: 'VARIABLE_ALIAS',
      id: 'V:a',
    });
    const api = apiFixture({
      localCollections: [collectionFixture('C:kit', 'mode')],
      localVariables: [first, second],
      variablesById: new Map([['V:lib', variableFixture('V:lib', 'x', 'C:lib')]]),
      collectionsById: new Map([['C:lib', collectionFixture('C:lib', 't2')]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, []);

    expect(metadata.size).toBe(2);
    expect(metadata.get('V:a')!.aliasTargetId).toBe('V:b');
    expect(metadata.get('V:b')!.aliasTargetId).toBe('V:a');
  });

  it('expands multi-hop chains through unknown-tier targets', async () => {
    const kitVariable: Variable = variableFixture('V:kit', 'foreground', 'C:kit', [], {
      type: 'VARIABLE_ALIAS',
      id: 'V:lib',
    });
    const remoteVariable: Variable = variableFixture('V:lib', 'intermediate', 'C:lib', [], {
      type: 'VARIABLE_ALIAS',
      id: 'V:lib2',
    });
    const api = apiFixture({
      localCollections: [collectionFixture('C:kit', 'mode')],
      localVariables: [kitVariable],
      variablesById: new Map([
        ['V:lib', remoteVariable],
        ['V:lib2', variableFixture('V:lib2', 'color/gray/0', 'C:lib2')],
      ]),
      collectionsById: new Map([
        ['C:lib', collectionFixture('C:lib', 'mode')],
        ['C:lib2', collectionFixture('C:lib2', 't1')],
      ]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, ['V:kit']);

    expect(metadata.get('V:kit')!.tier).toBe('unknown');
    expect(metadata.get('V:lib')!.tier).toBe('unknown');
    expect(metadata.get('V:lib2')!.tier).toBe('t1');
    expect(api.getVariableByIdAsyncCalls).toEqual(['V:lib', 'V:lib2']);
  });
});

describe('loadTokenMetadata — published library variables (fix mode pool)', () => {
  it('imports library variables and classifies them by collection', async () => {
    const api = apiFixture({
      localCollections: [collectionFixture('C:local', 't1')],
      localVariables: [variableFixture('V:local', 'blue/500', 'C:local')],
      importedVariablesByKey: new Map([
        ['lib-key', variableFixture('V:pub', 'color/background/brand/@root', 'C:pub')],
      ]),
      collectionsById: new Map([['C:pub', collectionFixture('C:pub', 't2')]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(
      api,
      [],
      teamLibraryFixture([
        { name: 'color/background/brand/@root', key: 'lib-key', resolvedType: 'COLOR' as const },
      ]),
    );

    expect(metadata.get('V:pub')).toEqual({
      id: 'V:pub',
      nameSegments: ['color', 'background', 'brand', '@root'],
      collectionName: 't2',
      tier: 't2',
      scopes: [],
      remote: false,
    });
  });

  it('keeps already-known ids (bound variables) over library imports', async () => {
    const bound: Variable = {
      ...variableFixture('V:pub', 'color/background/brand/@root', 'C:pub'),
      remote: true,
    };
    const api = apiFixture({
      variablesById: new Map([['V:pub', bound]]),
      collectionsById: new Map([['C:pub', collectionFixture('C:pub', 't2')]]),
      importedVariablesByKey: new Map([['lib-key', bound]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(
      api,
      ['V:pub'],
      teamLibraryFixture([
        { name: 'color/background/brand/@root', key: 'lib-key', resolvedType: 'COLOR' as const },
      ]),
    );

    expect(metadata.get('V:pub')!.remote).toBe(true);
    expect(api.getVariableByIdAsyncCalls).toEqual(['V:pub']);
  });

  it('stamps variables imported from a known kit library', async () => {
    const api = apiFixture({
      importedVariablesByKey: new Map([
        ['kit-key', variableFixture('V:kit', 'Schemes/Surface Container', 'C:kit')],
      ]),
      collectionsById: new Map([['C:kit', collectionFixture('C:kit', 'Theme')]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(
      api,
      [],
      teamLibraryFixture(
        [{ name: 'Schemes/Surface Container', key: 'kit-key', resolvedType: 'COLOR' as const }],
        'Edelweiss - Material Kit',
      ),
    );

    expect(metadata.get('V:kit')!.knownKit).toBe(true);
  });

  it('backfills the kit stamp onto bound variables resolved before the merge', async () => {
    // The on-demand resolution of a bound id cannot know the source library —
    // the import pass (which can) must stamp the entry afterwards.
    const boundKitVariable: Variable = {
      ...variableFixture('V:kit', 'button-size/lg', 'C:kit'),
      remote: true,
    };
    const api = apiFixture({
      variablesById: new Map([['V:kit', boundKitVariable]]),
      collectionsById: new Map([['C:kit', collectionFixture('C:kit', 'button-size')]]),
      importedVariablesByKey: new Map([['kit-key', boundKitVariable]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(
      api,
      ['V:kit'],
      teamLibraryFixture(
        [{ name: 'button-size/lg', key: 'kit-key', resolvedType: 'FLOAT' as const }],
        'Edelweiss - Token Core',
      ),
    );

    expect(metadata.get('V:kit')!.knownKit).toBe(true);
  });

  it('lists every collection in parallel — the deferred listing starts before the immediate one settles', async () => {
    // Locks the enumeration parallelism: collection A's listing is held until
    // released, so a sequential implementation would never reach collection B
    // while A is pending.
    const listingCalls: string[] = [];
    let releaseListing: () => void = (): void => undefined;
    const held: Promise<void> = new Promise<void>((resolve) => {
      releaseListing = resolve;
    });

    const api = apiFixture({
      importedVariablesByKey: new Map([
        ['key-a', variableFixture('V:a', 'color/a', 'C:pub')],
        ['key-b', variableFixture('V:b', 'color/b', 'C:pub')],
      ]),
      collectionsById: new Map([['C:pub', collectionFixture('C:pub', 't2')]]),
    });

    const metadataPromise: Promise<Map<string, VariableInfo>> = loadTokenMetadata(
      api,
      [],
      (): TeamLibraryAPI | undefined => ({
        getAvailableLibraryVariableCollectionsAsync: async (): Promise<
          LibraryVariableCollection[]
        > => [
          { name: 'A', key: 'collection-a', libraryName: 'DS tokens' },
          { name: 'B', key: 'collection-b', libraryName: 'DS tokens' },
        ],
        getVariablesInLibraryCollectionAsync: async (
          collectionKey: string,
        ): Promise<LibraryVariable[]> => {
          listingCalls.push(collectionKey);

          if (collectionKey === 'collection-a') {
            await held;

            return [{ name: 'color/a', key: 'key-a', resolvedType: 'COLOR' as const }];
          }

          return [{ name: 'color/b', key: 'key-b', resolvedType: 'COLOR' as const }];
        },
      }),
    );

    await vi.waitFor(() => expect(listingCalls).toContain('collection-b'), { timeout: 1_000 });

    releaseListing();

    const metadata: Map<string, VariableInfo> = await metadataPromise;

    expect(metadata.get('V:a')).toBeDefined();
    expect(metadata.get('V:b')).toBeDefined();
  });

  it('keeps importing the other collections when one listing fails', async () => {
    const api = apiFixture({
      importedVariablesByKey: new Map([['key-ok', variableFixture('V:ok', 'color/ok', 'C:pub')]]),
      collectionsById: new Map([['C:pub', collectionFixture('C:pub', 't2')]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(
      api,
      [],
      (): TeamLibraryAPI | undefined => ({
        getAvailableLibraryVariableCollectionsAsync: async (): Promise<
          LibraryVariableCollection[]
        > => [
          { name: 'Broken', key: 'collection-broken', libraryName: 'DS tokens' },
          { name: 'Working', key: 'collection-working', libraryName: 'DS tokens' },
        ],
        getVariablesInLibraryCollectionAsync: async (
          collectionKey: string,
        ): Promise<LibraryVariable[]> => {
          if (collectionKey === 'collection-broken') {
            throw new Error('listing unavailable');
          }

          return [{ name: 'color/ok', key: 'key-ok', resolvedType: 'COLOR' as const }];
        },
      }),
    );

    expect(metadata.get('V:ok')).toBeDefined();
  });

  it('counts failed imports without dropping the successful ones', async () => {
    const base: TokenVariablesApi = apiFixture({
      importedVariablesByKey: new Map([['key-ok', variableFixture('V:ok', 'color/ok', 'C:pub')]]),
      collectionsById: new Map([['C:pub', collectionFixture('C:pub', 't2')]]),
    });
    const api: TokenVariablesApi = {
      ...base,
      importVariableByKeyAsync: async (key: string): Promise<Variable> => {
        if (key === 'key-throws') {
          throw new Error('import rejected');
        }

        return base.importVariableByKeyAsync(key);
      },
    };

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(
      api,
      [],
      teamLibraryFixture([
        { name: 'color/ok', key: 'key-ok', resolvedType: 'COLOR' as const },
        { name: 'broken', key: 'key-throws', resolvedType: 'COLOR' as const },
      ]),
    );

    expect(metadata.get('V:ok')).toBeDefined();
  });

  it('skips imports that fail or resolve to nothing', async () => {
    const api = apiFixture({
      importedVariablesByKey: new Map([['lib-key', null]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(
      api,
      [],
      teamLibraryFixture([
        { name: 'color/background/brand/@root', key: 'lib-key', resolvedType: 'COLOR' as const },
        { name: 'broken', key: 'broken-key', resolvedType: 'COLOR' as const },
      ]),
    );

    expect(metadata.size).toBe(0);
  });

  it('degrades to the local pool without a teamLibrary surface', async () => {
    const api = apiFixture({
      localCollections: [collectionFixture('C:local', 't1')],
      localVariables: [variableFixture('V:local', 'blue/500', 'C:local')],
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, []);

    expect(metadata.size).toBe(1);
  });

  it('expands alias chains of imported variables after the merge', async () => {
    // The imported @root aliases its base through a valuesByMode alias; the
    // base is not local but resolvable by id (auto-imported dependency).
    const importedRoot: Variable = variableFixture(
      'V:root',
      'color/background/brand/@root',
      'C:pub',
      [],
      {
        type: 'VARIABLE_ALIAS',
        id: 'V:base',
      },
    );
    const api = apiFixture({
      variablesById: new Map([
        ['V:base', variableFixture('V:base', 'color/background/brand/infomaniak', 'C:pub')],
      ]),
      collectionsById: new Map([['C:pub', collectionFixture('C:pub', 't2')]]),
      importedVariablesByKey: new Map([['lib-key', importedRoot]]),
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(
      api,
      [],
      teamLibraryFixture([
        { name: 'color/background/brand/@root', key: 'lib-key', resolvedType: 'COLOR' as const },
      ]),
    );

    expect(metadata.get('V:root')!.aliasTargetId).toBe('V:base');
    expect(metadata.get('V:base')!.tier).toBe('t2');
    expect(api.getVariableByIdAsyncCalls).toContain('V:base');
  });

  it('degrades to the local pool when the library enumeration rejects', async () => {
    const api = apiFixture();
    const failing: () => TeamLibraryAPI | undefined = (): TeamLibraryAPI => ({
      getAvailableLibraryVariableCollectionsAsync: async (): Promise<
        LibraryVariableCollection[]
      > => {
        throw new Error('library access denied');
      },
      getVariablesInLibraryCollectionAsync: async (): Promise<LibraryVariable[]> => {
        throw new Error('not reached');
      },
    });

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, [], failing);

    expect(metadata.size).toBe(0);
  });

  it('degrades to the local pool when reading figma.teamLibrary throws (no capability)', async () => {
    const api = apiFixture();
    const throwing: () => TeamLibraryAPI | undefined = (): TeamLibraryAPI => {
      throw new Error(
        'in get_teamLibrary: "teamlibrary" permission not specified in manifest.json.',
      );
    };

    const metadata: Map<string, VariableInfo> = await loadTokenMetadata(api, [], throwing);

    expect(metadata.size).toBe(0);
  });
});
