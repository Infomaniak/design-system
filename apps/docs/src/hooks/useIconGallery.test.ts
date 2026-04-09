/**
 * @vitest-environment happy-dom
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIconGallery } from './useIconGallery.ts';

// Mock the IconifyApi class using hoisted mocks
const { mockListIconSets, mockListIcons } = vi.hoisted(() => ({
  mockListIconSets: vi.fn(),
  mockListIcons: vi.fn(),
}));

vi.mock('@infomaniak-design-system/esds-svg', () => {
  return {
    IconifyApi: class MockIconifyApi {
      listIconSets = mockListIconSets;
      listIcons = mockListIcons;
    },
  };
});

describe('useIconGallery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('initializes with loading state', () => {
      mockListIconSets.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useIconGallery());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.collections).toEqual([]);
      expect(result.current.icons).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.selectedCollection).toBe('');
      expect(result.current.totalCount).toBe(0);
      expect(result.current.filteredCount).toBe(0);
    });

    it('initializes with default values', () => {
      mockListIconSets.mockResolvedValue({});

      const { result } = renderHook(() => useIconGallery());

      expect(result.current.searchQuery).toBe('');
      expect(result.current.icons).toEqual([]);
    });
  });

  describe('fetch collections on mount', () => {
    it('fetches and sorts collections on mount', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
        bootstrap: { name: 'Bootstrap Icons' },
        ic: { name: 'IcoMoon' },
      });

      mockListIcons.mockResolvedValue([]);

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.collections).toEqual(['bootstrap', 'ic', 'material']);
      });

      expect(result.current.selectedCollection).toBe('bootstrap');
      expect(result.current.error).toBeNull();
    });

    it('selects first collection automatically', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
        bootstrap: { name: 'Bootstrap Icons' },
      });

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.selectedCollection).toBe('bootstrap');
      });
    });

    it('does not select collection if none available', async () => {
      mockListIconSets.mockResolvedValue({});

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.selectedCollection).toBe('');
    });

    it('passes abort signal to listIconSets', async () => {
      mockListIconSets.mockResolvedValue({});

      renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(mockListIconSets).toHaveBeenCalledWith(
          expect.objectContaining({
            signal: expect.any(AbortSignal),
          }),
        );
      });
    });
  });

  describe('fetch icons for selected collection', () => {
    beforeEach(() => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
      });
    });

    it('fetches icons when collection is selected', async () => {
      mockListIcons.mockResolvedValue([
        { name: 'home', categories: new Set() },
        { name: 'settings', categories: new Set() },
      ]);

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockListIcons).toHaveBeenCalledWith({
        prefix: 'material',
        signal: expect.any(AbortSignal),
      });

      expect(result.current.icons).toEqual([
        { name: 'home', categories: new Set() },
        { name: 'settings', categories: new Set() },
      ]);
      expect(result.current.totalCount).toBe(2);
      expect(result.current.filteredCount).toBe(2);
    });

    it('caches icons per collection', async () => {
      mockListIcons.mockResolvedValue([{ name: 'home', categories: new Set() }]);

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.icons).toHaveLength(1);
      });

      expect(mockListIcons).toHaveBeenCalledTimes(1);

      // Trigger a re-render by using act
      await act(async () => {});

      expect(result.current.icons).toHaveLength(1);
      expect(mockListIcons).toHaveBeenCalledTimes(1);
    });
  });

  describe('icon search', () => {
    beforeEach(() => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
      });

      mockListIcons.mockResolvedValue([
        { name: 'home', categories: new Set() },
        { name: 'home-work', categories: new Set() },
        { name: 'settings', categories: new Set() },
        { name: 'delete', categories: new Set() },
      ]);
    });

    it('filters icons by search query (case-insensitive)', async () => {
      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.icons).toHaveLength(4);
      });

      act(() => {
        result.current.setSearchQuery('HOME');
      });

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 350));

      await waitFor(() => {
        expect(result.current.searchQuery).toBe('HOME');
        expect(result.current.filteredCount).toBe(2);
      });

      expect(result.current.icons).toHaveLength(2);
    });

    it('debounces search input by 300ms', async () => {
      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.icons).toHaveLength(4);
      });

      act(() => {
        result.current.setSearchQuery('h');
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(result.current.icons).toHaveLength(4);

      act(() => {
        result.current.setSearchQuery('ho');
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(result.current.icons).toHaveLength(4);

      await new Promise((resolve) => setTimeout(resolve, 300));

      await waitFor(() => {
        expect(result.current.icons).toHaveLength(2);
      });
    });

    it('returns empty array when no icons match search', async () => {
      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.icons).toHaveLength(4);
      });

      act(() => {
        result.current.setSearchQuery('xyz123');
      });

      await new Promise((resolve) => setTimeout(resolve, 350));

      await waitFor(() => {
        expect(result.current.icons).toHaveLength(0);
        expect(result.current.filteredCount).toBe(0);
        expect(result.current.totalCount).toBe(4);
      });
    });

    it('clears search query and reset icons', async () => {
      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.icons).toHaveLength(4);
      });

      act(() => {
        result.current.setSearchQuery('delete');
      });

      await new Promise((resolve) => setTimeout(resolve, 350));

      await waitFor(() => {
        expect(result.current.icons).toHaveLength(1);
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchQuery).toBe('');
      expect(result.current.icons).toHaveLength(4);
    });

    it('clears search when collection changes', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
        bootstrap: { name: 'Bootstrap Icons' },
      });

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.collections).toEqual(['bootstrap', 'material']);
      });

      act(() => {
        result.current.setSearchQuery('home');
      });

      await new Promise((resolve) => setTimeout(resolve, 350));

      await waitFor(() => {
        expect(result.current.searchQuery).toBe('home');
      });

      act(() => {
        result.current.setCollection('material');
      });

      expect(result.current.searchQuery).toBe('');
    });
  });

  describe('error handling', () => {
    it('handles API errors when fetching collections', async () => {
      mockListIconSets.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      expect(result.current.error).toEqual({
        message: 'Network error',
        code: 'API_ERROR',
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.collections).toEqual([]);
    });

    it('handles abort errors gracefully', async () => {
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';
      mockListIconSets.mockRejectedValue(abortError);

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.collections).toEqual([]);
    });

    it('handles non-Error exceptions', async () => {
      mockListIconSets.mockRejectedValue('string error');

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      expect(result.current.error).toEqual({
        message: 'An unknown error occurred',
        code: 'UNKNOWN_ERROR',
      });
    });

    it('allows retry after error', async () => {
      mockListIconSets.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      mockListIconSets.mockResolvedValueOnce({
        material: { name: 'Material Icons' },
      });

      mockListIcons.mockResolvedValue([]);

      act(() => {
        result.current.retry();
      });

      await waitFor(() => {
        expect(result.current.collections).toEqual(['material']);
      });

      expect(result.current.error).toBeNull();
    });

    it('cancels previous request when selecting new collection', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
        bootstrap: { name: 'Bootstrap Icons' },
      });

      const requestSignals: AbortSignal[] = [];

      mockListIcons.mockImplementation(({ signal }: { signal?: AbortSignal }) => {
        if (signal !== undefined) {
          requestSignals.push(signal);
        }
        return Promise.resolve([{ name: 'home', categories: new Set() }]);
      });

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.collections).toEqual(['bootstrap', 'material']);
      });

      act(() => {
        result.current.setCollection('material');
      });

      await waitFor(() => {
        expect(mockListIcons).toHaveBeenCalledTimes(2);
      });

      expect(requestSignals).toHaveLength(2);
      expect(requestSignals[0]?.aborted).toBe(true);
    });
  });

  describe('search query manager', () => {
    it('exposes search query in the state', async () => {
      mockListIconSets.mockResolvedValue({});

      const { result } = renderHook(() => useIconGallery());

      act(() => {
        result.current.setSearchQuery('test query');
      });

      expect(result.current.searchQuery).toBe('test query');
    });
  });
});
