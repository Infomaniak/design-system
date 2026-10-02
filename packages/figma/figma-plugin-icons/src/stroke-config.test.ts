import { describe, expect, it } from 'vitest';

import type { KeyValueStore } from './stroke-config.ts';
import {
  loadStrokeConfig,
  parseStrokeConfig,
  resetStrokeConfig,
  saveStrokeConfig,
} from './stroke-config.ts';
import { DEFAULT_STROKE_WEIGHTS, type StrokeConfig } from './tokens.ts';

class MemoryStore implements KeyValueStore {
  private readonly data = new Map<string, unknown>();

  get(key: string): Promise<unknown> {
    return Promise.resolve(this.data.has(key) ? this.data.get(key) : undefined);
  }

  set(key: string, value: unknown): Promise<void> {
    this.data.set(key, value);
    return Promise.resolve();
  }

  peek(key: string): unknown {
    return this.data.get(key);
  }
}

class FailingStore implements KeyValueStore {
  get(): Promise<unknown> {
    return Promise.reject(new Error('get failed'));
  }

  set(): Promise<void> {
    return Promise.reject(new Error('set failed'));
  }
}

const VALID_CONFIG: StrokeConfig = { 16: 1, 20: 2, 24: 3, 32: 4, 40: 5 };

describe('parseStrokeConfig', () => {
  it('accepts a complete config', () => {
    expect(parseStrokeConfig(VALID_CONFIG)).toEqual(VALID_CONFIG);
  });

  it('accepts the config produced by JSON round-trips', () => {
    expect(parseStrokeConfig(JSON.parse(JSON.stringify(VALID_CONFIG)))).toEqual(VALID_CONFIG);
  });

  it('ignores extra keys', () => {
    expect(parseStrokeConfig({ ...VALID_CONFIG, extra: 42 })).toEqual(VALID_CONFIG);
  });

  it('rejects null and non-object values', () => {
    expect(parseStrokeConfig(null)).toBeNull();
    expect(parseStrokeConfig(42)).toBeNull();
    expect(parseStrokeConfig('config')).toBeNull();
    expect(parseStrokeConfig(undefined)).toBeNull();
  });

  it('rejects arrays', () => {
    expect(parseStrokeConfig([1, 2, 3, 4, 5])).toBeNull();
  });

  it('rejects incomplete configs', () => {
    expect(parseStrokeConfig({ 16: 1, 20: 2, 24: 3, 32: 4 })).toBeNull();
  });

  it('rejects non-numeric values', () => {
    expect(parseStrokeConfig({ ...VALID_CONFIG, 20: '2' })).toBeNull();
  });

  it('rejects NaN values', () => {
    expect(parseStrokeConfig({ ...VALID_CONFIG, 20: Number.NaN })).toBeNull();
  });

  it('rejects infinite values', () => {
    expect(parseStrokeConfig({ ...VALID_CONFIG, 20: Number.POSITIVE_INFINITY })).toBeNull();
  });
});

describe('loadStrokeConfig', () => {
  it('loads the persisted config', async () => {
    const store = new MemoryStore();
    await store.set('strokeConfig', VALID_CONFIG);
    expect(await loadStrokeConfig(store)).toEqual(VALID_CONFIG);
  });

  it('falls back to defaults when nothing is stored', async () => {
    expect(await loadStrokeConfig(new MemoryStore())).toEqual(DEFAULT_STROKE_WEIGHTS);
  });

  it('falls back to defaults when the stored value is invalid', async () => {
    const store = new MemoryStore();
    await store.set('strokeConfig', { 16: 'broken' });
    expect(await loadStrokeConfig(store)).toEqual(DEFAULT_STROKE_WEIGHTS);
  });

  it('falls back to defaults when the store fails', async () => {
    expect(await loadStrokeConfig(new FailingStore())).toEqual(DEFAULT_STROKE_WEIGHTS);
  });
});

describe('saveStrokeConfig', () => {
  it('persists a copy of the config', async () => {
    const store = new MemoryStore();
    expect(await saveStrokeConfig(store, VALID_CONFIG)).toBe(true);
    expect(store.peek('strokeConfig')).toEqual(VALID_CONFIG);
    expect(store.peek('strokeConfig')).not.toBe(VALID_CONFIG);
  });

  it('returns false when the store fails', async () => {
    expect(await saveStrokeConfig(new FailingStore(), VALID_CONFIG)).toBe(false);
  });
});

describe('resetStrokeConfig', () => {
  it('restores and persists the defaults', async () => {
    const store = new MemoryStore();
    await saveStrokeConfig(store, VALID_CONFIG);

    const reset = await resetStrokeConfig(store);
    expect(reset.config).toEqual(DEFAULT_STROKE_WEIGHTS);
    expect(reset.saved).toBe(true);
    expect(store.peek('strokeConfig')).toEqual(DEFAULT_STROKE_WEIGHTS);
  });

  it('reports the defaults even when persisting fails', async () => {
    const reset = await resetStrokeConfig(new FailingStore());
    expect(reset.config).toEqual(DEFAULT_STROKE_WEIGHTS);
    expect(reset.saved).toBe(false);
  });
});
