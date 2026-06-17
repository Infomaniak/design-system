import 'fake-indexeddb/auto';
import { openDB } from 'idb';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SvgCache, type SvgCacheEntry } from './svg-cache.ts';

const DB_NAME = 'esds-icon-cache' as const;
const STORE_NAME = 'svg-cache' as const;

/** Opens a raw connection to inspect the mock/test database. */
async function inspectDb(): Promise<{
  count(): Promise<number>;
  getAllKeys(): Promise<string[]>;
  getAll(): Promise<SvgCacheEntry[]>;
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
    async getAll(): Promise<SvgCacheEntry[]> {
      return db.getAll(STORE_NAME) as Promise<SvgCacheEntry[]>;
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

    it('should return svg and lastModified when key exists', async () => {
      await cache.set('test:key', '<svg>icon</svg>', 1700000000);

      const result = await cache.get('test:key');

      expect(result).toEqual({
        svg: '<svg>icon</svg>',
        lastModified: 1700000000,
      });
    });
  });

  describe('set', () => {
    it('should store a new entry', async () => {
      await cache.set('new:key', '<svg>new</svg>', 1000);

      const result = await cache.get('new:key');

      expect(result?.svg).toBe('<svg>new</svg>');
    });

    it('should store lastModified', async () => {
      await cache.set('test:key', '<svg>icon</svg>', 1700000000);

      const result = await cache.get('test:key');

      expect(result?.lastModified).toBe(1700000000);
    });

    it('should overwrite existing entries', async () => {
      await cache.set('existing:key', '<svg>old</svg>', 1000);
      await cache.set('existing:key', '<svg>new</svg>', 2000);

      const result = await cache.get('existing:key');

      expect(result?.svg).toBe('<svg>new</svg>');
    });

    it('should overwrite existing lastModified', async () => {
      await cache.set('existing:key', '<svg>old</svg>', 1000);
      await cache.set('existing:key', '<svg>new</svg>', 2000);

      const result = await cache.get('existing:key');

      expect(result?.lastModified).toBe(2000);
    });
  });

  describe('delete', () => {
    it('should remove a single entry', async () => {
      await cache.set('one:key', '<svg/>', 1000);

      await cache.delete('one:key');
      const result = await cache.get('one:key');

      expect(result).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should remove all entries', async () => {
      await cache.set('a:key', '<svg/>', 1000);
      await cache.set('b:key', '<svg/>', 1000);

      await cache.clear();
      const resultA = await cache.get('a:key');
      const resultB = await cache.get('b:key');

      expect(resultA).toBeUndefined();
      expect(resultB).toBeUndefined();
    });
  });

  describe('eviction', () => {
    it('should evict oldest entries when exceeding max limit', { timeout: 30000 }, async () => {
      const MAX = 5000;
      const EVICT = 500;

      for (let i = 0; i < MAX + 1; i++) {
        await cache.set(`icon-${i}`, `<svg>${i}</svg>`, i);
      }

      const db = await inspectDb();
      const count = await db.count();

      expect(count).toBe(MAX + 1 - EVICT); // 5001 -> evict 500 -> 4501
    });

    it('should evict entries with lowest lastModified first', { timeout: 30000 }, async () => {
      const MAX = 5000;
      const EVICT = 500;

      // Add the "old" entry FIRST with lowest lastModified
      await cache.set('old:key', '<svg>old</svg>', 1);

      // Fill up to near the limit
      for (let i = 0; i < MAX - EVICT; i++) {
        await cache.set(`fill-${i}`, `<svg>${i}</svg>`, 2000 + i);
      }

      // Overflow to trigger eviction
      for (let i = 0; i < EVICT; i++) {
        await cache.set(`overflow-${i}`, `<svg>${i}</svg>`, 10000 + i);
      }

      const result = await cache.get('old:key');

      // The entry with lowest lastModified should have been evicted first
      expect(result).toBeUndefined();
    });
  });

  describe('graceful degradation', () => {
    it('should silently return undefined when IndexedDB is unavailable', async () => {
      const original = (globalThis as Record<string, unknown>).indexedDB;
      (globalThis as Record<string, unknown>).indexedDB = undefined;

      try {
        const fallbackCache = new SvgCache();
        await fallbackCache.set('key', '<svg/>', 1000);
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
