import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  escapeTableCell,
  findElementByModulePath,
  findElementByTagName,
  parseCem,
  renderApiSection,
  renderPropTable,
  toPropRow,
  type CemAttribute,
} from './cem.ts';
import type { CemElementDocs, PropRow } from './types.ts';

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(TESTS_DIR, '__fixtures__');
const REAL_CEM_PATH = join(TESTS_DIR, '../../../../../packages/components/custom-elements.json');

function loadFixtureCem(): ReturnType<typeof parseCem> {
  return parseCem(readFileSync(`${FIXTURES_DIR}/cem-fixture.json`, 'utf8'));
}

function expectNull(value: unknown): asserts value is null {
  expect(value).toBeNull();
}

describe('parseCem', () => {
  it('parses a valid manifest with schemaVersion and modules', () => {
    const cem = loadFixtureCem();
    expect(cem.schemaVersion).toBe('1.0.0');
    expect(cem.modules).toHaveLength(8);
    expect(cem.modules?.[0]?.path).toBe('src/components/esds-card/esds-card.component.ts');
  });

  it('treats a manifest without schemaVersion or modules as empty', () => {
    expect(parseCem('{}')).toEqual({ schemaVersion: undefined, modules: [] });
  });

  it('treats non-object JSON as an empty manifest', () => {
    expect(parseCem('null')).toEqual({ schemaVersion: undefined, modules: [] });
    expect(parseCem('42')).toEqual({ schemaVersion: undefined, modules: [] });
  });

  it('throws on invalid JSON from fixture file', () => {
    const raw = readFileSync(`${FIXTURES_DIR}/cem-invalid.txt`, 'utf8');
    expect(() => parseCem(raw)).toThrow('Invalid custom elements manifest');
  });

  it('throws on invalid inline JSON', () => {
    expect(() => parseCem('{oops')).toThrow('Invalid custom elements manifest');
  });
});

describe('toPropRow', () => {
  it('maps a fully documented attribute', () => {
    const attr: CemAttribute = {
      name: 'label',
      type: { text: 'string' },
      default: "'Card'",
      description: 'Accessible label of the card.',
    };
    expect(toPropRow(attr)).toEqual({
      name: 'label',
      type: 'string',
      default: "'Card'",
      required: false,
      description: 'Accessible label of the card.',
    });
  });

  it('marks attribute as required when optional is false and leaves missing fields undefined', () => {
    const attr: CemAttribute = { name: 'disabled', optional: false };
    expect(toPropRow(attr)).toEqual({
      name: 'disabled',
      type: undefined,
      default: undefined,
      required: true,
      description: undefined,
    });
  });
});

describe('findElementByTagName', () => {
  it('maps attributes, events, slots, cssProperties and cssParts of a custom element', () => {
    const docs = findElementByTagName(loadFixtureCem(), 'esds-card');
    expect(docs?.tagName).toBe('esds-card');
    expect(docs?.properties).toEqual([]);
    expect(docs?.attributes).toEqual([
      {
        name: 'label',
        type: 'string',
        default: "'Card'",
        required: false,
        description: 'Accessible label of the card.',
      },
      { name: 'disabled', type: undefined, required: true, description: 'Disables the card.' },
    ]);
    expect(docs?.events).toEqual([
      {
        name: 'card-select',
        type: 'CustomEvent<EsdsCardSelectDetail>',
        required: false,
        description: 'Fired when the card is selected.',
      },
      {
        name: 'card-blur',
        type: undefined,
        required: false,
        description: 'Fired when the card loses focus.',
      },
    ]);
    expect(docs?.slots).toEqual([
      { name: '', required: false, description: 'Default content of the card.' },
      { name: 'footer', required: false, description: 'Footer content of the card.' },
    ]);
    expect(docs?.cssProperties).toEqual([
      {
        name: '--esds-card-elevation',
        type: 'box-shadow',
        required: false,
        description: 'Elevation shadow of the card.',
      },
      {
        name: '--esds-card-padding',
        type: undefined,
        required: false,
        description: 'Padding of the card.',
      },
    ]);
    expect(docs?.cssParts).toEqual([
      { name: 'card-container', required: false, description: 'The card container element.' },
    ]);
  });

  it('returns empty arrays for a custom element without any documented arrays', () => {
    const docs = findElementByTagName(loadFixtureCem(), 'duplicate-a');
    expect(docs).toEqual({
      tagName: 'duplicate-a',
      className: 'DuplicateA',
      attributes: [],
      properties: [],
      events: [],
      slots: [],
      cssProperties: [],
      cssParts: [],
    });
  });

  it('returns null for an unknown tag name', () => {
    expectNull(findElementByTagName(loadFixtureCem(), 'esds-nobody'));
  });

  it('returns null when the manifest has no modules', () => {
    expectNull(findElementByTagName({}, 'esds-card'));
  });
});

describe('findElementByModulePath', () => {
  it('matches a module by exact full path', () => {
    expect(
      findElementByModulePath(loadFixtureCem(), 'src/components/esds-card/esds-card.component.ts')
        ?.tagName,
    ).toBe('esds-card');
  });

  it('matches a module by partial suffix path', () => {
    expect(
      findElementByModulePath(loadFixtureCem(), 'components/esds-card/esds-card.component.ts')
        ?.tagName,
    ).toBe('esds-card');
  });

  it('matches a stories file path to the component module via suffix', () => {
    const docs = findElementByModulePath(
      loadFixtureCem(),
      'src/components/esds-separator/esds-separator.component.stories.ts',
    );
    expect(docs?.tagName).toBe('esds-separator');
    expect(docs?.attributes.map((row) => row.name)).toEqual(['orientation', 'decorative']);
  });

  it('matches a bare stories file basename to the component module', () => {
    expect(
      findElementByModulePath(loadFixtureCem(), 'esds-separator.component.stories.ts')?.tagName,
    ).toBe('esds-separator');
  });

  it('prefers the longest common suffix among same-basename modules', () => {
    expect(findElementByModulePath(loadFixtureCem(), 'src/a/duplicate.component.ts')?.tagName).toBe(
      'duplicate-a',
    );
  });

  it('returns null when several modules share the same basename', () => {
    expectNull(findElementByModulePath(loadFixtureCem(), 'duplicate.component.ts'));
  });

  it('returns null when no module matches', () => {
    expectNull(findElementByModulePath(loadFixtureCem(), 'missing/missing.component.ts'));
  });

  it('returns null when the matched module declares no custom element', () => {
    expectNull(findElementByModulePath(loadFixtureCem(), 'src/utils/helpers.ts'));
  });

  it('returns null when the matched module has no declarations', () => {
    expectNull(findElementByModulePath(loadFixtureCem(), 'src/empty/empty.component.ts'));
  });

  it('returns an empty tag name for a custom element without tagName', () => {
    const docs = findElementByModulePath(
      loadFixtureCem(),
      'src/components/esds-anon/esds-anon.component.ts',
    );
    expect(docs?.tagName).toBe('');
    expect(docs?.attributes).toEqual([]);
  });

  it('returns null when the manifest has no modules', () => {
    expectNull(findElementByModulePath({}, 'esds-card.component.ts'));
  });
});

describe('escapeTableCell', () => {
  it('escapes pipes', () => {
    expect(escapeTableCell('a|b')).toBe('a\\|b');
  });

  it('replaces newlines and carriage returns with a single space', () => {
    expect(escapeTableCell('a\nb')).toBe('a b');
    expect(escapeTableCell('a\r\nb')).toBe('a b');
    expect(escapeTableCell('a\rb')).toBe('a b');
  });

  it('trims and collapses internal whitespace runs', () => {
    expect(escapeTableCell('  a \t b   c  ')).toBe('a b c');
  });
});

describe('renderPropTable', () => {
  it('returns an empty string for no rows', () => {
    expect(renderPropTable([])).toBe('');
  });

  it('renders a CommonMark table with missing cells as em dashes', () => {
    const rows: PropRow[] = [
      {
        name: 'label',
        type: 'string',
        default: "'Card'",
        required: false,
        description: 'Accessible label of the card.',
      },
      { name: 'disabled', required: true },
    ];
    expect(renderPropTable(rows)).toBe(
      [
        '| Name | Type | Default | Required | Description |',
        '| :--- | :--- | :--- | :--- | :--- |',
        "| label | string | 'Card' | No | Accessible label of the card. |",
        '| disabled | — | — | Yes | — |',
      ].join('\n'),
    );
  });

  it('escapes every cell', () => {
    const rows: PropRow[] = [{ name: 'a|b', type: 'x\ny', required: false, description: ' p ' }];
    expect(renderPropTable(rows)).toBe(
      [
        '| Name | Type | Default | Required | Description |',
        '| :--- | :--- | :--- | :--- | :--- |',
        '| a\\|b | x y | — | No | p |',
      ].join('\n'),
    );
  });
});

describe('renderApiSection', () => {
  it('renders all subsections in order for a fully documented element', () => {
    const docs = findElementByTagName(loadFixtureCem(), 'esds-card') as CemElementDocs;
    expect(renderApiSection(docs)).toBe(
      [
        '## API',
        '',
        '### Attributes',
        '',
        '| Name | Type | Default | Required | Description |',
        '| :--- | :--- | :--- | :--- | :--- |',
        "| label | string | 'Card' | No | Accessible label of the card. |",
        '| disabled | — | — | Yes | Disables the card. |',
        '',
        '### Events',
        '',
        '| Name | Type | Default | Required | Description |',
        '| :--- | :--- | :--- | :--- | :--- |',
        '| card-select | CustomEvent<EsdsCardSelectDetail> | — | No | Fired when the card is selected. |',
        '| card-blur | — | — | No | Fired when the card loses focus. |',
        '',
        '### Slots',
        '',
        '| Name | Type | Default | Required | Description |',
        '| :--- | :--- | :--- | :--- | :--- |',
        '|  | — | — | No | Default content of the card. |',
        '| footer | — | — | No | Footer content of the card. |',
        '',
        '### CSS Custom Properties',
        '',
        '| Name | Type | Default | Required | Description |',
        '| :--- | :--- | :--- | :--- | :--- |',
        '| --esds-card-elevation | box-shadow | — | No | Elevation shadow of the card. |',
        '| --esds-card-padding | — | — | No | Padding of the card. |',
        '',
        '### CSS Parts',
        '',
        '| Name | Type | Default | Required | Description |',
        '| :--- | :--- | :--- | :--- | :--- |',
        '| card-container | — | — | No | The card container element. |',
      ].join('\n'),
    );
  });

  it('omits empty subsections for a partially documented element', () => {
    const docs = findElementByTagName(loadFixtureCem(), 'esds-badge') as CemElementDocs;
    const api = renderApiSection(docs);
    expect(api).toBe(
      [
        '## API',
        '',
        '### Attributes',
        '',
        '| Name | Type | Default | Required | Description |',
        '| :--- | :--- | :--- | :--- | :--- |',
        '| visible | boolean | — | No | — |',
      ].join('\n'),
    );
  });

  it('returns an empty string when every subsection is empty', () => {
    const docs = findElementByTagName(loadFixtureCem(), 'duplicate-b') as CemElementDocs;
    expect(renderApiSection(docs)).toBe('');
  });
});

describe('real CEM smoke test', () => {
  const cem = parseCem(readFileSync(REAL_CEM_PATH, 'utf8'));

  it('finds esds-icon with name and inline attributes', () => {
    const docs = findElementByTagName(cem, 'esds-icon');
    expect(docs?.tagName).toBe('esds-icon');
    expect(docs?.attributes.map((row) => row.name)).toEqual(['name', 'inline']);
    expect(docs?.attributes.map((row) => row.type)).toEqual(['string', 'boolean']);
  });

  it('finds esds-separator with orientation and decorative attributes', () => {
    const docs = findElementByTagName(cem, 'esds-separator');
    expect(docs?.attributes.map((row) => row.name)).toEqual(['orientation', 'decorative']);
    expect(docs?.attributes.map((row) => row.type)).toEqual([
      'EsdsSeparatorComponentOrientation',
      'boolean',
    ]);
  });

  it('finds esds-separator from its stories file path', () => {
    const docs = findElementByModulePath(
      cem,
      'src/components/esds-separator/esds-separator.component.stories.ts',
    );
    expect(docs?.tagName).toBe('esds-separator');
  });

  it('renders only an Attributes subsection for esds-separator', () => {
    const docs = findElementByTagName(cem, 'esds-separator') as CemElementDocs;
    const api = renderApiSection(docs);
    expect(api.startsWith('## API\n\n### Attributes')).toBe(true);
    expect(api).toContain('| orientation | EsdsSeparatorComponentOrientation |');
    expect(api).toContain('| decorative | boolean |');
    expect(api).not.toContain('### Events');
    expect(api).not.toContain('### Slots');
    expect(api).not.toContain('### CSS Custom Properties');
    expect(api).not.toContain('### CSS Parts');
  });
});
