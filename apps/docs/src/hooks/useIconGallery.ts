import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconGalleryErrorCode } from '../types/error-codes.ts';
import { IconifyApi, type IconifyApiIconListIconsOptimizedIcon } from '../utils/iconify-api.ts';

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

function mapApiIconToIconItem(icon: IconifyApiIconListIconsOptimizedIcon): IconItem {
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

export function useIconGallery(): UseIconGalleryReturn {
  const api = useMemo(() => new IconifyApi(), []);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, IconItem[]>>(new Map());
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [collections, setCollections] = useState<readonly string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [icons, setIcons] = useState<readonly IconItem[]>([]);
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

  const fetchIcons = useCallback(
    async (prefix: string, signal: AbortSignal): Promise<void> => {
      try {
        setIsLoadingIcons(true);
        setError(null);

        const cachedIcons = cacheRef.current.get(prefix);
        if (cachedIcons !== undefined) {
          setIcons(cachedIcons);
          return;
        }

        const iconItems = await api.listIconsOptimized({
          prefix,
          signal,
        });

        const convertedIcons = iconItems.map(mapApiIconToIconItem);

        cacheRef.current.set(prefix, convertedIcons);
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

  // Load icons when selected collection changes
  useEffect(() => {
    if (selectedCollection === '') {
      return;
    }

    abortCurrentRequest();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    void fetchIcons(selectedCollection, abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [selectedCollection, fetchIcons, abortCurrentRequest]);

  const filteredIcons = useMemo((): readonly IconItem[] => {
    if (debouncedSearchQuery === '') {
      return icons;
    }

    return icons.filter((icon) => icon.name.toLowerCase().includes(debouncedSearchQuery));
  }, [icons, debouncedSearchQuery]);

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
      const abortController = new AbortController();
      void fetchCollections(abortController.signal);
    } else if (selectedCollection !== '') {
      cacheRef.current.delete(selectedCollection);
      abortCurrentRequest();

      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      void fetchIcons(selectedCollection, abortController.signal);
    }
  }, [collections.length, selectedCollection, fetchCollections, fetchIcons, abortCurrentRequest]);

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
    icons: filteredIcons,
    totalCount: icons.length,
    filteredCount: filteredIcons.length,
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
