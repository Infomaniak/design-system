import { describe, expect, it } from 'vitest';
import { IconifyApi } from './iconify-api.ts';

describe('IconifyApi', () => {
  it('should be constructible', () => {
    expect(new IconifyApi()).toBeDefined();
  });

  it('should list icons with aliases', async () => {
    const api = new IconifyApi();
    const result = await api.listIcons({ prefix: 'material-symbols' });

    expect(result.icons.length).toBeGreaterThan(0);
    result.icons.forEach((icon) => {
      expect(icon).toHaveProperty('name');
      expect(icon).toHaveProperty('categories');
      expect(icon).toHaveProperty('aliases');
      expect(icon.aliases).toBeInstanceOf(Set);
    });
  });
});
