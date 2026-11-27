import { describe, expect, it } from 'vitest';
import type { CssVariableDeclaration } from '../../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import { buildModifierContextCssFiles } from './build-modifier-context-css-files.ts';

const BASE: CssVariableDeclaration[] = [
  { name: '--esds-color-gray-500', value: '#888888' },
  { name: '--esds-color-background-brand-infomaniak', value: 'var(--esds-color-blue-600)' },
  { name: '--esds-color-background-brand-mail', value: 'var(--esds-color-pink-600)' },
  {
    name: '--esds-color-background-brand',
    value: 'var(--esds-color-background-brand-infomaniak)',
    derived: [
      {
        name: '--esds-color-background-brand-a',
        value: 'var(--esds-color-background-brand-infomaniak-a)',
      },
    ],
  },
  { name: '--esds-button-background-color', value: 'var(--esds-color-background-brand)' },
];

const MAIL: CssVariableDeclaration[] = [
  { name: '--esds-color-gray-500', value: '#777777' },
  { name: '--esds-color-background-brand-infomaniak', value: 'var(--esds-color-blue-600)' },
  { name: '--esds-color-background-brand-mail', value: 'var(--esds-color-pink-600)' },
  {
    name: '--esds-color-background-brand',
    value: 'var(--esds-color-background-brand-mail)',
    derived: [
      {
        name: '--esds-color-background-brand-a',
        value: 'var(--esds-color-background-brand-mail-a)',
      },
    ],
  },
  { name: '--esds-button-background-color', value: 'var(--esds-color-background-brand)' },
];

function build(): { readonly root: string; readonly attr: string } {
  return buildModifierContextCssFiles({
    modifier: 'product',
    context: 'mail',
    declarations: MAIL,
    baseDeclarations: BASE,
  });
}

describe('buildModifierContextCssFiles', () => {
  it('keeps only declarations differing from the base', () => {
    const { attr } = build();

    expect(attr).toContain(
      '--esds-color-background-brand: var(--esds-color-background-brand-mail);',
    );
    expect(attr).toContain(
      '--esds-color-background-brand-a: var(--esds-color-background-brand-mail-a);',
    );
    expect(attr).toContain('--esds-color-gray-500: #777777;');
    expect(attr).not.toContain('--esds-color-background-brand-mail:');
    expect(attr).not.toContain('--esds-color-background-brand-infomaniak:');
    expect(attr).not.toContain('--esds-button-background-color:');
    expect(attr).not.toContain('REDECLARED');
  });

  it('reapplies overridden aliases to descendants in the attr variant', () => {
    const { attr } = build();

    expect(attr).toContain('[data-esds-product="mail"],\n[data-esds-product="mail"] :where(*) {');
    expect(attr).toContain(
      '  --esds-color-background-brand: var(--esds-color-background-brand-mail);\n  --esds-color-background-brand-a: var(--esds-color-background-brand-mail-a);',
    );
  });

  it('emits overridden leaves in the simple selector block of the attr variant', () => {
    const { attr } = build();

    expect(attr).toContain('[data-esds-product="mail"] {\n  --esds-color-gray-500: #777777;\n}');
    expect(attr.indexOf('--esds-color-gray-500')).toBeLessThan(attr.indexOf(':where(*)'));
    expect(attr.indexOf('--esds-color-gray-500')).toBeLessThan(
      attr.indexOf('--esds-color-background-brand:'),
    );
  });

  it('emits the root variant with per-element alias resolution', () => {
    const { root } = build();

    expect(root).toContain(':root,\n:host {\n  --esds-color-gray-500: #777777;\n}');
    expect(root).toContain(':host,\n:where(*) {');
    expect(root).toContain(
      '  --esds-color-background-brand: var(--esds-color-background-brand-mail);\n  --esds-color-background-brand-a: var(--esds-color-background-brand-mail-a);',
    );
  });

  it('emits a header-only file when nothing differs from the base', () => {
    const files = buildModifierContextCssFiles({
      modifier: 'product',
      context: 'infomaniak',
      declarations: BASE,
      baseDeclarations: BASE,
    });

    expect(files.attr).toContain('Do not edit directly, this file was auto-generated.');
    expect(files.attr).not.toContain('--esds-');
    expect(files.root).not.toContain('--esds-');
  });

  it('includes context-only declarations absent from the base', () => {
    const { attr } = buildModifierContextCssFiles({
      modifier: 'product',
      context: 'mail',
      declarations: [
        ...MAIL,
        { name: '--esds-color-context-only', value: 'var(--esds-color-pink-600)' },
      ],
      baseDeclarations: BASE,
    });

    expect(attr).toContain('--esds-color-context-only: var(--esds-color-pink-600);');
  });

  it('ignores description-only differences from the base', () => {
    const { attr } = buildModifierContextCssFiles({
      modifier: 'product',
      context: 'mail',
      declarations: [...MAIL, { ...MAIL[1]!, description: 'A different comment, same value.' }],
      baseDeclarations: BASE,
    });

    expect(attr).not.toContain('--esds-color-background-brand-infomaniak:');
  });
});
