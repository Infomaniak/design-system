import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { collectCustomAttributeTagNames, parseCem } from './cem.ts';
import {
  buildStorySnippets,
  parseStoriesFile,
  toSnippetContext,
  type SnippetContext,
} from './story-snippets.ts';
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
  const REAL_CASES = [
    {
      file: 'esds-badge/esds-badge.component.stories.ts',
      context: {
        kind: 'element',
        tagName: 'esds-badge',
        attributeName: 'esds-badge',
        attributeNames: new Set<string>(),
        slotNames: new Set(['']),
      } satisfies SnippetContext,
      cemDefaults: {},
      componentKind: 'element',
      componentTagName: 'esds-badge',
      componentAttributeNames: [],
      title: 'Components/Badge',
    },
    {
      file: 'esds-body/esds-body.attr.stories.ts',
      context: {
        kind: 'attribute',
        tagName: 'esds-body',
        attributeName: 'esds-body',
        attributeNames: new Set<string>(),
        slotNames: new Set(),
      } satisfies SnippetContext,
      cemDefaults: {},
      componentKind: 'attribute',
      componentTagName: 'esds-body',
      componentAttributeNames: [],
      title: 'Components/Body',
    },
    {
      file: 'esds-button/esds-button.attr.stories.ts',
      context: {
        kind: 'attribute',
        tagName: 'esds-button',
        attributeName: 'esds-button',
        attributeNames: new Set(['disabled', 'loading']),
        slotNames: new Set(),
      } satisfies SnippetContext,
      cemDefaults: {},
      componentKind: 'attribute',
      componentTagName: 'esds-button',
      componentAttributeNames: ['disabled', 'loading'],
      title: 'Components/Button',
    },
    {
      file: 'esds-heading/esds-heading.attr.stories.ts',
      context: {
        kind: 'attribute',
        tagName: 'esds-heading',
        attributeName: 'esds-heading',
        attributeNames: new Set<string>(),
        slotNames: new Set(),
      } satisfies SnippetContext,
      cemDefaults: {},
      componentKind: 'attribute',
      componentTagName: 'esds-heading',
      componentAttributeNames: [],
      title: 'Components/Heading',
    },
    {
      file: 'esds-icon/esds-icon.component.stories.ts',
      context: {
        kind: 'element',
        tagName: 'esds-icon',
        attributeName: 'esds-icon',
        attributeNames: new Set(['name', 'inline']),
        slotNames: new Set(),
      } satisfies SnippetContext,
      cemDefaults: { inline: false },
      componentKind: 'element',
      componentTagName: 'esds-icon',
      componentAttributeNames: ['name', 'inline'],
      title: 'Components/Icon',
    },
    {
      file: 'esds-kbd/esds-kbd.attr.stories.ts',
      context: {
        kind: 'attribute',
        tagName: 'esds-kbd',
        attributeName: 'esds-kbd',
        attributeNames: new Set<string>(),
        slotNames: new Set(),
      } satisfies SnippetContext,
      cemDefaults: {},
      componentKind: 'attribute',
      componentTagName: 'esds-kbd',
      componentAttributeNames: [],
      title: 'Components/Kbd',
    },
    {
      file: 'esds-separator/esds-separator.component.stories.ts',
      context: {
        kind: 'element',
        tagName: 'esds-separator',
        attributeName: 'esds-separator',
        attributeNames: new Set(['orientation', 'decorative']),
        slotNames: new Set(),
      } satisfies SnippetContext,
      cemDefaults: { orientation: 'horizontal', decorative: false },
      componentKind: 'element',
      componentTagName: 'esds-separator',
      componentAttributeNames: ['orientation', 'decorative'],
      title: 'Components/Separator',
    },
    {
      file: 'esds-text-link/esds-text-link.attr.stories.ts',
      context: {
        kind: 'attribute',
        tagName: 'esds-text-link',
        attributeName: 'esds-text-link',
        attributeNames: new Set<string>(),
        slotNames: new Set(),
      } satisfies SnippetContext,
      cemDefaults: {},
      componentKind: 'attribute',
      componentTagName: 'esds-text-link',
      componentAttributeNames: [],
      title: 'Components/Text Link',
    },
  ];

  it('the CEM fixture flags the 5 custom attributes', () => {
    const cem = parseCem(
      JSON.stringify({
        modules: [
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
            path: 'src/components/esds-separator/esds-separator.component.ts',
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
    expect([...collectCustomAttributeTagNames(cem)]).toEqual(['esds-button']);
  });

  for (const realCase of REAL_CASES) {
    it(`produces valid snippets for the real ${realCase.title} stories`, () => {
      const source = readFileSync(join(componentsDir, realCase.file), 'utf8');
      const parsed = parseStoriesFile(source);
      const examples = buildStorySnippets({
        context: toSnippetContext({
          tagName: realCase.context.tagName,
          className: 'ClassName',
          kind: realCase.context.kind,
          attributeName: realCase.context.attributeName,
          attributes: [...realCase.context.attributeNames].map((name) => ({ name })),
          events: [],
          slots: [...realCase.context.slotNames].map((name) => ({ name, required: false })),
          cssProperties: [],
          cssParts: [],
        }),
        cemDefaults: realCase.cemDefaults,
        meta: parsed.meta,
        stories: parsed.stories,
      });
      const issues = collectGeneratedPageIssues({
        pages: [
          page({
            title: realCase.title,
            componentKind: realCase.componentKind,
            componentTagName: realCase.componentTagName,
            componentAttributeNames: realCase.componentAttributeNames,
            examples,
          }),
        ],
        attributeTagNames: ATTRIBUTE_TAG_NAMES,
      });
      expect(issues).toEqual([]);
      expect(examples.length).toBeGreaterThan(0);
    });
  }
});
