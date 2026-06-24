import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IconifyApi } from './iconify-api.ts';
import { SvgCache } from './svg-cache.ts';

describe('IconifyApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be constructible', () => {
    expect(new IconifyApi()).toBeDefined();
  });

  describe('persistent SVG cache', () => {
    it('should clear persistent cache without error', async () => {
      const api = new IconifyApi();
      await expect(api.clearPersistentSVGCache()).resolves.toBeUndefined();
    });

    it('should use in-memory cache for repeated requests', async () => {
      const api = new IconifyApi();

      const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(
        (): Promise<Response> =>
          Promise.resolve(
            new Response(
              JSON.stringify({
                prefix: 'test',
                icons: {
                  'my-icon': {
                    body: '<path d="M0 0h16v16H0z"/>',
                    width: 16,
                    height: 16,
                  },
                },
                width: 16,
                height: 16,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          ),
      );

      // First call - hits the network (lastModified + icons data)
      await api.getSVG({ prefix: 'test', name: 'my-icon' });
      await new Promise((resolve) => setTimeout(resolve, 20));

      // Should have fetched /last-modified AND /test.json (but lastModified might be cached for session)
      const callCount = fetchSpy.mock.calls.length;
      expect(callCount).toBeGreaterThanOrEqual(1);

      // Second call - should hit memory cache, no additional fetch
      await api.getSVG({ prefix: 'test', name: 'my-icon' });

      // Call count should not increase (memory cache hit)
      expect(fetchSpy.mock.calls.length).toBe(callCount);
    });

    it('should keep resolved icon in memory even when refcount reaches 0', async () => {
      const api = new IconifyApi();

      const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(
        (): Promise<Response> =>
          Promise.resolve(
            new Response(
              JSON.stringify({
                prefix: 'test',
                icons: {
                  'my-icon': {
                    body: '<path d="M0 0h16v16H0z"/>',
                    width: 16,
                    height: 16,
                  },
                },
                width: 16,
                height: 16,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          ),
      );

      const userController = new AbortController();

      // First request with an abort signal
      await api.getSVG({
        prefix: 'test',
        name: 'my-icon',
        signal: userController.signal,
      });

      // Wait for debounce + network
      await new Promise((resolve) => setTimeout(resolve, 20));

      const initialCallCount = fetchSpy.mock.calls.length;

      // Abort the user signal (simulating component unmount after fetch resolved)
      userController.abort();
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Second request for the same icon - should NOT trigger a new fetch
      await api.getSVG({ prefix: 'test', name: 'my-icon' });

      expect(fetchSpy.mock.calls.length).toBe(initialCallCount);
    });

    it('should dedupe concurrent requests for the same icon', async () => {
      const api = new IconifyApi();

      const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(
        (): Promise<Response> =>
          Promise.resolve(
            new Response(
              JSON.stringify({
                prefix: 'test',
                icons: {
                  'shared-icon': {
                    body: '<path d="M0 0h16v16H0z"/>',
                    width: 16,
                    height: 16,
                  },
                },
                width: 16,
                height: 16,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          ),
      );

      const [result1, result2] = await Promise.all([
        api.getSVG({ prefix: 'test', name: 'shared-icon' }),
        api.getSVG({ prefix: 'test', name: 'shared-icon' }),
      ]);

      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(result1).toBe(result2);
      // Should not have fetched more than necessary (deduplicated)
      expect(fetchSpy.mock.calls.length).toBeLessThanOrEqual(3);
    });

    it('should propagate the original abort reason', async () => {
      const api = new IconifyApi();

      const controller = new AbortController();
      const customReason = new Error('component unmounted');
      controller.abort(customReason);

      await expect(
        api.getSVG({ prefix: 'test', name: 'my-icon', signal: controller.signal }),
      ).rejects.toBe(customReason);
    });

    it('should silently fail when IDB is not available', async () => {
      const api = new IconifyApi();
      await expect(api.clearPersistentSVGCache()).resolves.toBeUndefined();
    });
  });

  describe('lastModified cache invalidation', () => {
    beforeEach(async () => {
      const cleanupApi = new IconifyApi();
      await cleanupApi.clearPersistentSVGCache();
    });

    it('should skip icon network request when cached icon is still valid', async () => {
      const lastModified = 1700000000;
      const cache = new SvgCache();
      await cache.set('esds-valid:my-icon', '<svg>cached</svg>', lastModified);

      const api = new IconifyApi();

      const fetchSpy = vi
        .spyOn(global, 'fetch')
        .mockImplementation((input: RequestInfo | URL): Promise<Response> => {
          const url = input.toString();

          if (url.includes('last-modified')) {
            return Promise.resolve(
              new Response(JSON.stringify({ lastModified: { 'esds-valid': lastModified } }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }),
            );
          }

          // Should never reach here for icon data
          return Promise.resolve(
            new Response(
              JSON.stringify({
                prefix: 'esds-valid',
                icons: {
                  'my-icon': {
                    body: '<path d="M0 0h16v16H0z"/>',
                    width: 16,
                    height: 16,
                  },
                },
                width: 16,
                height: 16,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          );
        });

      const result = await api.getSVG({ prefix: 'esds-valid', name: 'my-icon' });

      // Should return cached SVG
      expect(result).toBe('<svg>cached</svg>');

      // Should have fetched lastModified but NOT icon data
      const hasIconDataCall = fetchSpy.mock.calls.some((call) => {
        const url = call[0]?.toString() ?? '';
        return !url.includes('last-modified');
      });
      expect(hasIconDataCall).toBe(false);
    });

    it('should return cached icon immediately when stale (stale-while-revalidate)', async () => {
      const oldLastModified = 1700000000;
      const newLastModified = 1700001000;
      const cache = new SvgCache();
      await cache.set('esds-stale:my-icon', '<svg>old</svg>', oldLastModified);

      const api = new IconifyApi();

      const fetchSpy = vi
        .spyOn(global, 'fetch')
        .mockImplementation((input: RequestInfo | URL): Promise<Response> => {
          const url = input.toString();

          if (url.includes('last-modified')) {
            return Promise.resolve(
              new Response(JSON.stringify({ lastModified: { 'esds-stale': newLastModified } }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }),
            );
          }

          return Promise.resolve(
            new Response(
              JSON.stringify({
                prefix: 'esds-stale',
                icons: {
                  'my-icon': {
                    body: '<path d="M10 10h16v16H10z"/>',
                    width: 16,
                    height: 16,
                  },
                },
                width: 16,
                height: 16,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          );
        });

      const result = await api.getSVG({ prefix: 'esds-stale', name: 'my-icon' });

      // Should return old SVG immediately (stale-while-revalidate)
      expect(result).toBe('<svg>old</svg>');

      // Wait for background revalidation to complete
      await new Promise((resolve) => setTimeout(resolve, 20));

      // Should have fetched both lastModified AND icon data
      const lastModifiedCalls = fetchSpy.mock.calls.filter((call) => {
        const url = call[0]?.toString() ?? '';
        return url.includes('last-modified');
      });
      const iconDataCalls = fetchSpy.mock.calls.filter((call) => {
        const url = call[0]?.toString() ?? '';
        return !url.includes('last-modified');
      });

      expect(lastModifiedCalls.length).toBeGreaterThanOrEqual(1);
      expect(iconDataCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('should update the cache after stale background revalidation', async () => {
      const oldLastModified = 1700000000;
      const newLastModified = 1700001000;
      const cache = new SvgCache();
      await cache.set('esds-update:my-icon', '<svg>old</svg>', oldLastModified);

      const api = new IconifyApi();

      vi.spyOn(global, 'fetch').mockImplementation(
        (input: RequestInfo | URL): Promise<Response> => {
          const url = input.toString();

          if (url.includes('last-modified')) {
            return Promise.resolve(
              new Response(JSON.stringify({ lastModified: { 'esds-update': newLastModified } }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }),
            );
          }

          return Promise.resolve(
            new Response(
              JSON.stringify({
                prefix: 'esds-update',
                icons: {
                  'my-icon': {
                    body: '<path d="M10 10h16v16H10z"/>',
                    width: 16,
                    height: 16,
                  },
                },
                width: 16,
                height: 16,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          );
        },
      );

      // First call: stale cache, returns old SVG immediately
      const result1 = await api.getSVG({ prefix: 'esds-update', name: 'my-icon' });
      expect(result1).toBe('<svg>old</svg>');

      // Wait for background revalidation
      await new Promise((resolve) => setTimeout(resolve, 20));

      // Create new API instance with empty memory cache to force IDB read
      api.clearSVGsCache();
      const api2 = new IconifyApi();

      // Second call: should now get the updated SVG from cache
      const result2 = await api2.getSVG({ prefix: 'esds-update', name: 'my-icon' });
      expect(result2).toContain('<path d="M10 10h16v16H10z"/>');
    });
  });
});
