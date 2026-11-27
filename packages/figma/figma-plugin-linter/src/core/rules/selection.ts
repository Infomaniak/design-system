import { LINT_RULES } from './registry.ts';
import type { LintRule } from './rule.ts';

/** Minimal async key-value store abstraction (implemented over `figma.clientStorage`). */
export interface KeyValueStore {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

/**
 * Versioned payload persisted under `ruleSelection.v2`: the enabled ids plus
 * the registry snapshot at save time. The snapshot is what makes new rules
 * default to enabled on load — a rule the user never saw (added after their
 * last save) is not part of their explicit selection, so it must not inherit
 * the "stored ids only" filtering.
 */
interface StoredRuleSelection {
  readonly enabledRuleIds: readonly string[];
  readonly knownRuleIds: readonly string[];
}

const STORAGE_KEY: string = 'ruleSelection.v2';

/**
 * Pre-versioning payloads (bare id arrays). They carry no save-time snapshot,
 * so stored ids are filtered against the current registry without any
 * union — rules added after such a save stay disabled until the user saves
 * again or resets.
 */
const LEGACY_STORAGE_KEY: string = 'ruleSelection';

/** Every registered rule id, in registry order — the default selection. */
export const DEFAULT_RULE_SELECTION: readonly string[] = LINT_RULES.map(
  (rule: LintRule): string => rule.id,
);

const KNOWN_RULE_IDS: ReadonlySet<string> = new Set(DEFAULT_RULE_SELECTION);

function isStoredRuleSelection(value: unknown): value is StoredRuleSelection {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as StoredRuleSelection).enabledRuleIds) &&
    Array.isArray((value as StoredRuleSelection).knownRuleIds)
  );
}

function toStringIds(ids: readonly unknown[]): ReadonlySet<string> {
  return new Set(ids.filter((id: unknown): id is string => typeof id === 'string'));
}

/**
 * Normalizes a rule selection coming from the panel: unknown ids are dropped
 * (forward-compatible when rules are added or removed) and a missing or
 * invalid payload falls back to the default (every rule enabled). An explicit
 * empty array is valid — the all-disabled selection.
 */
export function parseRuleSelection(value: unknown): ReadonlySet<string> {
  if (
    !Array.isArray(value) ||
    !value.every((entry: unknown): boolean => typeof entry === 'string')
  ) {
    return new Set(KNOWN_RULE_IDS);
  }

  return new Set(
    (value as readonly string[]).filter((id: string): boolean => KNOWN_RULE_IDS.has(id)),
  );
}

/**
 * Merges a stored versioned selection into the effective enabled set: rules
 * the stored snapshot knew keep their stored state (mutes survive), rules
 * added since the save default to enabled.
 */
function mergeStoredSelection(payload: StoredRuleSelection): ReadonlySet<string> {
  const storedEnabled: ReadonlySet<string> = toStringIds(payload.enabledRuleIds);
  const knownAtSave: ReadonlySet<string> = toStringIds(payload.knownRuleIds);

  const enabled: Set<string> = new Set();

  for (const id of DEFAULT_RULE_SELECTION) {
    if (!knownAtSave.has(id) || storedEnabled.has(id)) {
      enabled.add(id);
    }
  }

  return enabled;
}

/**
 * Resolves an enabled-id set into the rules to run, preserving registry order.
 */
export function resolveRules(enabledRuleIds: ReadonlySet<string>): readonly LintRule[] {
  return LINT_RULES.filter((rule: LintRule): boolean => enabledRuleIds.has(rule.id));
}

/**
 * Load the rule selection persisted for this user, falling back to every rule
 * enabled when nothing is stored or the value is invalid. Versioned payloads
 * enable rules added since their save; legacy bare arrays are taken as-is
 * (filtered against the current registry).
 */
export async function loadRuleSelection(store: KeyValueStore): Promise<ReadonlySet<string>> {
  try {
    const stored: unknown = await store.get(STORAGE_KEY);

    if (isStoredRuleSelection(stored)) {
      return mergeStoredSelection(stored);
    }

    const legacy: unknown = await store.get(LEGACY_STORAGE_KEY);

    return parseRuleSelection(legacy);
  } catch {
    return new Set(KNOWN_RULE_IDS);
  }
}

/** Persist the rule selection (with the current registry snapshot). Returns `false` on write failure. */
export async function saveRuleSelection(
  store: KeyValueStore,
  enabledRuleIds: ReadonlySet<string>,
): Promise<boolean> {
  try {
    await store.set(STORAGE_KEY, {
      enabledRuleIds: [...enabledRuleIds],
      knownRuleIds: DEFAULT_RULE_SELECTION,
    });

    return true;
  } catch {
    return false;
  }
}

/** Reset the rule selection to every rule enabled and persist it. */
export async function resetRuleSelection(store: KeyValueStore): Promise<ReadonlySet<string>> {
  const selection: ReadonlySet<string> = new Set(KNOWN_RULE_IDS);

  await saveRuleSelection(store, selection);

  return selection;
}
