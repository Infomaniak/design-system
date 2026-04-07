/**
 * @vitest-environment node
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockCategorizedIconsResponse,
  mockCollectionsList,
  mockEmptyCollectionsList,
  mockEmptyIconsResponse,
  mockIconsWithAliases,
  mockIconsWithHidden,
  mockIconsWithMultipleCategories,
  mockMixedIconsResponse,
  mockNotFoundError,
  mockRateLimitError,
  mockServerError,
  mockUncategorizedIconsResponse,
} from './__fixtures__/iconify-responses.ts';
import { IconifyApi } from './iconify-api.ts';

// Mock fetch globally
const mockFetch = vi.hoisted(() => vi.fn());
vi.stubGlobal('fetch', mockFetch);

describe('IconifyApi', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('constructor', () => {
    it('should create instance with default timeout', () => {
      const api = new IconifyApi();
      expect(api).toBeDefined();
    });

    it('should create instance with custom timeout', () => {
      const customTimeout = 10000;
      const api = new IconifyApi(customTimeout);
      expect(api).toBeDefined();
    });

    it('should create instance with very short timeout', () => {
      const shortTimeout = 100;
      const api = new IconifyApi(shortTimeout);
      expect(api).toBeDefined();
    });
  });

  describe('listIconSets', () => {
    it('should fetch collections successfully', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockCollectionsList), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      const result = await api.listIconSets();

      expect(result).toEqual(mockCollectionsList);
      expect(mockFetch).toHaveBeenCalledOnce();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/collections'),
        }),
        expect.any(Object),
      );
    });

    it('should handle empty collections list', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEmptyCollectionsList), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      const result = await api.listIconSets();

      expect(result).toEqual({});
    });

    it('should include prefixes parameter when provided', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEmptyCollectionsList), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      await api.listIconSets({ prefixes: ['material', 'fa'] });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toContain('prefixes=material%2Cfa');
    });

    it('should include pretty parameter when true', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEmptyCollectionsList), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      await api.listIconSets({ pretty: true });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toContain('pretty=1');
    });

    it('should include both prefixes and pretty parameters', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEmptyCollectionsList), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      await api.listIconSets({ prefixes: ['material'], pretty: true });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toContain('prefixes=material');
      expect(callArgs[0].toString()).toContain('pretty=1');
    });

    it('should handle 404 Not Found error', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockNotFoundError.body), {
          status: mockNotFoundError.status,
          statusText: mockNotFoundError.statusText,
        }),
      );

      const api = new IconifyApi();

      await expect(api.listIconSets()).rejects.toThrow(
        `HTTP error! status: ${mockNotFoundError.status}`,
      );
    });

    it('should handle 500 Server Error', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockServerError.body), {
          status: mockServerError.status,
          statusText: mockServerError.statusText,
        }),
      );

      const api = new IconifyApi();

      await expect(api.listIconSets()).rejects.toThrow(
        `HTTP error! status: ${mockServerError.status}`,
      );
    });

    it('should handle 429 Rate Limit Error', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockRateLimitError.body), {
          status: mockRateLimitError.status,
          statusText: mockRateLimitError.statusText,
        }),
      );

      const api = new IconifyApi();

      await expect(api.listIconSets()).rejects.toThrow(
        `HTTP error! status: ${mockRateLimitError.status}`,
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const api = new IconifyApi();

      await expect(api.listIconSets()).rejects.toThrow('Failed to fetch');
    });

    it('should propagate custom error messages', async () => {
      const customError = new Error('Custom network failure');
      mockFetch.mockRejectedValueOnce(customError);

      const api = new IconifyApi();

      await expect(api.listIconSets()).rejects.toThrow('Custom network failure');
    });

    it('should handle AbortSignal', async () => {
      const controller = new AbortController();
      controller.abort();

      const api = new IconifyApi();

      await expect(api.listIconSets({ signal: controller.signal })).rejects.toThrow();
    });
  });

  describe('listIconsOptimized', () => {
    it('should fetch and process categorized icons', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockCategorizedIconsResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      const result = await api.listIconsOptimized({ prefix: 'material' });

      expect(result).toHaveLength(4);
      expect(result.map((icon) => icon.name)).toContain('home');
      expect(result.map((icon) => icon.name)).toContain('settings');
      expect(result.map((icon) => icon.name)).toContain('menu');
      expect(result.map((icon) => icon.name)).toContain('user');

      const homeIcon = result.find((icon) => icon.name === 'home');
      expect(homeIcon?.categories.has('interface')).toBe(true);

      const settingsIcon = result.find((icon) => icon.name === 'settings');
      expect(settingsIcon?.categories.has('user')).toBe(true);
    });

    it('should process uncategorized icons', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockUncategorizedIconsResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      const result = await api.listIconsOptimized({ prefix: 'fa' });

      expect(result).toHaveLength(3);
      expect(result.map((icon) => icon.name)).toEqual(['star', 'heart', 'bookmark']);

      // All should have empty categories
      result.forEach((icon) => {
        expect(icon.categories.size).toBe(0);
      });
    });

    it('should process mixed categorized and uncategorized icons', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockMixedIconsResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      const result = await api.listIconsOptimized({ prefix: 'carbon' });

      expect(result).toHaveLength(6);

      // Check uncategorized icons
      const homeIcon = result.find((icon) => icon.name === 'home');
      const menuIcon = result.find((icon) => icon.name === 'menu');
      expect(homeIcon).toBeDefined();
      expect(menuIcon).toBeDefined();
      expect(homeIcon?.categories.size).toBe(0);
      expect(menuIcon?.categories.size).toBe(0);

      // Check categorized icons
      const deleteIcon = result.find((icon) => icon.name === 'delete');
      expect(deleteIcon?.categories.has('actions')).toBe(true);
    });

    it('should handle empty collections', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockEmptyIconsResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      const result = await api.listIconsOptimized({ prefix: 'empty' });

      expect(result).toEqual([]);
    });

    it('should merge multiple categories for the same icon', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockIconsWithMultipleCategories), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      const result = await api.listIconsOptimized({ prefix: 'test' });

      const icon2 = result.find((icon) => icon.name === 'icon2');
      expect(icon2).toBeDefined();
      expect(icon2?.categories.has('category1')).toBe(true);
      expect(icon2?.categories.has('category2')).toBe(true);
      expect(icon2?.categories.size).toBe(2);

      const icon1 = result.find((icon) => icon.name === 'icon1');
      expect(icon1?.categories.has('category1')).toBe(true);
      expect(icon1?.categories.has('category3')).toBe(true);
      expect(icon1?.categories.size).toBe(2);
    });

    it('should include hidden icons in result', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockIconsWithHidden), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      const result = await api.listIconsOptimized({ prefix: 'material' });

      // Should only include visible icons from categories
      expect(result).toHaveLength(2);
      expect(result.map((icon) => icon.name)).toContain('home');
      expect(result.map((icon) => icon.name)).toContain('settings');
      // Hidden icons are not included in the output
      expect(result.map((icon) => icon.name)).not.toContain('old-icon');
      expect(result.map((icon) => icon.name)).not.toContain('deprecated');
    });

    it('should not include aliases in result', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockIconsWithAliases), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();
      const result = await api.listIconsOptimized({ prefix: 'material' });

      // Should only include actual icons, not aliases
      expect(result).toHaveLength(3);
      expect(result.map((icon) => icon.name)).toContain('home');
      expect(result.map((icon) => icon.name)).toContain('settings');
      expect(result.map((icon) => icon.name)).toContain('menu');
      expect(result.map((icon) => icon.name)).not.toContain('house'); // alias for home
      expect(result.map((icon) => icon.name)).not.toContain('config'); // alias for settings
    });
  });

  describe('caching', () => {
    it('should cache results for the same prefix', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockCategorizedIconsResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();

      // First call
      const result1 = await api.listIconsOptimized({ prefix: 'material' });
      // Second call - should use cache
      const result2 = await api.listIconsOptimized({ prefix: 'material' });

      expect(mockFetch).toHaveBeenCalledOnce();
      expect(result1).toBe(result2);
    });

    it('should make separate requests for different prefixes', async () => {
      mockFetch
        .mockResolvedValueOnce(
          new Response(JSON.stringify(mockCategorizedIconsResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(mockUncategorizedIconsResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );

      const api = new IconifyApi();

      await api.listIconsOptimized({ prefix: 'material' });
      await api.listIconsOptimized({ prefix: 'fa' });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should clear cache entry on error and allow retry', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce(
        new Response(JSON.stringify(mockCategorizedIconsResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();

      // First call fails
      await expect(api.listIconsOptimized({ prefix: 'material' })).rejects.toThrow('Network error');

      // Second call should fetch again
      const result = await api.listIconsOptimized({ prefix: 'material' });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(4);
    });

    it('should handle concurrent requests to same prefix', async () => {
      let resolveResponse: (value: Response) => void;
      const responsePromise = new Promise<Response>((resolve) => {
        resolveResponse = resolve;
      });

      mockFetch.mockReturnValueOnce(responsePromise);

      const api = new IconifyApi();

      // Fire two concurrent requests
      const promise1 = api.listIconsOptimized({ prefix: 'material' });
      const promise2 = api.listIconsOptimized({ prefix: 'material' });

      // Resolve the fetch
      resolveResponse!(
        new Response(JSON.stringify(mockCategorizedIconsResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(mockFetch).toHaveBeenCalledOnce();
      expect(result1).toBe(result2);
    });
  });

  describe('error handling', () => {
    it('should handle 404 for listIconsOptimized', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockNotFoundError.body), {
          status: mockNotFoundError.status,
          statusText: mockNotFoundError.statusText,
        }),
      );

      const api = new IconifyApi();

      await expect(api.listIconsOptimized({ prefix: 'invalid' })).rejects.toThrow(
        `HTTP error! status: ${mockNotFoundError.status}`,
      );
    });

    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response('invalid json {', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();

      await expect(api.listIconsOptimized({ prefix: 'material' })).rejects.toThrow();
    });

    it('should handle non-Error exceptions', async () => {
      mockFetch.mockRejectedValueOnce('string error');

      const api = new IconifyApi();

      await expect(api.listIconsOptimized({ prefix: 'material' })).rejects.toThrow(
        'Request failed',
      );
    });

    it('should handle null response body', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(null, {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const api = new IconifyApi();

      await expect(api.listIconsOptimized({ prefix: 'material' })).rejects.toThrow();
    });
  });

  describe('abort signal handling', () => {
    it('should accept external abort signal', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockCategorizedIconsResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const controller = new AbortController();
      const api = new IconifyApi();

      const result = await api.listIconsOptimized({
        prefix: 'material',
        signal: controller.signal,
      });

      expect(result).toBeDefined();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('should handle pre-aborted signal', async () => {
      const controller = new AbortController();
      controller.abort();

      const api = new IconifyApi();

      await expect(
        api.listIconsOptimized({
          prefix: 'material',
          signal: controller.signal,
        }),
      ).rejects.toThrow();
    });
  });
});
