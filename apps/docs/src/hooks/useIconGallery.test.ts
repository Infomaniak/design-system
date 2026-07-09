/**
 * @vitest-environment happy-dom
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIconGallery } from './useIconGallery.ts';

// Mock the IconifyApi class using hoisted mocks
const { mockListIconSets, mockSearch } = vi.hoisted(() => ({
  mockListIconSets: vi.fn(),
  mockSearch: vi.fn(),
}));

vi.mock('@infomaniak-design-system/components', () => {
  return {
    IconifyApi: class MockIconifyApi {
      listIconSets = mockListIconSets;
      search = mockSearch;
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

  describe('fetch icons on collection change', () => {
    it('fetches icons for selected collection', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
      });
      mockSearch.mockResolvedValue([
        { name: 'home', categories: new Set(['buildings']) },
        { name: 'settings', categories: new Set(['action']) },
      ]);

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.icons).toHaveLength(2);
      });

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          prefix: 'material',
          query: '',
          signal: expect.any(AbortSignal),
        }),
      );
      expect(result.current.totalCount).toBe(2);
      expect(result.current.filteredCount).toBe(2);
    });

    it('passes abort signal to search', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
      });
      mockSearch.mockResolvedValue([]);

      renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(mockSearch).toHaveBeenCalledWith(
          expect.objectContaining({
            signal: expect.any(AbortSignal),
          }),
        );
      });
    });
  });

  describe('search query filtering', () => {
    it('filters icons based on search query', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
      });
      mockSearch.mockImplementation(({ query }: { query: string }) => {
        if (query === 'home') {
          return Promise.resolve([{ name: 'home', categories: new Set(['buildings']) }]);
        }
        return Promise.resolve([
          { name: 'home', categories: new Set(['buildings']) },
          { name: 'settings', categories: new Set(['action']) },
        ]);
      });

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.icons).toHaveLength(2);
      });

      // Set search query
      act(() => {
        result.current.setSearchQuery('home');
      });

      // Wait for debounce
      await waitFor(
        () => {
          expect(result.current.icons).toHaveLength(1);
        },
        { timeout: 500 },
      );

      expect(result.current.icons[0].name).toBe('home');
      expect(result.current.totalCount).toBe(2);
      expect(result.current.filteredCount).toBe(1);
    });

    it('calls search with trimmed and lowercased query', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
      });
      mockSearch.mockResolvedValue([]);

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.isLoadingCollections).toBe(false);
      });

      act(() => {
        result.current.setSearchQuery('  HoMe  ');
      });

      await waitFor(
        () => {
          expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
              query: 'home',
            }),
          );
        },
        { timeout: 500 },
      );
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

  describe('clear search', () => {
    it('clears search query and triggers search with empty query', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
      });
      mockSearch.mockResolvedValue([{ name: 'home', categories: new Set(['buildings']) }]);

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.isLoadingCollections).toBe(false);
      });

      act(() => {
        result.current.setSearchQuery('home');
      });

      await waitFor(
        () => {
          expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
              query: 'home',
            }),
          );
        },
        { timeout: 500 },
      );

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchQuery).toBe('');
    });
  });

  describe('retry', () => {
    it('refetches icons when retry is called', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
      });
      mockSearch.mockResolvedValue([{ name: 'home', categories: new Set(['buildings']) }]);

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.icons).toHaveLength(1);
      });

      // Reset mock to track new calls
      mockSearch.mockClear();
      mockSearch.mockResolvedValue([
        { name: 'home', categories: new Set(['buildings']) },
        { name: 'settings', categories: new Set(['action']) },
      ]);

      act(() => {
        result.current.retry();
      });

      await waitFor(() => {
        expect(mockSearch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('error handling', () => {
    it('sets error when search fails', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
      });
      mockSearch.mockRejectedValue(new Error('Search failed'));

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      expect(result.current.error?.message).toBe('Search failed');
      expect(result.current.error?.code).toBe('API_ERROR');
    });

    it('sets abort error when request is aborted', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
      });

      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';
      mockSearch.mockRejectedValue(abortError);

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      expect(result.current.error?.code).toBe('ABORTED');
    });
  });

  describe('setCollection', () => {
    it('changes collection and resets search', async () => {
      mockListIconSets.mockResolvedValue({
        material: { name: 'Material Icons' },
        bootstrap: { name: 'Bootstrap Icons' },
      });
      mockSearch.mockResolvedValue([{ name: 'home', categories: new Set(['buildings']) }]);

      const { result } = renderHook(() => useIconGallery());

      await waitFor(() => {
        expect(result.current.selectedCollection).toBe('bootstrap');
      });

      mockSearch.mockClear();

      act(() => {
        result.current.setCollection('material');
      });

      expect(result.current.selectedCollection).toBe('material');
      expect(result.current.searchQuery).toBe('');

      await waitFor(() => {
        expect(mockSearch).toHaveBeenCalledWith(
          expect.objectContaining({
            prefix: 'material',
            query: '',
          }),
        );
      });
    });
  });
});
