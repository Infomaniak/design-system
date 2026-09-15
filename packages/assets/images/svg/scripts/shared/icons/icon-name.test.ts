import { describe, expect, test } from 'vitest';
import { ICON_NAME_PATTERN } from './icon-name.ts';

describe('icon-name', () => {
  test('matches kebab-case icon names', () => {
    expect(ICON_NAME_PATTERN.test('magnifying-glass')).toBe(true);
    expect(ICON_NAME_PATTERN.test('a1')).toBe(true);
  });

  test('rejects non kebab-case icon names', () => {
    expect(ICON_NAME_PATTERN.test('')).toBe(false);
    expect(ICON_NAME_PATTERN.test('Bad_Name')).toBe(false);
    expect(ICON_NAME_PATTERN.test('icon.svg')).toBe(false);
    expect(ICON_NAME_PATTERN.test(' leading-dash')).toBe(false);
  });
});
