/**
 * @vitest-environment happy-dom
 */

import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { IconGalleryErrorType, IconItem, UseIconGalleryReturn } from './useIconGallery.ts';
import * as useIconGalleryModule from './useIconGallery.ts';
import { useUrlPersistence } from './useUrlPersistence.ts';

describe('useUrlPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('calls useIconGallery', () => {
    const mockUseIconGallery = vi.spyOn(useIconGalleryModule, 'useIconGallery');
    mockUseIconGallery.mockReturnValue(createMockGallery());

    renderHook(() => useUrlPersistence());

    expect(mockUseIconGallery).toHaveBeenCalled();
  });

  test('returns gallery hook result', () => {
    const mockGallery = createMockGallery({
      collections: ['system', 'mail'],
      selectedCollection: 'mail',
      searchQuery: 'home',
    });

    vi.spyOn(useIconGalleryModule, 'useIconGallery').mockReturnValue(mockGallery);

    const { result } = renderHook(() => useUrlPersistence());

    expect(result.current.collections).toEqual(['system', 'mail']);
    expect(result.current.selectedCollection).toBe('mail');
    expect(result.current.searchQuery).toBe('home');
  });
});

function createMockGallery(overrides: Partial<UseIconGalleryReturn> = {}): UseIconGalleryReturn {
  return {
    collections: ['system', 'mail', 'kdrive'],
    icons: [] as readonly IconItem[],
    totalCount: 0,
    filteredCount: 0,
    selectedCollection: 'system',
    searchQuery: '',
    isLoading: false,
    isLoadingCollections: false,
    isLoadingIcons: false,
    error: null as IconGalleryErrorType | null,
    setCollection: vi.fn(),
    setSearchQuery: vi.fn(),
    retry: vi.fn(),
    clearSearch: vi.fn(),
    ...overrides,
  };
}
