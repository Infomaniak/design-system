import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('supportsSymbolsAsWeakKey', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return `true` and cache the result when the engine supports symbols as WeakMap keys', async () => {
    const { supportsSymbolsAsWeakKey } = await import('./supports-symbols-as-weak-key.ts');

    expect(supportsSymbolsAsWeakKey()).toBe(true);
    expect(supportsSymbolsAsWeakKey()).toBe(true);
  });

  it('should return `false` and cache the result when the engine rejects symbols as WeakMap keys (ex: Firefox ESR)', async () => {
    vi.stubGlobal('WeakMap', LegacyWeakMap);

    const { supportsSymbolsAsWeakKey } = await import('./supports-symbols-as-weak-key.ts');

    expect(supportsSymbolsAsWeakKey()).toBe(false);
    expect(supportsSymbolsAsWeakKey()).toBe(false);
  });
});

/* INTERNAL */

/**
 * Simulates an engine without the "Symbols as WeakMap keys" ES2023 feature (ex: Firefox ESR),
 * where `WeakMap.set` throws a `TypeError` for symbol keys.
 */
class LegacyWeakMap {
  readonly #map: Map<object, unknown> = new Map();

  set(key: unknown, value: unknown): this {
    if (typeof key !== 'object' || key === null) {
      throw new TypeError('WeakMap key must be an object');
    }

    this.#map.set(key, value);

    return this;
  }
}
