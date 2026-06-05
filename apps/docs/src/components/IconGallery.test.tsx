/**
 * @vitest-environment happy-dom
 */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IconGalleryErrorType, IconItem } from '../hooks/useIconGallery.ts';
import IconGallery from './IconGallery.tsx';

const mockUseIconGallery = vi.fn();

// Mock the hook with proper type exports
vi.mock('../hooks/useIconGallery.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../hooks/useIconGallery.ts')>();
  return {
    ...actual,
    useIconGallery: (...args: unknown[]) => mockUseIconGallery(...args),
  };
});

describe('IconGallery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseIconGallery.mockReturnValue({
      collections: [],
      icons: [],
      totalCount: 0,
      filteredCount: 0,
      selectedCollection: null,
      searchQuery: '',
      isLoading: false,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders without errors', () => {
    const { container } = render(<IconGallery />);
    expect(container.firstChild).toBeTruthy();
  });

  it('displays Icon Gallery title', () => {
    const { container } = render(<IconGallery />);
    const heading = container.querySelector('h1');
    expect(heading?.textContent).toBe('Icon Gallery');
  });

  it('displays counter with filtered and total count', () => {
    mockUseIconGallery.mockReturnValue({
      collections: [],
      icons: [],
      totalCount: 100,
      filteredCount: 50,
      selectedCollection: null,
      searchQuery: '',
      isLoading: false,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
    const { getByText } = render(<IconGallery />);
    expect(getByText('Showing 50 of 100 icons')).toBeTruthy();
  });

  it('shows skeleton when loading', () => {
    mockUseIconGallery.mockReturnValue({
      collections: [],
      icons: [],
      totalCount: 0,
      filteredCount: 0,
      selectedCollection: null,
      searchQuery: '',
      isLoading: true,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
    const { container } = render(<IconGallery />);
    expect(container.querySelector('.icon-gallery-skeleton')).toBeTruthy();
  });

  it('shows error component when error exists', () => {
    const error: IconGalleryErrorType = {
      message: 'Failed to fetch icons',
      code: 'API_ERROR',
    };
    mockUseIconGallery.mockReturnValue({
      collections: [],
      icons: [],
      totalCount: 0,
      filteredCount: 0,
      selectedCollection: null,
      searchQuery: '',
      isLoading: false,
      error,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
    const { getByText } = render(<IconGallery />);
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Failed to fetch icons')).toBeTruthy();
  });

  it('shows empty state when no icons', () => {
    mockUseIconGallery.mockReturnValue({
      collections: [],
      icons: [],
      totalCount: 0,
      filteredCount: 0,
      selectedCollection: null,
      searchQuery: '',
      isLoading: false,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
    const { container } = render(<IconGallery />);
    expect(container.textContent).toContain('No icons in this collection');
  });

  it('shows clear search button in empty state when searchQuery exists', () => {
    const clearSearch = vi.fn();
    mockUseIconGallery.mockReturnValue({
      collections: [],
      icons: [],
      totalCount: 0,
      filteredCount: 0,
      selectedCollection: null,
      searchQuery: 'test',
      isLoading: false,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch,
    });
    const { getByText } = render(<IconGallery />);
    expect(getByText('No icons found for "test"')).toBeTruthy();
    expect(getByText('Clear search')).toBeTruthy();
  });

  it('shows grid when icons exist', () => {
    const icons: IconItem[] = [
      { name: 'user', categories: new Set(['interface']) },
      { name: 'settings', categories: new Set(['interface']) },
    ];
    mockUseIconGallery.mockReturnValue({
      collections: ['mdi'],
      icons,
      totalCount: 2,
      filteredCount: 2,
      selectedCollection: 'mdi',
      searchQuery: '',
      isLoading: false,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
    const { container } = render(<IconGallery />);
    expect(container.querySelector('.icon-grid')).toBeTruthy();
  });

  it('calls retry when retry button is clicked in error state', () => {
    const retry = vi.fn();
    const error: IconGalleryErrorType = {
      message: 'Failed to fetch',
      code: 'API_ERROR',
    };
    mockUseIconGallery.mockReturnValue({
      collections: [],
      icons: [],
      totalCount: 0,
      filteredCount: 0,
      selectedCollection: null,
      searchQuery: '',
      isLoading: false,
      error,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry,
      clearSearch: vi.fn(),
    });
    const { container } = render(<IconGallery />);
    const retryButton = container.querySelector('button');
    retryButton?.click();
    expect(retry).toHaveBeenCalled();
  });

  it('calls clearSearch when clear search button is clicked in empty state', () => {
    const clearSearch = vi.fn();
    mockUseIconGallery.mockReturnValue({
      collections: [],
      icons: [],
      totalCount: 0,
      filteredCount: 0,
      selectedCollection: null,
      searchQuery: 'test',
      isLoading: false,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch,
    });
    const { getByText } = render(<IconGallery />);
    const clearButton = getByText('Clear search');
    clearButton.click();
    expect(clearSearch).toHaveBeenCalled();
  });

  it('disables controls when loading', () => {
    mockUseIconGallery.mockReturnValue({
      collections: [],
      icons: [],
      totalCount: 0,
      filteredCount: 0,
      selectedCollection: null,
      searchQuery: '',
      isLoading: true,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
    const { container } = render(<IconGallery />);
    const searchInput = container.querySelector('input');
    const select = container.querySelector('select');
    expect(searchInput?.disabled).toBe(true);
    expect(select?.disabled).toBe(true);
  });

  it('disables controls when error exists', () => {
    const error: IconGalleryErrorType = {
      message: 'Failed',
      code: 'API_ERROR',
    };
    mockUseIconGallery.mockReturnValue({
      collections: [],
      icons: [],
      totalCount: 0,
      filteredCount: 0,
      selectedCollection: null,
      searchQuery: '',
      isLoading: false,
      error,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
    const { container } = render(<IconGallery />);
    const searchInput = container.querySelector('input');
    const select = container.querySelector('select');
    expect(searchInput?.disabled).toBe(true);
    expect(select?.disabled).toBe(true);
  });

  it('renders with collections populated', () => {
    mockUseIconGallery.mockReturnValue({
      collections: ['mdi', 'fa', 'carbon'],
      icons: [],
      totalCount: 0,
      filteredCount: 0,
      selectedCollection: null,
      searchQuery: '',
      isLoading: false,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
    const { container } = render(<IconGallery />);
    const options = container.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(1);
  });

  it('renders icon size slider with default value of 48', () => {
    mockUseIconGallery.mockReturnValue({
      collections: ['mdi'],
      icons: [],
      totalCount: 0,
      filteredCount: 0,
      selectedCollection: 'mdi',
      searchQuery: '',
      isLoading: false,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
    render(<IconGallery />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('48');
    expect(screen.getByText('48px')).toBeInTheDocument();
  });

  it('updates icon size when slider value changes', () => {
    const mockIcons: IconItem[] = [{ name: 'user', categories: new Set(['interface']) }];
    mockUseIconGallery.mockReturnValue({
      collections: ['mdi'],
      icons: mockIcons,
      totalCount: 1,
      filteredCount: 1,
      selectedCollection: 'mdi',
      searchQuery: '',
      isLoading: false,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
    const { container } = render(<IconGallery />);
    const slider = screen.getByRole('slider');

    fireEvent.change(slider, { target: { value: '64' } });

    const iconElement = container.querySelector('esds-icon');
    expect(iconElement).toHaveAttribute('style', expect.stringContaining('font-size: 64px'));
    expect(screen.getByText('64px')).toBeInTheDocument();
  });

  it('forwards icon size to IconGrid', () => {
    const mockIcons: IconItem[] = [
      { name: 'user', categories: new Set(['interface']) },
      { name: 'settings', categories: new Set(['interface']) },
    ];
    mockUseIconGallery.mockReturnValue({
      collections: ['mdi'],
      icons: mockIcons,
      totalCount: 2,
      filteredCount: 2,
      selectedCollection: 'mdi',
      searchQuery: '',
      isLoading: false,
      error: null,
      setCollection: vi.fn(),
      setSearchQuery: vi.fn(),
      retry: vi.fn(),
      clearSearch: vi.fn(),
    });
    const { container } = render(<IconGallery />);

    const iconElements = container.querySelectorAll('esds-icon');
    iconElements.forEach((el) => {
      expect(el).toHaveAttribute('style', expect.stringContaining('font-size: 48px'));
    });
  });
});
