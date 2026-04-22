import {
  type IconifyApiIconList,
  type IconifyApiIconListIcon,
  IconifyApi,
} from '@infomaniak-design-system/esds-icon';

import { useCallback, useEffect, useRef, useState } from 'react';
import { iconifyApi } from '../lib/iconify-api.ts';
import { IconGalleryErrorCode } from '../types/error-codes.ts';

export interface IconItem {
  readonly name: string;
  readonly categories: ReadonlySet<string>;
}

export interface IconGalleryErrorType {
  readonly message: string;
  readonly code: IconGalleryErrorCode;
}

export interface UseIconGalleryReturn {
  readonly collections: readonly string[];
  readonly icons: readonly IconItem[];
  readonly totalCount: number;
  readonly filteredCount: number;
  readonly selectedCollection: string;
  readonly searchQuery: string;
  readonly isLoading: boolean;
  readonly isLoadingCollections: boolean;
  readonly isLoadingIcons: boolean;
  readonly error: IconGalleryErrorType | null;
  readonly setCollection: (collection: string) => void;
  readonly setSearchQuery: (query: string) => void;
  readonly retry: () => void;
  readonly clearSearch: () => void;
}

const SEARCH_DEBOUNCE_MS = 300;

function mapApiIconToIconItem(icon: IconifyApiIconListIcon): IconItem {
  return {
    name: icon.name,
    categories: icon.categories,
  };
}

function normalizeError(error: unknown): IconGalleryErrorType {
  if (error instanceof Error) {
    return {
      message: error.message,
      code:
        error.name === 'AbortError' ? IconGalleryErrorCode.ABORTED : IconGalleryErrorCode.API_ERROR,
    };
  }
  return {
    message: 'An unknown error occurred',
    code: IconGalleryErrorCode.UNKNOWN_ERROR,
  };
}

export function useIconGallery(api: IconifyApi = iconifyApi): UseIconGalleryReturn {
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [collections, setCollections] = useState<readonly string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [icons, setIcons] = useState<readonly IconItem[]>([]);
  const [totalIconsCount, setTotalIconsCount] = useState<number>(0);
  const [searchQuery, setSearchQueryState] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [isLoadingCollections, setIsLoadingCollections] = useState<boolean>(false);
  const [isLoadingIcons, setIsLoadingIcons] = useState<boolean>(false);
  const [error, setError] = useState<IconGalleryErrorType | null>(null);

  const isLoading = isLoadingCollections || isLoadingIcons;

  const abortCurrentRequest = useCallback((): void => {
    if (abortControllerRef.current !== null) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const setSearchQuery = useCallback((query: string): void => {
    setSearchQueryState(query);

    if (searchDebounceRef.current !== null) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearchQuery(query.trim().toLowerCase());
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  const fetchCollections = useCallback(
    async (signal: AbortSignal): Promise<void> => {
      try {
        setIsLoadingCollections(true);
        setError(null);

        const collectionsList = await api.listIconSets({ signal });
        const collectionNames = Object.keys(collectionsList).sort();

        setCollections(collectionNames);

        if (collectionNames.length > 0) {
          setSelectedCollection(collectionNames[0]);
        }
      } catch (err) {
        if (signal.aborted) {
          return;
        }
        setError(normalizeError(err));
      } finally {
        setIsLoadingCollections(false);
      }
    },
    [api],
  );

  const fetchTotalCount = useCallback(
    async (prefix: string, signal: AbortSignal): Promise<void> => {
      try {
        const allIcons = await api.search({ prefix, query: '', signal });
        setTotalIconsCount(allIcons.length);
      } catch {
        // Silently fail for total count - it's secondary
      }
    },
    [api],
  );

  const fetchIcons = useCallback(
    async (prefix: string, searchQuery: string, signal: AbortSignal): Promise<void> => {
      try {
        setIsLoadingIcons(true);
        setError(null);

        const iconItems: IconifyApiIconList = await api.search({
          prefix,
          query: searchQuery,
          signal,
        });

        const convertedIcons = iconItems.map(mapApiIconToIconItem);
        setIcons(convertedIcons);
      } catch (err) {
        if (signal.aborted) {
          return;
        }
        setError(normalizeError(err));
      } finally {
        setIsLoadingIcons(false);
        if (abortControllerRef.current?.signal === signal) {
          abortControllerRef.current = null;
        }
      }
    },
    [api],
  );

  // Load collections on mount
  useEffect(() => {
    const abortController = new AbortController();
    void fetchCollections(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [fetchCollections]);

  // Load icons when selected collection or debounced search query changes
  useEffect(() => {
    if (selectedCollection === '') {
      return;
    }

    abortCurrentRequest();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Fetch both in parallel
    void fetchTotalCount(selectedCollection, abortController.signal);
    void fetchIcons(selectedCollection, debouncedSearchQuery, abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [selectedCollection, debouncedSearchQuery, fetchTotalCount, fetchIcons, abortCurrentRequest]);

  const setCollection = useCallback((collection: string): void => {
    setSelectedCollection(collection);
    setSearchQueryState('');
    setDebouncedSearchQuery('');
  }, []);

  const clearSearch = useCallback((): void => {
    setSearchQueryState('');
    setDebouncedSearchQuery('');

    if (searchDebounceRef.current !== null) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
  }, []);

  const retry = useCallback((): void => {
    if (collections.length === 0) {
      abortCurrentRequest();

      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      void fetchCollections(abortController.signal);
    } else if (selectedCollection !== '') {
      abortCurrentRequest();

      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      void fetchTotalCount(selectedCollection, abortController.signal);
      void fetchIcons(selectedCollection, debouncedSearchQuery, abortController.signal);
    }
  }, [
    collections.length,
    selectedCollection,
    debouncedSearchQuery,
    fetchCollections,
    fetchTotalCount,
    fetchIcons,
    abortCurrentRequest,
  ]);

  useEffect(() => {
    return () => {
      abortCurrentRequest();

      if (searchDebounceRef.current !== null) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [abortCurrentRequest]);

  return {
    collections,
    icons,
    totalCount: totalIconsCount,
    filteredCount: icons.length,
    selectedCollection,
    searchQuery,
    isLoading,
    isLoadingCollections,
    isLoadingIcons,
    error,
    setCollection,
    setSearchQuery,
    retry,
    clearSearch,
  };
}
