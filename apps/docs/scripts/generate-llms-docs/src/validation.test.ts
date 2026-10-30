import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { collectCustomAttributeTagNames, findElementByTagName, parseCem } from './cem.ts';
import { buildStoryExamples } from './page-renderer.ts';
import type { PageModel, StorySnippet } from './types.ts';
import {
  collectGeneratedPageIssues,
  formatGeneratedPageIssues,
  validateGeneratedPages,
} from './validation.ts';

const currentDir = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(currentDir, '..', '..', '..', '..', '..');
const componentsDir = join(repositoryRoot, 'packages/components/src/components');

const ATTRIBUTE_TAG_NAMES = new Set([
  'esds-body',
  'esds-button',
  'esds-heading',
  'esds-kbd',
  'esds-text-link',
]);

function page(overrides: Partial<PageModel> = {}): PageModel {
  return {
    title: 'Components/Button',
    category: 'Components',
    slugParts: ['components', 'button'],
    outputPath: 'llms/components/button.md',
    summary: '',
    prose: '',
    importSection: '',
    props: '',
    examples: [],
    componentKind: 'attribute',
    componentTagName: 'esds-button',
    componentAttributeNames: ['disabled', 'loading'],
    ...overrides,
  };
}

function snippet(name: string, code: string, description?: string): StorySnippet {
  return { name, code, description };
}

describe('collectGeneratedPageIssues', () => {
  it('returns no issue for pages without examples', () => {
    const issues = collectGeneratedPageIssues({
      pages: [page(), page({ componentKind: null, componentTagName: null })],
      attributeTagNames: ATTRIBUTE_TAG_NAMES,
    });
    expect(issues).toEqual([]);
  });

  it('flags a custom attribute used as an element tag', () => {
    const issues = collectGeneratedPageIssues({
      pages: [
        page({
          examples: [snippet('Button', '<esds-button content="x"></esds-button>')],
        }),
        page({
          title: 'Components/Kbd',
          examples: [snippet('Default', '<p>Press <kbd esds-kbd>K</kbd></p>')],
        }),
      ],
      attributeTagNames: ATTRIBUTE_TAG_NAMES,
    });
    expect(issues).toEqual([
      {
        page: 'Components/Button',
        story: 'Button',
        message: 'uses the custom attribute "esds-button" as an element tag',
      },
    ]);
  });

  it('flags a camelCase attribute that is not a CEM attribute on element pages', () => {
    const issues = collectGeneratedPageIssues({
      pages: [
        page({
          title: 'Components/Badge',
          componentKind: 'element',
          componentTagName: 'esds-badge',
          componentAttributeNames: [],
          examples: [snippet('Default', '<esds-badge badgeType="primary">3</esds-badge>')],
        }),
      ],
      attributeTagNames: ATTRIBUTE_TAG_NAMES,
    });
    expect(issues).toEqual([
      {
        page: 'Components/Badge',
        story: 'Default',
        message: 'attribute "badgeType" is not a CEM attribute of esds-badge',
      },
    ]);
  });

  it('allows CEM attributes and skips the camelCase check on non-element pages', () => {
    const issues = collectGeneratedPageIssues({
      pages: [
        page({
          title: 'Components/Icon',
          componentKind: 'element',
          componentTagName: 'esds-icon',
          componentAttributeNames: ['name', 'viewBox'],
          examples: [snippet('Default', '<esds-icon name="x" viewBox="0 0 8 8"></esds-icon>')],
        }),
        page({
          examples: [snippet('Types', '<button formMethod="post" esds-button></button>')],
        }),
      ],
      attributeTagNames: ATTRIBUTE_TAG_NAMES,
    });
    expect(issues).toEqual([]);
  });
});

describe('formatGeneratedPageIssues', () => {
  it('formats one line per issue', () => {
    expect(
      formatGeneratedPageIssues([
        { page: 'A', story: 'S', message: 'first' },
        { page: 'B', story: 'T', message: 'second' },
      ]),
    ).toBe('- A / S: first\n- B / T: second');
  });
});

describe('validateGeneratedPages', () => {
  it('passes for valid pages', () => {
    expect(() =>
      validateGeneratedPages({
        pages: [
          page({
            examples: [snippet('Button', '<button esds-button disabled></button>')],
          }),
        ],
        attributeTagNames: ATTRIBUTE_TAG_NAMES,
      }),
    ).not.toThrow();
  });

  it('throws with the formatted issue list', () => {
    expect(() =>
      validateGeneratedPages({
        pages: [page({ examples: [snippet('Button', '<esds-button></esds-button>')] })],
        attributeTagNames: ATTRIBUTE_TAG_NAMES,
      }),
    ).toThrow(
      'Invalid generated page snippets:\n- Components/Button / Button: uses the custom attribute "esds-button" as an element tag',
    );
  });
});

describe('real component stories pass the guardrail', () => {
  /**
   * Minimal CEM fixture mirroring the generated manifest for the 8 components
   * (see `packages/components/custom-elements.json`).
   */
  const REAL_CEM = parseCem(
    JSON.stringify({
      modules: [
        {
          path: 'src/components/esds-badge/esds-badge.component.ts',
          declarations: [
            {
              name: 'EsdsBadgeComponent',
              tagName: 'esds-badge',
              customElement: true,
              superclass: { name: 'LitElement', package: 'lit' },
              slots: [{ name: '' }],
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
        {
          path: 'src/components/esds-body/esds-body.attr.ts',
          declarations: [
            {
              name: 'EsdsBodyAttr',
              tagName: 'esds-body',
              customElement: true,
              superclass: { name: 'CustomAttribute', module: '/src/helpers/custom-attribute.ts' },
            },
          ],
        },
        {
          path: 'src/components/esds-heading/esds-heading.attr.ts',
          declarations: [
            {
              name: 'EsdsHeadingAttr',
              tagName: 'esds-heading',
              customElement: true,
              superclass: { name: 'CustomAttribute', module: '/src/helpers/custom-attribute.ts' },
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
              superclass: { name: 'LitElement', package: 'lit' },
              attributes: [
                { name: 'name', type: { text: 'string' } },
                { name: 'inline', default: 'false' },
              ],
            },
          ],
        },
        {
          path: 'src/components/esds-kbd/esds-kbd.attr.ts',
          declarations: [
            {
              name: 'EsdsKbdAttr',
              tagName: 'esds-kbd',
              customElement: true,
              superclass: { name: 'CustomAttribute', module: '/src/helpers/custom-attribute.ts' },
            },
          ],
        },
        {
          path: 'src/components/esds-separator/esds-separator.component.ts',
          declarations: [
            {
              name: 'EsdsSeparatorComponent',
              tagName: 'esds-separator',
              customElement: true,
              superclass: { name: 'LitElement', package: 'lit' },
              attributes: [
                { name: 'orientation', default: "'horizontal'" },
                { name: 'decorative', default: 'false' },
              ],
            },
          ],
        },
        {
          path: 'src/components/esds-text-link/esds-text-link.attr.ts',
          declarations: [
            {
              name: 'EsdsTextLinkAttr',
              tagName: 'esds-text-link',
              customElement: true,
              superclass: { name: 'CustomAttribute', module: '/src/helpers/custom-attribute.ts' },
            },
          ],
        },
      ],
    }),
  );

  const REAL_CASES = [
    {
      file: 'esds-badge/esds-badge.component.stories.ts',
      tagName: 'esds-badge',
      title: 'Components/Badge',
    },
    { file: 'esds-body/esds-body.attr.stories.ts', tagName: 'esds-body', title: 'Components/Body' },
    {
      file: 'esds-button/esds-button.attr.stories.ts',
      tagName: 'esds-button',
      title: 'Components/Button',
    },
    {
      file: 'esds-heading/esds-heading.attr.stories.ts',
      tagName: 'esds-heading',
      title: 'Components/Heading',
    },
    {
      file: 'esds-icon/esds-icon.component.stories.ts',
      tagName: 'esds-icon',
      title: 'Components/Icon',
    },
    { file: 'esds-kbd/esds-kbd.attr.stories.ts', tagName: 'esds-kbd', title: 'Components/Kbd' },
    {
      file: 'esds-separator/esds-separator.component.stories.ts',
      tagName: 'esds-separator',
      title: 'Components/Separator',
    },
    {
      file: 'esds-text-link/esds-text-link.attr.stories.ts',
      tagName: 'esds-text-link',
      title: 'Components/Text Link',
    },
  ];

  it('flags the 5 custom attributes and the 3 elements', () => {
    expect([...collectCustomAttributeTagNames(REAL_CEM)].sort()).toEqual([
      'esds-body',
      'esds-button',
      'esds-heading',
      'esds-kbd',
      'esds-text-link',
    ]);
    expect(REAL_CASES).toHaveLength(8);
  });

  for (const realCase of REAL_CASES) {
    it(`produces valid snippets for the real ${realCase.title} stories`, () => {
      const cemDocs = findElementByTagName(REAL_CEM, realCase.tagName);
      if (cemDocs === null) throw new Error(`Missing CEM fixture entry for ${realCase.tagName}`);
      const source = readFileSync(join(componentsDir, realCase.file), 'utf8');
      const examples = buildStoryExamples(source, cemDocs);
      const issues = collectGeneratedPageIssues({
        pages: [
          page({
            title: realCase.title,
            componentKind: cemDocs.kind,
            componentTagName: cemDocs.tagName,
            componentAttributeNames: cemDocs.attributes.map((attribute) => attribute.name),
            examples,
          }),
        ],
        attributeTagNames: collectCustomAttributeTagNames(REAL_CEM),
      });
      expect(issues).toEqual([]);
      expect(examples.length).toBeGreaterThan(0);
    });
  }
});
