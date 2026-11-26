import { describe, expect, it, vi } from 'vitest';
import { LINT_RULES } from './registry.ts';
import {
  DEFAULT_RULE_SELECTION,
  loadRuleSelection,
  parseRuleSelection,
  resetRuleSelection,
  resolveRules,
  saveRuleSelection,
  type KeyValueStore,
} from './selection.ts';

const ALL_IDS: readonly string[] = LINT_RULES.map((rule): string => rule.id);

function storeWithValue(value: unknown): KeyValueStore {
  return { get: vi.fn((): Promise<unknown> => Promise.resolve(value)), set: vi.fn() };
}

function failingStore(): KeyValueStore {
  return {
    get: vi.fn((): Promise<unknown> => Promise.reject(new Error('storage unavailable'))),
    set: vi.fn((): Promise<void> => Promise.reject(new Error('storage unavailable'))),
  };
}

describe('parseRuleSelection', () => {
  it('defaults to every rule when the payload is missing', () => {
    expect([...parseRuleSelection(undefined)]).toEqual(ALL_IDS);
  });

  it('defaults to every rule when the payload is not an array of strings', () => {
    expect([...parseRuleSelection('unbound-value')]).toEqual(ALL_IDS);
    expect([...parseRuleSelection(['unbound-value', 42])]).toEqual(ALL_IDS);
    expect([...parseRuleSelection(null)]).toEqual(ALL_IDS);
  });

  it('keeps only known rule ids', () => {
    expect([...parseRuleSelection(['unbound-value', 'unknown-rule', 'lorem-ipsum'])]).toEqual([
      'unbound-value',
      'lorem-ipsum',
    ]);
  });

  it('accepts the empty selection', () => {
    expect(parseRuleSelection([]).size).toBe(0);
  });
});

describe('resolveRules', () => {
  it('keeps only the enabled rules, in registry order', () => {
    const rules: readonly string[] = resolveRules(new Set(['lorem-ipsum', 'unbound-value'])).map(
      (rule): string => rule.id,
    );

    expect(rules).toEqual(['unbound-value', 'lorem-ipsum']);
  });

  it('resolves to no rule when the selection is empty', () => {
    expect(resolveRules(new Set())).toEqual([]);
  });

  it('resolves every rule for the default selection', () => {
    expect(resolveRules(new Set(DEFAULT_RULE_SELECTION))).toEqual(LINT_RULES);
  });
});

describe('loadRuleSelection', () => {
  it('returns the stored selection', async () => {
    const selection: ReadonlySet<string> = await loadRuleSelection(
      storeWithValue(['lorem-ipsum', 'unknown-rule']),
    );

    expect([...selection]).toEqual(['lorem-ipsum']);
  });

  it('falls back to every rule when nothing is stored', async () => {
    const selection: ReadonlySet<string> = await loadRuleSelection(storeWithValue(null));

    expect([...selection]).toEqual(ALL_IDS);
  });

  it('falls back to every rule when the store fails', async () => {
    const selection: ReadonlySet<string> = await loadRuleSelection(failingStore());

    expect([...selection]).toEqual(ALL_IDS);
  });
});

describe('saveRuleSelection', () => {
  it('persists the selection as an id array', async () => {
    const set = vi.fn((_key: string, _value: unknown): Promise<void> => Promise.resolve());

    const saved: boolean = await saveRuleSelection({ get: vi.fn(), set }, new Set(['blend-mode']));

    expect(saved).toBe(true);
    expect(set).toHaveBeenCalledWith('ruleSelection', ['blend-mode']);
  });

  it('reports a failed write', async () => {
    expect(await saveRuleSelection(failingStore(), new Set(['blend-mode']))).toBe(false);
  });
});

describe('resetRuleSelection', () => {
  it('persists and returns the default selection', async () => {
    const set = vi.fn((_key: string, _value: unknown): Promise<void> => Promise.resolve());

    const selection: ReadonlySet<string> = await resetRuleSelection({ get: vi.fn(), set });

    expect([...selection]).toEqual(ALL_IDS);
    expect(set).toHaveBeenCalledWith('ruleSelection', ALL_IDS);
  });
});
