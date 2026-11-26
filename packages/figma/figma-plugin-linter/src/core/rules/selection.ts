import { LINT_RULES } from './registry.ts';
import type { LintRule } from './rule.ts';

/** Minimal async key-value store abstraction (implemented over `figma.clientStorage`). */
export interface KeyValueStore {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

const STORAGE_KEY: string = 'ruleSelection';

/** Every registered rule id, in registry order — the default selection. */
export const DEFAULT_RULE_SELECTION: readonly string[] = LINT_RULES.map(
  (rule: LintRule): string => rule.id,
);

const KNOWN_RULE_IDS: ReadonlySet<string> = new Set(DEFAULT_RULE_SELECTION);

/**
 * Normalizes a rule selection coming from the panel or from storage: unknown
 * ids are dropped (forward-compatible when rules are added or removed) and a
 * missing or invalid payload falls back to the default (every rule enabled).
 * An explicit empty array is valid — the all-disabled selection.
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
 * Resolves an enabled-id set into the rules to run, preserving registry order.
 */
export function resolveRules(enabledRuleIds: ReadonlySet<string>): readonly LintRule[] {
  return LINT_RULES.filter((rule: LintRule): boolean => enabledRuleIds.has(rule.id));
}

/**
 * Load the rule selection persisted for this user, falling back to every rule
 * enabled when nothing is stored or the value is invalid.
 */
export async function loadRuleSelection(store: KeyValueStore): Promise<ReadonlySet<string>> {
  try {
    return parseRuleSelection(await store.get(STORAGE_KEY));
  } catch {
    return new Set(KNOWN_RULE_IDS);
  }
}

/** Persist the rule selection. Returns `false` when the storage write failed. */
export async function saveRuleSelection(
  store: KeyValueStore,
  enabledRuleIds: ReadonlySet<string>,
): Promise<boolean> {
  try {
    await store.set(STORAGE_KEY, [...enabledRuleIds]);

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
