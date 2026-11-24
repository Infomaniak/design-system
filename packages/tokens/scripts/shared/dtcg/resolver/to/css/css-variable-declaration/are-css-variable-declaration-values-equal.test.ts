import { describe, expect, it } from 'vitest';
import { areCssVariableDeclarationValuesEqual } from './are-css-variable-declaration-values-equal.ts';
import type { CssVariableDeclaration } from './css-variable-declaration.ts';

const DECLARATION: CssVariableDeclaration = {
  name: '--esds-color-background-brand',
  value: 'var(--esds-color-background-brand-mail)',
  derived: [{ name: '--esds-color-background-brand-a', value: 'var(--esds-color-gray-100-a)' }],
};

describe('areCssVariableDeclarationValuesEqual', () => {
  it('returns true for identical declarations', () => {
    expect(areCssVariableDeclarationValuesEqual(DECLARATION, { ...DECLARATION })).toBe(true);
  });

  it('ignores documentation-only differences', () => {
    expect(
      areCssVariableDeclarationValuesEqual(DECLARATION, {
        ...DECLARATION,
        description: 'A different comment.',
        deprecated: 'Use another token instead.',
      }),
    ).toBe(true);
  });

  it('returns false for a different name', () => {
    expect(
      areCssVariableDeclarationValuesEqual(DECLARATION, { ...DECLARATION, name: '--esds-other' }),
    ).toBe(false);
  });

  it('returns false for a different value', () => {
    expect(
      areCssVariableDeclarationValuesEqual(DECLARATION, { ...DECLARATION, value: '#888888' }),
    ).toBe(false);
  });

  it('returns false when only one declaration has derived declarations', () => {
    expect(
      areCssVariableDeclarationValuesEqual(DECLARATION, {
        name: DECLARATION.name,
        value: DECLARATION.value,
      }),
    ).toBe(false);
  });

  it('returns false for derived declarations with different lengths', () => {
    expect(
      areCssVariableDeclarationValuesEqual(DECLARATION, {
        ...DECLARATION,
        derived: [...DECLARATION.derived!, { name: '--esds-extra', value: '#000000' }],
      }),
    ).toBe(false);
  });

  it('returns false for derived declarations with different values', () => {
    expect(
      areCssVariableDeclarationValuesEqual(DECLARATION, {
        ...DECLARATION,
        derived: [{ name: '--esds-color-background-brand-a', value: 'var(--esds-color-other-a)' }],
      }),
    ).toBe(false);
  });

  it('returns true when neither declaration has derived declarations', () => {
    const leaf: CssVariableDeclaration = { name: '--esds-color-gray-500', value: '#888888' };

    expect(areCssVariableDeclarationValuesEqual(leaf, { ...leaf })).toBe(true);
  });
});
