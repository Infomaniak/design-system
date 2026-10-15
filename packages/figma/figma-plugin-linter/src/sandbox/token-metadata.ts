import { MAX_ALIAS_CHAIN_DEPTH } from '../core/effective-variable.ts';
import type { TokenTier } from '../core/model/token-tier.ts';
import type { VariableInfo } from '../core/model/variable-info.ts';
import { isFigmaVariableAlias } from './figma-types.ts';

/**
 * Token collection names, mirroring
 * `packages/tokens/scripts/scripts/build-tokens/src/constants/design-token-tiers.ts`
 * (`FIGMA_T1/T2/T3_COLLECTION_NAME`). Duplicated here to keep the plugin
 * dependency-free.
 */
const TIER_COLLECTION_NAMES: ReadonlyMap<string, TokenTier> = new Map([
  ['t1', 't1'],
  ['t2', 't2'],
  ['t3', 't3'],
]);

export function getTokenTier(collectionName: string): TokenTier {
  return TIER_COLLECTION_NAMES.get(collectionName) ?? 'unknown';
}

/**
 * The slice of the official variables API the loader reads. `Pick` keeps the
 * official method signatures (drift protection) while letting tests implement
 * only the async surface the loader actually uses.
 */
export type TokenVariablesApi = Pick<
  VariablesAPI,
  | 'getLocalVariablesAsync'
  | 'getLocalVariableCollectionsAsync'
  | 'getVariableByIdAsync'
  | 'getVariableCollectionByIdAsync'
  | 'importVariableByKeyAsync'
>;

export function buildVariableInfo(variable: Variable, collectionName: string): VariableInfo {
  const rawValue: unknown = firstModeValue(variable.valuesByMode);
  const aliasTargetId: string | undefined = isFigmaVariableAlias(rawValue)
    ? rawValue.id
    : undefined;

  return {
    id: variable.id,
    nameSegments: variable.name.split('/'),
    collectionName,
    tier: getTokenTier(collectionName),
    scopes: variable.scopes,
    remote: variable.remote ?? false,
    ...(aliasTargetId === undefined && rawValue !== undefined ? { value: rawValue } : {}),
    ...(aliasTargetId === undefined ? {} : { aliasTargetId }),
  };
}

/**
 * Reads the first mode's value from `valuesByMode` — an array in the plugin
 * API typings, but defensively also accepted as a mode-keyed object (the shape
 * some Figma surfaces return).
 */
function firstModeValue(
  valuesByMode: readonly unknown[] | Readonly<Record<string, unknown>> | undefined,
): unknown {
  if (valuesByMode === undefined) {
    return undefined;
  }

  if (Array.isArray(valuesByMode)) {
    return valuesByMode[0];
  }

  const values: readonly unknown[] = Object.values(valuesByMode);

  return values[0];
}

function collectionNamesById(collections: readonly VariableCollection[]): Map<string, string> {
  return new Map(
    collections.map((collection: VariableCollection): readonly [string, string] => [
      collection.id,
      collection.name,
    ]),
  );
}

/**
 * Maps variables to `VariableInfo` with tier and name segments.
 */
export function buildVariableInfoMap(
  variables: readonly Variable[],
  collections: readonly VariableCollection[],
): Map<string, VariableInfo> {
  const namesById: ReadonlyMap<string, string> = collectionNamesById(collections);
  const variablesById: Map<string, VariableInfo> = new Map();

  for (const variable of variables) {
    const collectionName: string = namesById.get(variable.variableCollectionId) ?? '';

    variablesById.set(variable.id, buildVariableInfo(variable, collectionName));
  }

  return variablesById;
}

/**
 * Resolves a collection name by id, deduplicating concurrent lookups through a
 * promise cache (several bound variables often share one collection).
 */
function getCollectionName(
  api: TokenVariablesApi,
  collectionId: string,
  cache: Map<string, Promise<string>>,
): Promise<string> {
  const cached: Promise<string> | undefined = cache.get(collectionId);

  if (cached !== undefined) {
    return cached;
  }

  const lookup: Promise<string> = (async (): Promise<string> => {
    const collection: VariableCollection | null =
      await api.getVariableCollectionByIdAsync(collectionId);

    return collection?.name ?? '';
  })();

  cache.set(collectionId, lookup);
  return lookup;
}

/**
 * Resolves a single bound variable id that is not among the file's local
 * variables — e.g. a token bound from a published library.
 */
async function resolveNonLocalVariableInfo(
  api: TokenVariablesApi,
  variableId: string,
  collectionNameCache: Map<string, Promise<string>>,
): Promise<VariableInfo | undefined> {
  const variable: Variable | null = await api.getVariableByIdAsync(variableId);

  if (variable === null) {
    return undefined;
  }

  const collectionName: string = await getCollectionName(
    api,
    variable.variableCollectionId,
    collectionNameCache,
  );

  return buildVariableInfo(variable, collectionName);
}

/**
 * Collects the alias targets of variables that are not in the map yet — the
 * ids the next alias-expansion round must fetch.
 *
 * Every aliased variable counts, not just unknown-tier ones: the fix-mode
 * suggestion engine resolves RAW VALUES through chains (e.g. the published
 * `color/background/brand/@root` aliases its base `…/infomaniak`), so those
 * targets must be fetchable too — not merely classification-relevant chains.
 */
function collectUnresolvedAliasTargets(
  variablesById: ReadonlyMap<string, VariableInfo>,
): readonly string[] {
  const targets: string[] = [];

  for (const info of variablesById.values()) {
    if (info.aliasTargetId !== undefined && !variablesById.has(info.aliasTargetId)) {
      targets.push(info.aliasTargetId);
    }
  }

  return targets;
}

/**
 * Builds the per-run variable metadata map (Figma variable lookups are async;
 * rule evaluation stays sync).
 *
 * Source 1: all variables local to the file (bulk, cheap). Source 2: bound
 * variable ids that are not local — typically tokens bound from a published
 * library — resolved one by one, so a lint run does not require the tokens to
 * be imported into the file. Ids that resolve to nothing stay out of the map;
 * the `unresolved-binding` rule reports them.
 *
 * Source 3: all variables available from the enabled team libraries (fix mode,
 * Stage 5) — without them the suggestion engine could never propose published
 * tokens in consumer files. Imports are cached by Figma per session; ids
 * already known (e.g. bound variables) are kept as-is.
 *
 * Alias chains are expanded on demand: an unknown-tier variable may itself
 * point at a variable outside this file (e.g. a kit token re-pointed to a
 * published DS token), and the chain must be fetchable before the rules can
 * classify the binding. Expansion stops when no new targets appear, at the
 * depth cap, and never refetches a failed id.
 */
export async function loadTokenMetadata(
  api: TokenVariablesApi,
  boundVariableIds: readonly string[] = [],
  getTeamLibrary?: () => TeamLibraryAPI | undefined,
  debug?: (label: string, detail: string) => void,
): Promise<Map<string, VariableInfo>> {
  const [collections, variables] = await Promise.all([
    api.getLocalVariableCollectionsAsync(),
    api.getLocalVariablesAsync(),
  ]);

  const variablesById: Map<string, VariableInfo> = buildVariableInfoMap(variables, collections);
  const collectionNameCache: Map<string, Promise<string>> = new Map(
    collections.map((collection: VariableCollection): readonly [string, Promise<string>] => [
      collection.id,
      Promise.resolve(collection.name),
    ]),
  );

  const fetchedIds: Set<string> = new Set();

  const expandAliasChains = async (): Promise<void> => {
    let pendingIds: readonly string[] = collectUnresolvedAliasTargets(variablesById).filter(
      (variableId: string): boolean =>
        !fetchedIds.has(variableId) && !variablesById.has(variableId),
    );

    for (
      let depth: number = 0;
      pendingIds.length > 0 && depth < MAX_ALIAS_CHAIN_DEPTH;
      depth += 1
    ) {
      for (const variableId of pendingIds) {
        fetchedIds.add(variableId);
      }

      await Promise.all(
        pendingIds.map(async (variableId: string): Promise<void> => {
          const variableInfo: VariableInfo | undefined = await resolveNonLocalVariableInfo(
            api,
            variableId,
            collectionNameCache,
          );

          if (variableInfo !== undefined) {
            variablesById.set(variableId, variableInfo);
          }
        }),
      );

      pendingIds = collectUnresolvedAliasTargets(variablesById).filter(
        (variableId: string): boolean => !fetchedIds.has(variableId),
      );
    }
  };

  const pendingBoundIds: readonly string[] = [
    ...new Set([...boundVariableIds, ...collectUnresolvedAliasTargets(variablesById)]),
  ].filter((variableId: string): boolean => !variablesById.has(variableId));

  for (const variableId of pendingBoundIds) {
    fetchedIds.add(variableId);
  }

  await Promise.all(
    pendingBoundIds.map(async (variableId: string): Promise<void> => {
      const variableInfo: VariableInfo | undefined = await resolveNonLocalVariableInfo(
        api,
        variableId,
        collectionNameCache,
      );

      if (variableInfo !== undefined) {
        variablesById.set(variableId, variableInfo);
      }
    }),
  );

  await expandAliasChains();
  await mergeLibraryVariables(api, variablesById, collectionNameCache, getTeamLibrary, debug);
  await expandAliasChains();

  return variablesById;
}

/**
 * Imports every variable available from the enabled team libraries and merges
 * them into the map (fix mode's suggestion pool). Imports are independent of
 * the bound ids above — a published token that is not bound anywhere in the
 * scanned nodes must still be suggestible. Figma caches imports per session;
 * ids already in the map win. A missing or failing library surface degrades to
 * the previous pool (local + bound) instead of failing the run — the surface
 * is resolved lazily (inside a guard) because merely READING `figma.teamLibrary`
 * throws when the manifest lacks the `teamlibrary` capability.
 */
async function mergeLibraryVariables(
  api: TokenVariablesApi,
  variablesById: Map<string, VariableInfo>,
  collectionNameCache: Map<string, Promise<string>>,
  getTeamLibrary?: () => TeamLibraryAPI | undefined,
  debug?: (label: string, detail: string) => void,
): Promise<void> {
  let teamLibrary: TeamLibraryAPI | undefined;

  try {
    teamLibrary = getTeamLibrary?.();
  } catch {
    debug?.('library variables', 'teamLibrary access denied (missing teamlibrary capability)');
    return;
  }

  if (teamLibrary === undefined) {
    return;
  }

  let keys: readonly string[];

  try {
    keys = await collectLibraryVariableKeys(teamLibrary);
  } catch {
    debug?.('library variables', 'enumeration failed — pool limited to local + bound tokens');
    return;
  }

  let imported: number = 0;
  let failed: number = 0;

  await Promise.all(
    keys.map(async (key: string): Promise<void> => {
      let variable: Variable | null;

      try {
        variable = await api.importVariableByKeyAsync(key);
      } catch {
        failed += 1;
        return;
      }

      if (variable === null || variablesById.has(variable.id)) {
        return;
      }

      const collectionName: string = await getCollectionName(
        api,
        variable.variableCollectionId,
        collectionNameCache,
      );

      variablesById.set(variable.id, buildVariableInfo(variable, collectionName));
      imported += 1;
    }),
  );

  debug?.(
    'library variables',
    `${keys.length} variables available, ${imported} imported, ${failed} failed`,
  );
}

/**
 * Enumerates every variable key available from the enabled libraries — the
 * real API is two-step (collections, then their variables).
 */
async function collectLibraryVariableKeys(teamLibrary: TeamLibraryAPI): Promise<readonly string[]> {
  const collections: readonly LibraryVariableCollection[] =
    await teamLibrary.getAvailableLibraryVariableCollectionsAsync();

  const keyLists: readonly (readonly string[])[] = await Promise.all(
    collections.map(async (collection: LibraryVariableCollection): Promise<readonly string[]> => {
      const variables: readonly LibraryVariable[] =
        await teamLibrary.getVariablesInLibraryCollectionAsync(collection.key);

      return variables.map((variable: LibraryVariable): string => variable.key);
    }),
  );

  return keyLists.flat();
}
