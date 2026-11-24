import { describe, expect, it } from 'vitest';
import type { CssVariableDeclaration } from '../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import { buildBaseTokensCssFiles } from './build-base-tokens-css-files.ts';

const LEAF: CssVariableDeclaration = {
  name: '--esds-color-gray-500',
  value: '#888888',
};

const ALIAS: CssVariableDeclaration = {
  name: '--esds-color-background-base',
  value: 'var(--esds-color-gray-500)',
};

describe('buildBaseTokensCssFiles', () => {
  it('emits the leaves block then the aliases block in tokens.root.css', () => {
    const content: string = buildBaseTokensCssFiles([LEAF, ALIAS])['tokens.root.css'];

    expect(content).toContain('Do not edit directly, this file was auto-generated.');
    expect(content).toContain(':root,\n:host {\n  --esds-color-gray-500: #888888;\n}');
    expect(content).toContain(
      ':host,\n:where(*) {\n  --esds-color-background-base: var(--esds-color-gray-500);\n}',
    );
    expect(content.indexOf(':root,')).toBeLessThan(content.indexOf(':where(*)'));
  });

  it('reapplies aliases to descendants in tokens.attr.css', () => {
    const content: string = buildBaseTokensCssFiles([LEAF, ALIAS])['tokens.attr.css'];

    expect(content).toContain('[data-esds-tokens] {\n  --esds-color-gray-500: #888888;\n}');
    expect(content).toContain(
      '[data-esds-tokens],\n[data-esds-tokens] :where(*) {\n  --esds-color-background-base: var(--esds-color-gray-500);\n}',
    );
  });

  it('omits the leaves block when there is no leaf', () => {
    const content: string = buildBaseTokensCssFiles([ALIAS])['tokens.root.css'];

    expect(content).not.toContain(':root,');
    expect(content).toContain(':where(*) {');
  });

  it('omits the aliases block when there is no alias', () => {
    const content: string = buildBaseTokensCssFiles([LEAF])['tokens.root.css'];

    expect(content).toContain(':root,');
    expect(content).not.toContain(':where(*)');
  });
});
