import { MAX_ALIAS_CHAIN_DEPTH } from '../core/effective-variable.ts';
import type { TokenTier } from '../core/model/token-tier.ts';
import type { VariableInfo } from '../core/model/variable-info.ts';
import type { FigmaVariable, FigmaVariableCollection, FigmaVariablesApi } from './figma-types.ts';
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

export function buildVariableInfo(variable: FigmaVariable, collectionName: string): VariableInfo {
  const aliasTargetId: string | undefined = isFigmaVariableAlias(variable.value)
    ? variable.value.id
    : undefined;

  return {
    id: variable.id,
    nameSegments: variable.name.split('/'),
    collectionName,
    tier: getTokenTier(collectionName),
    scopes: variable.scopes,
    ...(aliasTargetId === undefined ? {} : { aliasTargetId }),
  };
}

function collectionNamesById(collections: readonly FigmaVariableCollection[]): Map<string, string> {
  return new Map(
    collections.map((collection: FigmaVariableCollection): readonly [string, string] => [
      collection.id,
      collection.name,
    ]),
  );
}

/**
 * Maps variables to `VariableInfo` with tier and name segments.
 */
export function buildVariableInfoMap(
  variables: readonly FigmaVariable[],
  collections: readonly FigmaVariableCollection[],
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
  api: FigmaVariablesApi,
  collectionId: string,
  cache: Map<string, Promise<string>>,
): Promise<string> {
  const cached: Promise<string> | undefined = cache.get(collectionId);

  if (cached !== undefined) {
    return cached;
  }

  const lookup: Promise<string> = (async (): Promise<string> => {
    const collection: FigmaVariableCollection | null =
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
  api: FigmaVariablesApi,
  variableId: string,
  collectionNameCache: Map<string, Promise<string>>,
): Promise<VariableInfo | undefined> {
  const variable: FigmaVariable | null = await api.getVariableByIdAsync(variableId);

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
 * Collects the alias targets of unknown-tier variables that are not in the map
 * yet — the ids the next alias-expansion round must fetch.
 */
function collectUnresolvedAliasTargets(
  variablesById: ReadonlyMap<string, VariableInfo>,
): readonly string[] {
  const targets: string[] = [];

  for (const info of variablesById.values()) {
    if (
      info.tier === 'unknown' &&
      info.aliasTargetId !== undefined &&
      !variablesById.has(info.aliasTargetId)
    ) {
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
 * Alias chains are expanded on demand: an unknown-tier variable may itself
 * point at a variable outside this file (e.g. a kit token re-pointed to a
 * published DS token), and the chain must be fetchable before the rules can
 * classify the binding. Expansion stops when no new targets appear, at the
 * depth cap, and never refetches a failed id.
 */
export async function loadTokenMetadata(
  api: FigmaVariablesApi,
  boundVariableIds: readonly string[] = [],
): Promise<Map<string, VariableInfo>> {
  const [collections, variables] = await Promise.all([
    api.getLocalVariableCollectionsAsync(),
    api.getLocalVariablesAsync(),
  ]);

  const variablesById: Map<string, VariableInfo> = buildVariableInfoMap(variables, collections);
  const collectionNameCache: Map<string, Promise<string>> = new Map(
    collections.map((collection: FigmaVariableCollection): readonly [string, Promise<string>] => [
      collection.id,
      Promise.resolve(collection.name),
    ]),
  );

  const fetchedIds: Set<string> = new Set();
  let pendingIds: readonly string[] = [
    ...new Set([...boundVariableIds, ...collectUnresolvedAliasTargets(variablesById)]),
  ].filter((variableId: string): boolean => !variablesById.has(variableId));

  for (let depth: number = 0; pendingIds.length > 0 && depth < MAX_ALIAS_CHAIN_DEPTH; depth += 1) {
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

  return variablesById;
}
