import 'fake-indexeddb/auto';
import { openDB } from 'idb';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SvgCache } from './svg-cache.ts';

const DB_NAME = 'esds-icon-cache' as const;
const STORE_NAME = 'svg-cache' as const;

/** Opens a raw connection to inspect the mock/test database. */
async function inspectDb(): Promise<{
  count(): Promise<number>;
  getAllKeys(): Promise<string[]>;
}> {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    },
  });

  return {
    async count(): Promise<number> {
      return db.count(STORE_NAME);
    },
    async getAllKeys(): Promise<string[]> {
      return db.getAllKeys(STORE_NAME) as Promise<string[]>;
    },
  };
}

describe('SvgCache', () => {
  let cache: SvgCache;

  beforeEach(() => {
    cache = new SvgCache();
  });

  afterEach(async () => {
    await cache.clear();
  });

  describe('get', () => {
    it('should return undefined for missing keys', async () => {
      const result = await cache.get('missing:key');
      expect(result).toBeUndefined();
    });

    it('should return cached SVG when key exists', async () => {
      await cache.set('test:key', '<svg>icon</svg>');

      const result = await cache.get('test:key');

      expect(result).toBe('<svg>icon</svg>');
    });
  });

  describe('set', () => {
    it('should store a new entry', async () => {
      const t0 = Date.now();

      await cache.set('new:key', '<svg>new</svg>');

      const result = await cache.get('new:key');

      expect(result).toBe('<svg>new</svg>');
    });

    it('should overwrite existing entries', async () => {
      await cache.set('existing:key', '<svg>old</svg>');
      await cache.set('existing:key', '<svg>new</svg>');

      const result = await cache.get('existing:key');

      expect(result).toBe('<svg>new</svg>');
    });
  });

  describe('delete', () => {
    it('should remove a single entry', async () => {
      await cache.set('one:key', '<svg/>');

      await cache.delete('one:key');
      const result = await cache.get('one:key');

      expect(result).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should remove all entries', async () => {
      await cache.set('a:key', '<svg/>');
      await cache.set('b:key', '<svg/>');

      await cache.clear();
      const resultA = await cache.get('a:key');
      const resultB = await cache.get('b:key');

      expect(resultA).toBeUndefined();
      expect(resultB).toBeUndefined();
    });
  });

  describe('eviction', () => {
    it('should evict oldest entries when exceeding max limit', async () => {
      const MAX = 5000;

      for (let i = 0; i < MAX + 1; i++) {
        await cache.set(`icon-${i}`, `<svg>${i}</svg>`);
      }

      const db = await inspectDb();
      const count = await db.count();

      expect(count).toBe(MAX + 1 - 500); // 5001 -> evict 500 -> 4501
    });

    it('should evict oldest entries first (FIFO)', async () => {
      const MAX = 5000;

      // Add the "old" entry FIRST so it becomes truly oldest under FIFO
      await cache.set('old:key', '<svg>old</svg>');
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Fill up to near the limit
      for (let i = 0; i < 4900; i++) {
        await cache.set(`fill-${i}`, `<svg>${i}</svg>`);
      }

      // Overflow to trigger eviction
      for (let i = 0; i < 500; i++) {
        await cache.set(`overflow-${i}`, `<svg>${i}</svg>`);
      }

      const result = await cache.get('old:key');

      // The oldest entry should have been evicted first under FIFO
      expect(result).toBeUndefined();
    });
  });

  describe('graceful degradation', () => {
    it('should silently return undefined when IndexedDB is unavailable', async () => {
      const original = (globalThis as Record<string, unknown>).indexedDB;
      (globalThis as Record<string, unknown>).indexedDB = undefined;

      try {
        const fallbackCache = new SvgCache();
        await fallbackCache.set('key', '<svg/>');
        const result = await fallbackCache.get('key');
        await fallbackCache.delete('key');
        await fallbackCache.clear();

        expect(result).toBeUndefined();
      } finally {
        (globalThis as Record<string, unknown>).indexedDB = original;
      }
    });
  });
});
