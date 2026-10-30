import { describe, expect, it } from 'vitest';
import {
  collectCustomAttributeClassNames,
  collectCustomAttributeTagNames,
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
    {
      path: 'src/components/esds-button/esds-button.attr.ts',
      declarations: [
        {
          name: 'EsdsButtonAttr',
          tagName: 'esds-button',
          customElement: true,
          superclass: { name: 'CustomAttribute', module: '/src/helpers/custom-attribute.ts' },
          attributes: [{ name: 'disabled' }, { name: 'loading' }],
        },
      ],
    },
  ],
});

describe('parseCem', () => {
  it('parses the raw manifest json', () => {
    const cem = parseCem(CEM);
    expect(cem.modules).toHaveLength(3);
  });
});

describe('findElementByTagName', () => {
  it('maps cem attributes into prop rows', () => {
    const docs = findElementByTagName(parseCem(CEM), 'esds-separator');
    expect(docs).toEqual({
      tagName: 'esds-separator',
      className: 'EsdsSeparatorComponent',
      kind: 'element',
      attributeName: 'esds-separator',
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

  it('detects custom attributes from the superclass and keeps the attribute name', () => {
    const docs = findElementByTagName(parseCem(CEM), 'esds-button');
    expect(docs).toMatchObject({
      tagName: 'esds-button',
      className: 'EsdsButtonAttr',
      kind: 'attribute',
      attributeName: 'esds-button',
    });
    expect(docs?.attributes.map((attribute) => attribute.name)).toEqual(['disabled', 'loading']);
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

describe('collectCustomAttributeClassNames', () => {
  it('collects class names of custom attribute declarations', () => {
    const classNames = collectCustomAttributeClassNames(parseCem(CEM));
    expect([...classNames]).toEqual(['EsdsButtonAttr']);
  });

  it('detects attributes from a superclass module hint', () => {
    const cem = parseCem(
      JSON.stringify({
        modules: [
          {
            declarations: [
              {
                name: 'EsdsSomethingAttr',
                tagName: 'esds-something',
                customElement: true,
                superclass: {
                  name: 'EsdsBaseAttr',
                  module: '/src/helpers/custom-attribute/base.ts',
                },
              },
            ],
          },
        ],
      }),
    );
    expect([...collectCustomAttributeClassNames(cem)]).toEqual(['EsdsSomethingAttr']);
  });

  it('detects attributes from an explicit customAttribute marker', () => {
    const cem = parseCem(
      JSON.stringify({
        modules: [
          {
            declarations: [
              {
                name: 'EsdsMarkedAttr',
                tagName: 'esds-marked',
                customElement: true,
                customAttribute: true,
              },
            ],
          },
        ],
      }),
    );
    expect([...collectCustomAttributeClassNames(cem)]).toEqual(['EsdsMarkedAttr']);
  });

  it('detects attributes transitively regardless of declaration order', () => {
    const cem = parseCem(
      JSON.stringify({
        modules: [
          {
            declarations: [
              {
                name: 'EsdsChildAttr',
                tagName: 'esds-child',
                customElement: true,
                superclass: { name: 'EsdsBaseAttr' },
              },
              {
                name: 'EsdsBaseAttr',
                customElement: true,
                superclass: { name: 'CustomAttribute', module: '/src/helpers/custom-attribute.ts' },
              },
            ],
          },
        ],
      }),
    );
    expect([...collectCustomAttributeClassNames(cem)]).toEqual(['EsdsBaseAttr', 'EsdsChildAttr']);
  });

  it('returns an empty set for a manifest of plain elements', () => {
    const cem = parseCem(
      JSON.stringify({
        modules: [
          {
            declarations: [
              {
                name: 'EsdsSeparatorComponent',
                tagName: 'esds-separator',
                customElement: true,
                superclass: { name: 'LitElement', package: 'lit' },
              },
            ],
          },
        ],
      }),
    );
    expect(collectCustomAttributeClassNames(cem).size).toBe(0);
  });
});

describe('collectCustomAttributeTagNames', () => {
  it('collects tag names of custom attribute declarations', () => {
    expect([...collectCustomAttributeTagNames(parseCem(CEM))]).toEqual(['esds-button']);
  });

  it('skips attribute classes without a tag name', () => {
    const cem = parseCem(
      JSON.stringify({
        modules: [
          {
            declarations: [
              {
                name: 'EsdsBaseAttr',
                superclass: { name: 'CustomAttribute', module: '/src/helpers/custom-attribute.ts' },
              },
              {
                name: 'EsdsButtonAttr',
                tagName: 'esds-button',
                customElement: true,
                superclass: { name: 'EsdsBaseAttr' },
              },
            ],
          },
        ],
      }),
    );
    expect([...collectCustomAttributeTagNames(cem)]).toEqual(['esds-button']);
  });
});
