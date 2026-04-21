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

vi.mock('@infomaniak-design-system/esds-icon', () => {
  return {
    IconifyApi: class MockIconifyApi {
      listIconSets = mockListIconSets;
      listIconsCached = mockListIcons;
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
