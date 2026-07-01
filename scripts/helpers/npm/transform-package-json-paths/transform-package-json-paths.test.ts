import { describe, expect, it } from 'vitest';
import {
  transformPackageJsonPaths,
  type TransformPackageJsonPathsConfig,
} from './transform-package-json-paths.ts';

describe('transformPackageJsonPaths', () => {
  const defaultConfig: TransformPackageJsonPathsConfig = {
    patterns: ['./dist/', '/dist/'],
  };

  describe('basic path transformation', () => {
    it('should strip ./dist/ prefix from main field', () => {
      const pkg = { name: 'test', version: '1.0.0', main: './dist/esds-icon.umd.cjs' };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.main).toBe('./esds-icon.umd.cjs');
    });

    it('should strip /dist/ prefix from main field', () => {
      const pkg = { name: 'test', version: '1.0.0', main: '/dist/esds-icon.umd.cjs' };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.main).toBe('./esds-icon.umd.cjs');
    });

    it('should strip ./dist/ prefix from module field', () => {
      const pkg = { name: 'test', version: '1.0.0', module: './dist/esds-icon.js' };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.module).toBe('./esds-icon.js');
    });

    it('should strip ./dist/ prefix from types field', () => {
      const pkg = { name: 'test', version: '1.0.0', types: './dist/public-api.d.ts' };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.types).toBe('./public-api.d.ts');
    });
  });

  describe('exports transformation', () => {
    it('should transform simple string exports', () => {
      const pkg = { name: 'test', version: '1.0.0', exports: './dist/index.js' };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.exports).toBe('./index.js');
    });

    it('should transform obj with dot and simple conditions', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        exports: {
          '.': './dist/index.js',
        },
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.exports).toEqual({ '.': './index.js' });
    });

    it('should transform nested export conditions (import/require/defaults)', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        exports: {
          '.': {
            import: {
              types: './dist/public-api.d.ts',
              default: './dist/esds-icon.js',
            },
            require: {
              types: './dist/public-api.d.ts',
              default: './dist/esds-icon.umd.cjs',
            },
          },
        },
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.exports).toEqual({
        '.': {
          import: {
            types: './public-api.d.ts',
            default: './esds-icon.js',
          },
          require: {
            types: './public-api.d.ts',
            default: './esds-icon.umd.cjs',
          },
        },
      });
    });

    it('should transform subpath exports', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        exports: {
          './api/*': './dist/api/*.js',
          './utils': './dist/utils/index.js',
        },
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.exports).toEqual({
        './api/*': './api/*.js',
        './utils': './utils/index.js',
      });
    });

    it('should handle wildcard patterns in paths', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        exports: {
          './icons/*': './dist/icons/*.js',
          './components/*': {
            types: './dist/components/*.d.ts',
            import: './dist/components/*.mjs',
            require: './dist/components/*.cjs',
          },
        },
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.exports).toEqual({
        './icons/*': './icons/*.js',
        './components/*': {
          types: './components/*.d.ts',
          import: './components/*.mjs',
          require: './components/*.cjs',
        },
      });
    });

    it('should preserve non-path values in exports', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        exports: {
          './api': {
            types: './dist/api.d.ts',
            default: null,
          },
        },
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.exports).toEqual({
        './api': {
          types: './api.d.ts',
          default: null,
        },
      });
    });
  });

  describe('fallback arrays', () => {
    it('should transform fallback arrays', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        exports: {
          '.': ['./dist/main.js', './dist/backup.js'],
        },
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.exports).toEqual({
        '.': ['./main.js', './backup.js'],
      });
    });

    it('should handle mixed fallback types', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        exports: {
          '.': ['./dist/esm.mjs', { require: './dist/cjs.cjs', import: './dist/esm.mjs' }],
        },
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.exports).toEqual({
        '.': ['./esm.mjs', { require: './cjs.cjs', import: './esm.mjs' }],
      });
    });
  });

  describe('conservative transformation (only first occurrence)', () => {
    it('should only transform first occurrence of prefix in a path', () => {
      // This tests that we don't double-transform
      const pkg = { name: 'test', version: '1.0.0', main: './dist/dist/file.js' };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      // Should only strip first ./dist/
      expect(result.main).toBe('./dist/file.js');
    });

    it('should not transform paths without prefix', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        main: './lib/index.js',
        module: './src/index.js',
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.main).toBe('./lib/index.js');
      expect(result.module).toBe('./src/index.js');
    });

    it('should not transform paths with dist in the middle', () => {
      const pkg = { name: 'test', version: '1.0.0', main: './lib/dist/index.js' };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.main).toBe('./lib/dist/index.js');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined fields gracefully', () => {
      const pkg = { name: 'test', version: '1.0.0' };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result).toEqual({ name: 'test', version: '1.0.0' });
    });

    it('should handle empty exports object', () => {
      const pkg = { name: 'test', version: '1.0.0', exports: {} };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.exports).toEqual({});
    });

    it('should preserve other package fields', () => {
      const pkg = {
        name: '@scope/package',
        version: '1.0.0',
        type: 'module',
        description: 'Test package',
        main: './dist/index.js',
        customField: 'custom-value',
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.name).toBe('@scope/package');
      expect(result.type).toBe('module');
      expect(result.description).toBe('Test package');
      expect(result.customField).toBe('custom-value');
      expect(result.main).toBe('./index.js');
    });

    it('should handle deeply nested export conditions', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        exports: {
          '.': {
            node: {
              import: {
                types: './dist/node/import.d.ts',
                default: './dist/node/import.js',
              },
            },
            browser: {
              import: {
                types: './dist/browser/import.d.ts',
                default: './dist/browser/import.js',
              },
            },
          },
        },
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.exports).toEqual({
        '.': {
          node: {
            import: {
              types: './node/import.d.ts',
              default: './node/import.js',
            },
          },
          browser: {
            import: {
              types: './browser/import.d.ts',
              default: './browser/import.js',
            },
          },
        },
      });
    });
  });

  describe('custom patterns', () => {
    it('should support custom patterns', () => {
      const config: TransformPackageJsonPathsConfig = {
        patterns: ['./out/', './build/'],
      };
      const pkg = {
        name: 'test',
        version: '1.0.0',
        main: './out/index.js',
        module: './build/index.js',
      };
      const result = transformPackageJsonPaths(pkg, config);
      expect(result.main).toBe('./index.js');
      expect(result.module).toBe('./index.js');
    });

    it('should support single pattern', () => {
      const config: TransformPackageJsonPathsConfig = {
        patterns: ['./lib/'],
      };
      const pkg = { name: 'test', version: '1.0.0', main: './lib/index.js' };
      const result = transformPackageJsonPaths(pkg, config);
      expect(result.main).toBe('./index.js');
    });
  });

  describe('real-world scenario', () => {
    it('should handle the actual esds-icon package structure', () => {
      const pkg = {
        name: '@infomaniak-design-system/esds-icon',
        version: '1.0.0',
        type: 'module',
        main: './dist/esds-icon.umd.cjs',
        module: './dist/esds-icon.js',
        types: './dist/public-api.d.ts',
        exports: {
          '.': {
            import: {
              types: './dist/public-api.d.ts',
              default: './dist/esds-icon.js',
            },
            require: {
              types: './dist/public-api.d.ts',
              default: './dist/esds-icon.umd.cjs',
            },
          },
        },
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.main).toBe('./esds-icon.umd.cjs');
      expect(result.module).toBe('./esds-icon.js');
      expect(result.types).toBe('./public-api.d.ts');
      expect(result.exports).toEqual({
        '.': {
          import: {
            types: './public-api.d.ts',
            default: './esds-icon.js',
          },
          require: {
            types: './public-api.d.ts',
            default: './esds-icon.umd.cjs',
          },
        },
      });
    });
  });

  describe('files transformation', () => {
    it('should transform bare "dist" in files to "./"', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        files: ['dist', 'custom-elements.json'],
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.files).toEqual(['./', 'custom-elements.json']);
    });

    it('should transform bare "./dist" in files to "./"', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        files: ['./dist', 'custom-elements.json'],
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.files).toEqual(['./', 'custom-elements.json']);
    });

    it('should transform "dist/" with trailing slash in files to "./"', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        files: ['dist/', 'custom-elements.json'],
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.files).toEqual(['./', 'custom-elements.json']);
    });

    it('should transform "/dist" with absolute prefix (no slash) in files to "./"', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        files: ['/dist', 'custom-elements.json'],
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.files).toEqual(['./', 'custom-elements.json']);
    });

    it('should transform "/dist/" with absolute prefix (with slash) in files to "./"', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        files: ['/dist/', 'custom-elements.json'],
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      expect(result.files).toEqual(['./', 'custom-elements.json']);
    });

    it('should NOT transform nested directory patterns in files (out of scope for bare dir fallback)', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        files: ['dist/nested', 'custom-elements.json'],
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      // dist/nested is not a bare dir name, so it falls through unchanged
      expect(result.files).toEqual(['dist/nested', 'custom-elements.json']);
    });

    it('should NOT transform nested directory patterns with trailing slash in files', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        files: ['dist/nested/', 'custom-elements.json'],
      };
      const result = transformPackageJsonPaths(pkg, defaultConfig);
      // dist/nested/ is not a bare dir name, so it falls through unchanged
      expect(result.files).toEqual(['dist/nested/', 'custom-elements.json']);
    });
  });
});
