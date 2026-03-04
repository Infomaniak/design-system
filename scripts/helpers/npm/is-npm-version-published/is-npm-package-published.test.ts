import { afterEach, describe, expect, it, vi } from 'vitest';
import { isNpmPackagePublished } from './is-npm-package-published.ts';

describe('isNpmPackagePublished', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true when npm answers 200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return { status: 200 };
      }),
    );

    await expect(isNpmPackagePublished({ name: '@scope/a', version: '1.0.0' })).resolves.toBe(true);
  });

  it('returns false when npm answers 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return { status: 404 };
      }),
    );

    await expect(isNpmPackagePublished({ name: '@scope/a', version: '1.0.0' })).resolves.toBe(
      false,
    );
  });

  it('throws when npm answers an unexpected status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return { status: 503 };
      }),
    );

    await expect(isNpmPackagePublished({ name: '@scope/a', version: '1.0.0' })).rejects.toThrow(
      '503',
    );
  });

  it('throws a clear error when registry cannot be reached', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      }),
    );

    await expect(isNpmPackagePublished({ name: '@scope/a', version: '1.0.0' })).rejects.toThrow(
      'Unable to reach npm registry',
    );
  });
});
