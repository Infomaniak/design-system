import type { PackageJsonExportsEntryPath } from '../../file/package-json/package-json-exports/package-json-exports.ts';

export interface TransformPackageJsonPathsConfig {
  /**
   * Patterns to strip from the start of paths.
   * Patterns are matched against the start of the path only.
   * Example: ['./dist/', '/dist/']
   */
  readonly patterns: readonly string[];
}

interface PackageJsonWithPaths {
  name: string;
  version: string;
  main?: string;
  module?: string;
  types?: string;
  exports?: unknown;
  files?: string[];
}

/**
 * Transforms package.json paths by stripping specified prefixes.
 * Only transforms the first occurrence of any matching pattern (conservative).
 * Only supports main, module, types, and exports fields.
 *
 * @example
 * ```typescript
 * const config = { patterns: ['./dist/', '/dist/'] };
 * transformPackageJsonPaths({ name: 'test', version: '1.0.0', main: './dist/index.js' }, config)
 * // Returns: { name: 'test', version: '1.0.0', main: './index.js' }
 * ```
 */
export function transformPackageJsonPaths<P extends PackageJsonWithPaths>(
  packageJson: P,
  config: TransformPackageJsonPathsConfig,
): P {
  const { patterns } = config;

  /**
   * Transforms a single path by stripping the first matching pattern prefix.
   * Replaces the stripped prefix with './' to ensure valid relative paths.
   */
  const transformPath = (path: PackageJsonExportsEntryPath): PackageJsonExportsEntryPath => {
    if (path === null || path === undefined) {
      return path;
    }

    for (const pattern of patterns) {
      const normalizedPattern = pattern.startsWith('.') ? pattern : `./${pattern}`;

      if (path.startsWith(normalizedPattern)) {
        // Conservative: Replace only the first occurrence
        return path.replace(normalizedPattern, './');
      }

      // Also check if pattern doesn't start with ./ but path uses absolute style
      const absolutePattern = pattern.startsWith('/') ? pattern : `/${pattern}`;
      if (path.startsWith(absolutePattern)) {
        return path.replace(absolutePattern, './');
      }
    }

    // Fallback for bare directory names (e.g. "dist" or "./dist")
    // that appear in files[] arrays without a trailing slash.
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
    for (const pattern of patterns) {
      const bare = pattern.endsWith('/') ? pattern.slice(0, -1) : pattern;

      if (normalizedPath === bare) {
        return './';
      }

      const unprefixed = bare.startsWith('./') ? bare.slice(2) : bare.startsWith('/') ? bare.slice(1) : bare;
      if (normalizedPath === unprefixed) {
        return './';
      }

      const withDotPrefix = `./${unprefixed}`;
      if (normalizedPath === withDotPrefix) {
        return './';
      }
    }

    return path;
  };

  /**
   * Transforms an exports entry object recursively.
   * Only transforms values for known export conditions.
   */
  const transformEntryObject = (obj: Record<string, unknown>): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    const knownConditions = ['import', 'require', 'node', 'default', 'types', 'browser'];

    for (const [key, value] of Object.entries(obj)) {
      if (knownConditions.includes(key)) {
        // Transform nested path entries
        if (typeof value === 'string') {
          result[key] = transformPath(value);
        } else if (Array.isArray(value)) {
          result[key] = transformFallbacks(value);
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          result[key] = transformEntryObject(value as Record<string, unknown>);
        } else {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  };

  /**
   * Transforms a fallbacks array recursively.
   */
  const transformFallbacks = (arr: readonly unknown[]): unknown[] => {
    return arr.map((item) => {
      if (typeof item === 'string') {
        return transformPath(item);
      }
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return transformEntryObject(item as Record<string, unknown>);
      }
      if (Array.isArray(item)) {
        return transformFallbacks(item);
      }
      return item;
    });
  };

  /**
   * Transforms a single exports entry (string, null, object, or array).
   */
  const transformExportsEntry = (entry: unknown): unknown => {
    if (typeof entry === 'string') {
      return transformPath(entry);
    }

    if (entry === null) {
      return entry;
    }

    if (Array.isArray(entry)) {
      return transformFallbacks(entry);
    }

    if (entry && typeof entry === 'object') {
      return transformEntryObject(entry as Record<string, unknown>);
    }

    return entry;
  };

  /**
   * Transforms the entire exports structure.
   */
  const transformExports = (exports: unknown): unknown => {
    if (typeof exports === 'string') {
      return transformPath(exports);
    }

    if (exports === null) {
      return exports;
    }

    if (Array.isArray(exports)) {
      return transformFallbacks(exports);
    }

    if (typeof exports === 'object') {
      const result: Record<string, unknown> = {};
      const knownConditions = ['import', 'require', 'node', 'default', 'types', 'browser'];

      for (const [key, value] of Object.entries(exports)) {
        if (key.startsWith('.')) {
          // Subpath export - transform recursively
          result[key] = transformExportsEntry(value);
        } else if (knownConditions.includes(key)) {
          // Top-level export condition
          if (typeof value === 'string') {
            result[key] = transformPath(value);
          } else if (Array.isArray(value)) {
            result[key] = transformFallbacks(value);
          } else if (value && typeof value === 'object') {
            result[key] = transformEntryObject(value as Record<string, unknown>);
          } else {
            result[key] = value;
          }
        } else {
          result[key] = value;
        }
      }

      return result;
    }

    return exports;
  };

  return {
    ...packageJson,
    main: packageJson.main ? transformPath(packageJson.main) : undefined,
    module: packageJson.module ? transformPath(packageJson.module) : undefined,
    types: packageJson.types ? transformPath(packageJson.types) : undefined,
    exports: packageJson.exports ? transformExports(packageJson.exports) : undefined,
    files: packageJson.files?.map((file: string) => transformPath(file) ?? file),
  } as P;
}
