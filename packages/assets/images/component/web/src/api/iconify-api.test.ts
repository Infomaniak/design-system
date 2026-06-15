import { afterEach, describe, expect, it, vi } from 'vitest';
import { IconifyApi } from './iconify-api.ts';

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

      // First call - hits the network
      await api.getSVG({ prefix: 'test', name: 'my-icon' });
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(fetchSpy).toHaveBeenCalledTimes(1);

      // Second call - should hit memory cache, no additional fetch
      await api.getSVG({ prefix: 'test', name: 'my-icon' });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
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

      // Wait for bulk debounce
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(fetchSpy).toHaveBeenCalledTimes(1);

      // Abort the user signal (simulating component unmount after fetch resolved)
      userController.abort();
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Second request for the same icon - should NOT trigger a new fetch
      await api.getSVG({ prefix: 'test', name: 'my-icon' });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
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
      expect(fetchSpy).toHaveBeenCalledTimes(1);
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
});
