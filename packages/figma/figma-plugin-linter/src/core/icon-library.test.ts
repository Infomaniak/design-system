import { describe, expect, it } from 'vitest';
import {
  ICON_LIBRARY_COMPONENT_PREFIX,
  isIconLibraryComponent,
  matchesIconInventory,
  toIconLeafName,
} from './icon-library.ts';

describe('isIconLibraryComponent', () => {
  it('accepts the icon library component naming convention', () => {
    expect(isIconLibraryComponent('esds/icon/plus')).toBe(true);
    expect(isIconLibraryComponent('esds/icon/chevron-right')).toBe(true);
  });

  it('rejects other names', () => {
    expect(isIconLibraryComponent('icon/plus')).toBe(false);
    expect(isIconLibraryComponent('esds/icons/plus')).toBe(false);
    expect(isIconLibraryComponent('Card')).toBe(false);
    expect(isIconLibraryComponent('')).toBe(false);
  });

  it('documents the convention prefix', () => {
    expect(ICON_LIBRARY_COMPONENT_PREFIX).toBe('esds/icon/');
  });
});

describe('toIconLeafName', () => {
  it('strips the esds/icon/ prefix', () => {
    expect(toIconLeafName('esds/icon/plus')).toBe('plus');
    expect(toIconLeafName('plus')).toBe('plus');
    expect(toIconLeafName('esds/icon/chevron-right')).toBe('chevron-right');
  });
});

describe('matchesIconInventory', () => {
  const inventory: ReadonlySet<string> = new Set(['plus', 'chevron-right']);

  it('matches bare and prefixed icon names exactly', () => {
    expect(matchesIconInventory('plus', inventory)).toBe(true);
    expect(matchesIconInventory('esds/icon/plus', inventory)).toBe(true);
    expect(matchesIconInventory('chevron-right', inventory)).toBe(true);
  });

  it('never matches partial or renamed names', () => {
    expect(matchesIconInventory('plus copy', inventory)).toBe(false);
    expect(matchesIconInventory('icon plus', inventory)).toBe(false);
    expect(matchesIconInventory('esds/icon/plus-bold', inventory)).toBe(false);
    expect(matchesIconInventory('chevron', inventory)).toBe(false);
    expect(matchesIconInventory('', inventory)).toBe(false);
  });
});
