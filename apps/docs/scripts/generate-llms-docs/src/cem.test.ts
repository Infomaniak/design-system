import { describe, expect, it } from 'vitest';
import {
  escapeTableCell,
  findElementByTagName,
  parseCem,
  renderApiSection,
  renderPropTable,
  toPropRow,
} from './cem.ts';

const CEM = JSON.stringify({
  modules: [
    {
      path: 'src/components/esds-separator/esds-separator.component.ts',
      declarations: [
        {
          name: 'EsdsSeparatorComponent',
          tagName: 'esds-separator',
          customElement: true,
          attributes: [
            {
              name: 'orientation',
              type: { text: 'EsdsSeparatorComponentOrientation' },
              default: "'horizontal'",
              description: 'Orientation of the separator.',
            },
            { name: 'decorative', type: { text: 'boolean' }, default: 'false' },
          ],
        },
      ],
    },
    {
      path: 'src/components/esds-icon/esds-icon.component.ts',
      declarations: [
        {
          name: 'EsdsIconComponent',
          tagName: 'esds-icon',
          customElement: true,
          attributes: [{ name: 'name', type: { text: 'string' } }],
          events: [
            { name: 'loaded', type: { text: 'CustomEvent' }, description: 'Fired when rendered.' },
          ],
          slots: [{ name: '', description: 'Default slot.' }],
          cssProperties: [
            { name: '--icon-size', type: { text: 'string' }, description: 'Icon size.' },
          ],
          cssParts: [{ name: 'icon', description: 'The icon element.' }],
        },
      ],
    },
  ],
});

describe('parseCem', () => {
  it('parses the raw manifest json', () => {
    const cem = parseCem(CEM);
    expect(cem.modules).toHaveLength(2);
  });
});

describe('findElementByTagName', () => {
  it('maps cem attributes into prop rows', () => {
    const docs = findElementByTagName(parseCem(CEM), 'esds-separator');
    expect(docs).toEqual({
      tagName: 'esds-separator',
      className: 'EsdsSeparatorComponent',
      attributes: [
        {
          name: 'orientation',
          type: 'EsdsSeparatorComponentOrientation',
          default: "'horizontal'",
          required: false,
          description: 'Orientation of the separator.',
        },
        {
          name: 'decorative',
          type: 'boolean',
          default: 'false',
          required: false,
          description: undefined,
        },
      ],
      events: [],
      slots: [],
      cssProperties: [],
      cssParts: [],
    });
  });

  it('returns null for an unknown tag name', () => {
    expect(findElementByTagName(parseCem(CEM), 'esds-nobody')).toBeNull();
  });

  it('maps events, slots, css properties and css parts', () => {
    const docs = findElementByTagName(parseCem(CEM), 'esds-icon');
    expect(docs?.events).toEqual([
      { name: 'loaded', type: 'CustomEvent', required: false, description: 'Fired when rendered.' },
    ]);
    expect(docs?.slots).toEqual([{ name: '', required: false, description: 'Default slot.' }]);
    expect(docs?.cssProperties).toEqual([
      { name: '--icon-size', type: 'string', required: false, description: 'Icon size.' },
    ]);
    expect(docs?.cssParts).toEqual([
      { name: 'icon', required: false, description: 'The icon element.' },
    ]);
  });
});

describe('toPropRow', () => {
  it('marks optional === false as required', () => {
    expect(toPropRow({ name: 'value', type: { text: 'string' }, optional: false })).toEqual({
      name: 'value',
      type: 'string',
      default: undefined,
      required: true,
      description: undefined,
    });
  });
});

describe('escapeTableCell', () => {
  it('escapes pipes and collapses whitespace', () => {
    expect(escapeTableCell("'a' | 'b'\nsecond  line")).toBe("'a' \\| 'b' second line");
  });
});

describe('renderPropTable', () => {
  it('renders missing cells as em dashes', () => {
    expect(renderPropTable([{ name: 'name', type: undefined, required: false }])).toBe(
      [
        '| Name | Type | Default | Required | Description |',
        '| :--- | :--- | :--- | :--- | :--- |',
        '| name | — | — | No | — |',
      ].join('\n'),
    );
  });

  it('returns an empty string for no rows', () => {
    expect(renderPropTable([])).toBe('');
  });
});

describe('renderApiSection', () => {
  it('omits empty subsections and returns empty when all are empty', () => {
    const docs = findElementByTagName(parseCem(CEM), 'esds-separator');
    const section = renderApiSection(docs!);
    expect(section).toContain('### Attributes');
    expect(section).not.toContain('### Events');
    expect(renderApiSection({ ...docs!, attributes: [] })).toBe('');
  });
});
