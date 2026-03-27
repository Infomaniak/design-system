import { describe, expect, it } from 'vitest';
import { IconifyApi } from './iconify-api.ts';

describe('IconifyApi', () => {
  it('should be constructible', () => {
    expect(new IconifyApi()).toBeDefined();
  });
});
