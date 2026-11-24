import { describe, expect, it } from 'vitest';
import type { CssVariableDeclaration } from '../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import { buildBaseTokensCssFiles } from './build-base-tokens-css-files.ts';

const LEAF: CssVariableDeclaration = {
  name: '--esds-color-gray-500',
  value: '#888888',
};

const DYNAMIC_ALIAS: CssVariableDeclaration = {
  name: '--esds-color-background-base',
  value: 'var(--esds-color-gray-500)',
};

const STATIC_ALIAS: CssVariableDeclaration = {
  name: '--esds-radius-md',
  value: 'var(--esds-radius-6)',
};

describe('buildBaseTokensCssFiles', () => {
  it('emits leaves and static aliases on :root, dynamic aliases in :where(*)', () => {
    const content: string = buildBaseTokensCssFiles(
      [LEAF, STATIC_ALIAS, DYNAMIC_ALIAS],
      new Set([DYNAMIC_ALIAS.name]),
    )['tokens.root.css'];

    expect(content).toContain('Do not edit directly, this file was auto-generated.');
    expect(content).toContain(
      ':root,\n:host {\n  --esds-color-gray-500: #888888;\n  --esds-radius-md: var(--esds-radius-6);\n}',
    );
    expect(content).toContain(
      ':host,\n:where(*) {\n  --esds-color-background-base: var(--esds-color-gray-500);\n}',
    );
    expect(content.indexOf(':root,')).toBeLessThan(content.indexOf(':where(*)'));
  });

  it('reapplies only dynamic aliases to descendants in tokens.attr.css', () => {
    const content: string = buildBaseTokensCssFiles(
      [LEAF, STATIC_ALIAS, DYNAMIC_ALIAS],
      new Set([DYNAMIC_ALIAS.name]),
    )['tokens.attr.css'];

    expect(content).toContain(
      '[data-esds-tokens] {\n  --esds-color-gray-500: #888888;\n  --esds-radius-md: var(--esds-radius-6);\n}',
    );
    expect(content).toContain(
      '[data-esds-tokens],\n[data-esds-tokens] :where(*) {\n  --esds-color-background-base: var(--esds-color-gray-500);\n}',
    );
  });

  it('emits every alias in the :where(*) block when all are dynamic', () => {
    const content: string = buildBaseTokensCssFiles(
      [LEAF, DYNAMIC_ALIAS],
      new Set([DYNAMIC_ALIAS.name]),
    )['tokens.root.css'];

    expect(content).toContain(':root,\n:host {\n  --esds-color-gray-500: #888888;\n}');
    expect(content).toContain(
      ':host,\n:where(*) {\n  --esds-color-background-base: var(--esds-color-gray-500);\n}',
    );
  });

  it('emits a header-only dynamic block when no alias is dynamic', () => {
    const content: string = buildBaseTokensCssFiles([LEAF, STATIC_ALIAS], new Set())[
      'tokens.root.css'
    ];

    expect(content).toContain(
      ':root,\n:host {\n  --esds-color-gray-500: #888888;\n  --esds-radius-md: var(--esds-radius-6);\n}',
    );
    expect(content).not.toContain(':where(*)');
  });
});
