import { IconifyApi } from '@infomaniak-design-system/esds-icon';
import { describe, expect, it, vi } from 'vitest';

describe('configure', () => {
  it('getApi() returns default instance when configure was never called', async () => {
    vi.resetModules();
    const { getApi } = await import('./configure.ts');
    const api1 = getApi();
    const api2 = getApi();
    expect(api1).toBeDefined();
    expect(api1.resources).toContain('https://iconify.infomaniak.com');
    expect(api1).toBe(api2);
  });

  it('configure() sets custom API returned by getApi()', async () => {
    vi.resetModules();
    const { configure, getApi } = await import('./configure.ts');
    const customApi = new IconifyApi({ resources: ['http://localhost'] });
    configure(customApi);
    expect(getApi()).toBe(customApi);
  });

  it('configure() throws on double configure', async () => {
    vi.resetModules();
    const { configure } = await import('./configure.ts');
    const customApi = new IconifyApi();
    configure(customApi);
    expect(() => configure(customApi)).toThrow('configure() can only be called once.');
  });
});
