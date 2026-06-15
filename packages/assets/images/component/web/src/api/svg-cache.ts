import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

const DATABASE_NAME = 'esds-icon-cache' as const;
const STORE_NAME = 'svg-cache' as const;
const DATABASE_VERSION = 1 as const;
const MAX_ENTRIES = 5000 as const;
const EVICT_BATCH = 500 as const;

interface SvgCacheEntry {
  readonly key: string;
  readonly svg: string;
  readonly cachedAt: number;
}

interface SvgCacheSchema extends DBSchema {
  [STORE_NAME]: {
    readonly key: string;
    readonly value: SvgCacheEntry;
  };
}

export class SvgCache {
  readonly #dbPromise: Promise<IDBPDatabase<SvgCacheSchema>> | undefined;

  constructor() {
    if (typeof indexedDB !== 'undefined') {
      this.#dbPromise = openDB<SvgCacheSchema>(DATABASE_NAME, DATABASE_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'key' });
          }
        },
      });
    }
  }

  async get(key: string): Promise<string | undefined> {
    if (this.#dbPromise === undefined) {
      return undefined;
    }

    try {
      const db = await this.#dbPromise;
      const entry = await db.get(STORE_NAME, key);

      return entry?.svg;
    } catch {
      return undefined;
    }
  }

  async set(key: string, svg: string): Promise<void> {
    if (this.#dbPromise === undefined) {
      return;
    }

    const entry: SvgCacheEntry = {
      key,
      svg,
      cachedAt: Date.now(),
    };

    try {
      const db = await this.#dbPromise;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.store;

      await store.put(entry);

      const count = await store.count();
      if (count > MAX_ENTRIES) {
        const all = await store.getAll();
        all.sort((a: SvgCacheEntry, b: SvgCacheEntry): number => a.cachedAt - b.cachedAt);

        const toDelete = all.slice(0, EVICT_BATCH);
        for (const item of toDelete) {
          await store.delete(item.key);
        }
      }

      await tx.done;
    } catch {
      // Silently fail: degrade to memory-only for this session.
    }
  }

  async delete(key: string): Promise<void> {
    if (this.#dbPromise === undefined) {
      return;
    }

    try {
      const db = await this.#dbPromise;
      await db.delete(STORE_NAME, key);
    } catch {
      // Silently fail: degrade to memory-only for this session.
    }
  }

  async clear(): Promise<void> {
    if (this.#dbPromise === undefined) {
      return;
    }

    try {
      const db = await this.#dbPromise;
      await db.clear(STORE_NAME);
    } catch {
      // Silently fail.
    }
  }
}
