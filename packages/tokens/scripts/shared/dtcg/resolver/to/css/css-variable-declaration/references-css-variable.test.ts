import { describe, expect, it } from 'vitest';
import type { CssVariableDeclaration } from './css-variable-declaration.ts';
import {
  cssVariableDeclarationReferencesCssVariable,
  partitionCssVariableDeclarations,
} from './references-css-variable.ts';

const LEAF: CssVariableDeclaration = {
  name: '--esds-color-gray-500',
  value: '#888888',
};

const ALIAS: CssVariableDeclaration = {
  name: '--esds-color-background-base',
  value: 'var(--esds-color-gray-500)',
};

const RELATIVE_COLOR_ALIAS: CssVariableDeclaration = {
  name: '--esds-color-background-backdrop',
  value: 'rgb(from var(--esds-color-black) r g b / 0.5)',
};

const DERIVED_ALIAS: CssVariableDeclaration = {
  name: '--esds-color-shadow',
  value: '#888888',
  derived: [{ name: '--esds-color-shadow-a', value: 'var(--esds-color-gray-500-a)' }],
};

describe('cssVariableDeclarationReferencesCssVariable', () => {
  it('returns false for a literal value', () => {
    expect(cssVariableDeclarationReferencesCssVariable(LEAF)).toBe(false);
  });

  it('returns true for a var() reference', () => {
    expect(cssVariableDeclarationReferencesCssVariable(ALIAS)).toBe(true);
  });

  it('returns true for relative color syntax containing var()', () => {
    expect(cssVariableDeclarationReferencesCssVariable(RELATIVE_COLOR_ALIAS)).toBe(true);
  });

  it('returns true when a derived declaration references a variable', () => {
    expect(cssVariableDeclarationReferencesCssVariable(DERIVED_ALIAS)).toBe(true);
  });
});

describe('partitionCssVariableDeclarations', () => {
  it('splits leaves and aliases preserving order', () => {
    const { leaves, aliases } = partitionCssVariableDeclarations([
      ALIAS,
      LEAF,
      RELATIVE_COLOR_ALIAS,
    ]);

    expect(leaves).toEqual([LEAF]);
    expect(aliases).toEqual([ALIAS, RELATIVE_COLOR_ALIAS]);
  });

  it('puts derived-referencing declarations in the aliases bucket', () => {
    const { leaves, aliases } = partitionCssVariableDeclarations([LEAF, DERIVED_ALIAS]);

    expect(leaves).toEqual([LEAF]);
    expect(aliases).toEqual([DERIVED_ALIAS]);
  });
});
