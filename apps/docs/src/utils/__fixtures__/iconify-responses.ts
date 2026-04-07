import type { IconifyInfo } from '@iconify/types';
import type { IconifyApiCollectionsList, IconifyApiListIconsResponse } from '../iconify-api.ts';

/**
 * Mock collections list response with multiple icon sets
 */
export const mockCollectionsList: IconifyApiCollectionsList = {
  material: {
    name: 'Material Design Icons',
    total: 5000,
    author: {
      name: 'Google',
      url: 'https://fonts.google.com/icons',
    },
    license: {
      title: 'Apache 2.0',
      spdx: 'Apache-2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0',
    },
    samples: ['home', 'settings', 'menu'],
    height: 24,
    category: 'General',
    tags: ['material', 'google', 'icon'],
  } as IconifyInfo,
  fa: {
    name: 'Font Awesome',
    total: 2000,
    author: {
      name: 'Font Awesome',
      url: 'https://fontawesome.com/',
    },
    license: {
      title: 'CC BY 4.0',
      spdx: 'CC-BY-4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    samples: ['star', 'heart', 'user'],
    height: 32,
    category: 'General',
    tags: ['fontawesome', 'icons'],
  } as IconifyInfo,
};

/**
 * Empty collections list (no icon sets available)
 */
export const mockEmptyCollectionsList: IconifyApiCollectionsList = {};

/**
 * Collection response with categorized icons
 */
export const mockCategorizedIconsResponse: IconifyApiListIconsResponse = {
  prefix: 'material',
  total: 4,
  title: 'Material Design Icons',
  categories: {
    interface: ['home', 'menu'],
    user: ['user', 'settings'],
  },
};

/**
 * Collection response with uncategorized icons
 */
export const mockUncategorizedIconsResponse: IconifyApiListIconsResponse = {
  prefix: 'fa',
  total: 3,
  title: 'Font Awesome',
  uncategorized: ['star', 'heart', 'bookmark'],
};

/**
 * Collection response with both categorized and uncategorized icons
 */
export const mockMixedIconsResponse: IconifyApiListIconsResponse = {
  prefix: 'carbon',
  total: 6,
  title: 'Carbon Design System',
  uncategorized: ['home', 'menu'],
  categories: {
    actions: ['delete', 'edit'],
    navigation: ['arrow-left', 'arrow-right'],
  },
};

/**
 * Empty collection response
 */
export const mockEmptyIconsResponse: IconifyApiListIconsResponse = {
  prefix: 'empty',
  total: 0,
  title: 'Empty Collection',
  uncategorized: [],
  categories: {},
};

/**
 * Collection response with icon appearing in multiple categories
 */
export const mockIconsWithMultipleCategories: IconifyApiListIconsResponse = {
  prefix: 'test',
  total: 3,
  title: 'Test Collection',
  categories: {
    category1: ['icon1', 'icon2'],
    category2: ['icon2', 'icon3'],
    category3: ['icon1'],
  },
};

/**
 * Collection response with hidden icons
 */
export const mockIconsWithHidden: IconifyApiListIconsResponse = {
  prefix: 'material',
  total: 5,
  title: 'Material Design Icons',
  categories: {
    visible: ['home', 'settings'],
  },
  hidden: ['old-icon', 'deprecated'],
};

/**
 * Collection response with aliases
 */
export const mockIconsWithAliases: IconifyApiListIconsResponse = {
  prefix: 'material',
  total: 3,
  title: 'Material Design Icons',
  categories: {
    default: ['home', 'settings', 'menu'],
  },
  aliases: {
    house: 'home',
    config: 'settings',
  },
};

/**
 * HTTP error response for 404 Not Found
 */
export const mockNotFoundError = {
  status: 404,
  statusText: 'Not Found',
  body: { error: 'Collection not found' },
};

/**
 * HTTP error response for 500 Server Error
 */
export const mockServerError = {
  status: 500,
  statusText: 'Internal Server Error',
  body: { error: 'Internal server error' },
};

/**
 * HTTP error response for 429 Rate Limited
 */
export const mockRateLimitError = {
  status: 429,
  statusText: 'Too Many Requests',
  body: { error: 'Rate limit exceeded' },
};
