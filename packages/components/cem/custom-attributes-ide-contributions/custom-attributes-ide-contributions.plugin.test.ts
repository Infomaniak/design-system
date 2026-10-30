import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  buildAttributeDescription,
  collectCustomAttributeTagNames,
  customAttributesIdePlugin,
  moveVsCodeTagsToGlobalAttributes,
  moveWebTypesElementsToAttributes,
  type VsCodeCustomDataDocument,
  type WebTypesDocument,
} from './custom-attributes-ide-contributions.plugin.ts';

const WEB_TYPES_DOCUMENT: WebTypesDocument = {
  contributions: {
    html: {
      elements: [
        {
          name: 'esds-button',
          description: 'Button attribute\n\n---\n',
          attributes: [
            { name: 'disabled', description: 'Disables the button' },
            { name: 'loading', description: 'Displays a loading state on the button' },
          ],
          events: [],
          js: { properties: [], events: [] },
        },
        {
          name: 'esds-heading',
          description:
            'Heading attribute\n\n---\n\n\n### **CSS Properties:**\n - **--margin** - margin',
        },
        { name: 'esds-icon', description: 'Icon component\n\n---\n' },
      ],
    },
  },
};

const VS_CODE_DOCUMENT: VsCodeCustomDataDocument = {
  version: '1.1',
  tags: [
    {
      name: 'esds-button',
      description: 'Button attribute\n---\n',
      attributes: [{ name: 'disabled', description: 'Disables the button', values: [] }],
      references: [],
    },
    { name: 'esds-icon', description: 'Icon component\n---\n' },
  ],
};

const MANIFEST = {
  modules: [
    {
      declarations: [
        { tagName: 'esds-button', superclass: { name: 'CustomAttribute' } },
        { tagName: 'esds-icon', superclass: { name: 'LitElement' } },
      ],
    },
  ],
};

describe('collectCustomAttributeTagNames', () => {
  it('should collect the tag names of declarations extending CustomAttribute', () => {
    expect(collectCustomAttributeTagNames(MANIFEST)).toEqual(new Set(['esds-button']));
  });

  it('should collect tag names when the superclass module matches custom attributes', () => {
    const manifest = {
      modules: [
        {
          declarations: [
            {
              tagName: 'esds-body',
              superclass: {
                name: 'BaseAttr',
                module: '/src/helpers/custom-attribute/custom-attribute.ts',
              },
            },
          ],
        },
      ],
    };

    expect(collectCustomAttributeTagNames(manifest)).toEqual(new Set(['esds-body']));
  });

  it('should ignore declarations without tag name or with an unrelated superclass', () => {
    const manifest = {
      modules: [
        {
          declarations: [
            { superclass: { name: 'CustomAttribute' } },
            { tagName: 'esds-icon' },
            { tagName: 'esds-icon', superclass: { name: 'LitElement', module: 'lit' } },
          ],
        },
        {},
      ],
    };

    expect(collectCustomAttributeTagNames(manifest)).toEqual(new Set());
  });

  it('should return an empty set for an empty manifest', () => {
    expect(collectCustomAttributeTagNames({})).toEqual(new Set());
  });
});

describe('moveWebTypesElementsToAttributes', () => {
  it('should move matching elements to the html attributes contribution', () => {
    const document = structuredClone(WEB_TYPES_DOCUMENT);

    expect(moveWebTypesElementsToAttributes(document, new Set(['esds-button']))).toBe(true);
    expect(document.contributions?.html?.elements?.map((element) => element.name)).toEqual([
      'esds-heading',
      'esds-icon',
    ]);
    expect(document.contributions?.html?.attributes).toEqual([
      {
        name: 'esds-button',
        description:
          'Button attribute\n\n- **disabled** - Disables the button\n- **loading** - Displays a loading state on the button',
        value: { kind: 'no-value' },
      },
    ]);
  });

  it('should preserve existing attributes and auto-generated description sections', () => {
    const document = structuredClone(WEB_TYPES_DOCUMENT);
    document.contributions!.html!.attributes = [{ name: 'esds-body', value: { kind: 'no-value' } }];

    moveWebTypesElementsToAttributes(document, new Set(['esds-heading', 'esds-button']));

    expect(document.contributions?.html?.attributes).toEqual([
      { name: 'esds-body', value: { kind: 'no-value' } },
      { name: 'esds-button', value: { kind: 'no-value' }, description: expect.any(String) },
      {
        name: 'esds-heading',
        description:
          'Heading attribute\n\n---\n\n\n### **CSS Properties:**\n - **--margin** - margin',
        value: { kind: 'no-value' },
      },
    ]);
  });

  it('should return false when no element matches', () => {
    const document = structuredClone(WEB_TYPES_DOCUMENT);

    expect(moveWebTypesElementsToAttributes(document, new Set(['esds-kbd']))).toBe(false);
    expect(document).toEqual(WEB_TYPES_DOCUMENT);
  });

  it('should return false when the document has no elements', () => {
    expect(moveWebTypesElementsToAttributes({}, new Set(['esds-button']))).toBe(false);
  });
});

describe('moveVsCodeTagsToGlobalAttributes', () => {
  it('should move matching tags to the global attributes contribution', () => {
    const document = structuredClone(VS_CODE_DOCUMENT);

    expect(moveVsCodeTagsToGlobalAttributes(document, new Set(['esds-button']))).toBe(true);
    expect(document.tags?.map((tag) => tag.name)).toEqual(['esds-icon']);
    expect(document.globalAttributes).toEqual([
      {
        name: 'esds-button',
        description: 'Button attribute\n\n- **disabled** - Disables the button',
      },
    ]);
  });

  it('should return false when no tag matches', () => {
    const document = structuredClone(VS_CODE_DOCUMENT);

    expect(moveVsCodeTagsToGlobalAttributes(document, new Set(['esds-kbd']))).toBe(false);
    expect(document).toEqual(VS_CODE_DOCUMENT);
  });

  it('should return false when the document has no tags', () => {
    expect(moveVsCodeTagsToGlobalAttributes({}, new Set(['esds-button']))).toBe(false);
  });
});

describe('buildAttributeDescription', () => {
  it('should drop the trailing horizontal rule when no section follows it', () => {
    expect(buildAttributeDescription({ description: 'Kbd attribute\n\n---\n' })).toBe(
      'Kbd attribute',
    );
  });

  it('should keep the horizontal rule when an auto-generated section follows it', () => {
    expect(
      buildAttributeDescription({
        description: 'Body attribute\n\n---\n\n### **CSS Properties:**\n - **--m** - m',
      }),
    ).toBe('Body attribute\n\n---\n\n### **CSS Properties:**\n - **--m** - m');
  });

  it('should fold documented attributes into the description', () => {
    expect(
      buildAttributeDescription({
        description: 'Button attribute',
        attributes: [
          { name: 'disabled', description: 'Disables the button' },
          { name: 'loading', description: 'Displays a loading state on the button' },
          { description: 'Not documented' },
        ],
      }),
    ).toBe(
      'Button attribute\n\n- **disabled** - Disables the button\n- **loading** - Displays a loading state on the button',
    );
  });

  it('should handle missing description', () => {
    expect(buildAttributeDescription({ attributes: [{ name: 'disabled' }] })).toBe(
      '- **disabled**',
    );
    expect(buildAttributeDescription({})).toBe('');
  });
});

describe('customAttributesIdePlugin', () => {
  let outdir: string;

  beforeEach(() => {
    outdir = mkdtempSync(join(tmpdir(), 'custom-attributes-ide-contributions-'));
  });

  afterEach(() => {
    rmSync(outdir, { recursive: true, force: true });
  });

  it('should rewrite the generated IDE files', () => {
    const webTypesPath = join(outdir, 'web-types.json');
    const vsCodePath = join(outdir, 'vscode.html-custom-data.json');
    writeFileSync(webTypesPath, JSON.stringify(WEB_TYPES_DOCUMENT));
    writeFileSync(vsCodePath, JSON.stringify(VS_CODE_DOCUMENT));

    customAttributesIdePlugin({ outdir }).packageLinkPhase({
      customElementsManifest: MANIFEST,
    });

    const webTypes = JSON.parse(readFileSync(webTypesPath, 'utf8'));
    expect(
      webTypes.contributions.html.elements.map((element: { name: string }) => element.name),
    ).toEqual(['esds-heading', 'esds-icon']);
    expect(webTypes.contributions.html.attributes).toHaveLength(1);
    expect(webTypes.contributions.html.attributes[0].name).toBe('esds-button');

    const vsCode = JSON.parse(readFileSync(vsCodePath, 'utf8'));
    expect(vsCode.tags.map((tag: { name: string }) => tag.name)).toEqual(['esds-icon']);
    expect(vsCode.globalAttributes[0].name).toBe('esds-button');
  });

  it('should not rewrite the generated IDE files when the manifest has no custom attribute', () => {
    const webTypesPath = join(outdir, 'web-types.json');
    writeFileSync(webTypesPath, JSON.stringify(WEB_TYPES_DOCUMENT));

    customAttributesIdePlugin({ outdir }).packageLinkPhase({ customElementsManifest: {} });

    expect(readFileSync(webTypesPath, 'utf8')).toBe(JSON.stringify(WEB_TYPES_DOCUMENT));
  });

  it('should ignore missing IDE files', () => {
    expect(() =>
      customAttributesIdePlugin({ outdir }).packageLinkPhase({
        customElementsManifest: MANIFEST,
      }),
    ).not.toThrow();
  });
});
