import { useCallback, useEffect, useRef, useState } from 'react';
import { iconifyApi } from '../lib/iconify-api.ts';
import { useIconGallery, type UseIconGalleryReturn } from './useIconGallery.ts';

const URL_PARAM_SEARCH = 'search';
const URL_PARAM_COLLECTION = 'collection';
const REPLACESTATE_DEBOUNCE_MS = 100;

function getParentUrl(): URL | null {
  try {
    if (typeof window === 'undefined' || !window.parent) {
      return null;
    }
    return new URL(window.parent.location.href);
  } catch {
    return null;
  }
}

function getUrlParam(name: string): string | null {
  const url = getParentUrl();
  if (!url) return null;
  return url.searchParams.get(name);
}

function setUrlParams(params: Record<string, string | null>): void {
  const url = getParentUrl();
  if (!url) return;

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  const searchString = url.search;
  const baseUrl = url.toString().split('?')[0];

  // Decode slashes for cleaner URLs (Storybook's path param)
  const cleanUrl = baseUrl + searchString.replace(/%2F/g, '/');

  window.parent.history.replaceState(null, '', cleanUrl);
}

export function useUrlPersistence(): UseIconGalleryReturn {
  const gallery = useIconGallery(iconifyApi);
  const { collections, selectedCollection, searchQuery, setCollection, setSearchQuery } = gallery;

  const [urlParamsApplied, setUrlParamsApplied] = useState(false);
  const pendingReplaceStateRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedStateRef = useRef<{ search: string; collection: string }>({
    search: '',
    collection: '',
  });

  // Apply URL params on initial load
  useEffect(() => {
    if (urlParamsApplied || collections.length === 0) {
      return;
    }

    const urlCollection = getUrlParam(URL_PARAM_COLLECTION);
    const urlSearch = getUrlParam(URL_PARAM_SEARCH);

    // Apply collection if valid
    if (urlCollection && collections.includes(urlCollection)) {
      setCollection(urlCollection);
    }

    // Apply search if present
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }

    setUrlParamsApplied(true);
  }, [collections, urlParamsApplied, setCollection, setSearchQuery]);

  // Sync state changes to URL
  const syncToUrl = useCallback((search: string, collection: string): void => {
    // Skip if state hasn't changed from last sync
    if (
      lastSyncedStateRef.current.search === search &&
      lastSyncedStateRef.current.collection === collection
    ) {
      return;
    }

    lastSyncedStateRef.current = { search, collection };

    setUrlParams({
      [URL_PARAM_SEARCH]: search || null,
      [URL_PARAM_COLLECTION]: collection || null,
    });
  }, []);

  // Debounced URL update for search
  useEffect(() => {
    if (!urlParamsApplied) return;

    // Clear pending update
    if (pendingReplaceStateRef.current) {
      clearTimeout(pendingReplaceStateRef.current);
    }

    // Debounce URL updates to avoid rapid replaceState calls while typing
    pendingReplaceStateRef.current = setTimeout(() => {
      syncToUrl(searchQuery, selectedCollection);
    }, REPLACESTATE_DEBOUNCE_MS);

    return () => {
      if (pendingReplaceStateRef.current) {
        clearTimeout(pendingReplaceStateRef.current);
      }
    };
  }, [searchQuery, selectedCollection, urlParamsApplied, syncToUrl]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (pendingReplaceStateRef.current) {
        clearTimeout(pendingReplaceStateRef.current);
      }
    };
  }, []);

  return gallery;
}
