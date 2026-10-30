import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  buildStorySnippets,
  cleanRenderTemplate,
  mergeArgs,
  parseStoriesFile,
  synthesizeTagSnippet,
} from './story-snippets.ts';

const currentDir = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(currentDir, '..', '..', '..', '..', '..');

const SEPARATOR_STORIES = [
  "import { html } from 'lit';",
  '',
  'const { args, argTypes, template } = getStorybookHelpers("esds-separator");',
  '',
  'const meta = {',
  "  component: 'esds-separator',",
  '  args,',
  '  render: (args) => html`',
  "    <div style=\"flex-direction: ${args.orientation === 'vertical' ? 'row' : 'column'}\">",
  '      ${template(args)}',
  '    </div>',
  '  `,',
  '} satisfies Meta;',
  '',
  'export const Default: Story = {};',
  '',
  'export const Vertical: Story = {',
  '  args: {',
  "    orientation: 'vertical',",
  '  },',
  '};',
].join('\n');

const LINK_STORY = [
  'const meta = { component: "esds-button" } satisfies Meta;',
  '',
  'export const Link = {',
  '  ...storybookInteractiveControls({',
  "    href: 'https://infomaniak.com',",
  "    content: 'Link content',",
  '  }),',
  '  render: (args) => html`<a',
  '    ${defineComponentAttr}',
  '    esds-button',
  '    href="${args.href}"',
  '    >${args.content}</a>`,',
  '};',
].join('\n');

describe('parseStoriesFile', () => {
  it('extracts meta and story fields from an args-only stories file', () => {
    const parsed = parseStoriesFile(SEPARATOR_STORIES);
    expect(parsed.meta.componentTag).toBe('esds-separator');
    expect(parsed.meta.args).toBeNull();
    expect(parsed.meta.renderTemplate).toContain('${template(args)}');
    expect(parsed.stories.map((story) => story.exportName)).toEqual(['Default', 'Vertical']);
    expect(parsed.stories[1]?.args).toEqual({ orientation: 'vertical' });
  });

  it('extracts interactive args and render template from a custom-render story', () => {
    const parsed = parseStoriesFile(LINK_STORY);
    expect(parsed.meta.componentTag).toBe('esds-button');
    expect(parsed.stories[0]?.interactiveArgs).toEqual({
      href: 'https://infomaniak.com',
      content: 'Link content',
    });
    expect(parsed.stories[0]?.renderTemplate).toContain('${args.href}');
  });
});

describe('mergeArgs', () => {
  it('merges with later sources overriding earlier ones and skips nulls', () => {
    expect(mergeArgs(null, { a: 1 }, undefined, { a: 2, b: 3 })).toEqual({ a: 2, b: 3 });
  });
});

describe('synthesizeTagSnippet', () => {
  it('renders bare attributes for true booleans and omits falsy values', () => {
    expect(
      synthesizeTagSnippet('esds-separator', {
        decorative: true,
        disabled: false,
        name: undefined,
      }),
    ).toBe('<esds-separator decorative></esds-separator>');
  });

  it('renders quoted strings and escapes quotes', () => {
    expect(synthesizeTagSnippet('esds-icon', { name: 'esds:plus', note: 'a "quoted" note' })).toBe(
      '<esds-icon name="esds:plus" note="a &quot;quoted&quot; note"></esds-icon>',
    );
  });
});

describe('cleanRenderTemplate', () => {
  it('resolves args, directives and ifDefined attributes', () => {
    expect(
      cleanRenderTemplate(
        '<a\n    ${defineComponentAttr}\n    esds-button\n    data-badge=${ifDefined(args.badgeType)}\n    href="${args.href}">${args.content}</a>',
        { href: 'https://x.com', content: 'Link', badgeType: 'primary' },
      ),
    ).toBe('<a\n    esds-button\n    data-badge="primary"\n    href="https://x.com">Link</a>');
  });

  it('removes ifDefined attributes when the arg is absent', () => {
    expect(
      cleanRenderTemplate(
        '<button esds-button data-badge=${ifDefined(args.badgeType)}>x</button>',
        {},
      ),
    ).toBe('<button esds-button>x</button>');
  });

  it('expands template(args) with the component tag', () => {
    expect(
      cleanRenderTemplate(
        '<div>${template(args)}</div>',
        { orientation: 'vertical' },
        'esds-separator',
      ),
    ).toBe('<div><esds-separator orientation="vertical"></esds-separator></div>');
  });

  it('returns null for unresolvable expressions and booleans', () => {
    expect(
      cleanRenderTemplate(
        "<div style=\"flex-direction: ${args.orientation === 'v' ? 'row' : 'col'}\">",
        { orientation: 'v' },
      ),
    ).toBeNull();
    expect(
      cleanRenderTemplate('<button ?disabled=${args.disabled}>x</button>', { disabled: false }),
    ).toBeNull();
    expect(cleanRenderTemplate('${args.missing}', {})).toBeNull();
  });
});

describe('buildStorySnippets', () => {
  it('falls back to canonical synthesis when the meta render is unresolvable', () => {
    const parsed = parseStoriesFile(SEPARATOR_STORIES);
    const snippets = buildStorySnippets({
      tagName: 'esds-separator',
      cemDefaults: { orientation: 'horizontal', decorative: false },
      meta: parsed.meta,
      stories: parsed.stories,
    });
    expect(snippets.map((snippet) => snippet.code)).toEqual([
      '<esds-separator></esds-separator>',
      '<esds-separator orientation="vertical"></esds-separator>',
    ]);
  });

  it('cleans resolvable custom renders', () => {
    const parsed = parseStoriesFile(LINK_STORY);
    const snippets = buildStorySnippets({
      tagName: 'esds-button',
      cemDefaults: { disabled: false },
      meta: parsed.meta,
      stories: parsed.stories,
    });
    expect(snippets[0]?.code).toBe(
      '<a\n    esds-button\n    href="https://infomaniak.com"\n    >Link content</a>',
    );
  });

  it('parses the real separator stories file', () => {
    const source = readFileSync(
      join(
        repositoryRoot,
        'packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
      ),
      'utf8',
    );
    const parsed = parseStoriesFile(source);
    expect(parsed.meta.componentTag).toBe('esds-separator');
    expect(parsed.stories).toHaveLength(3);
    const snippets = buildStorySnippets({
      tagName: 'esds-separator',
      cemDefaults: {},
      meta: parsed.meta,
      stories: parsed.stories,
    });
    expect(snippets.map((snippet) => snippet.code)).toEqual([
      '<esds-separator></esds-separator>',
      '<esds-separator orientation="vertical"></esds-separator>',
      '<esds-separator decorative></esds-separator>',
    ]);
  });

  it('parses the real button stories file', () => {
    const source = readFileSync(
      join(
        repositoryRoot,
        'packages/components/src/components/esds-button/esds-button.attr.stories.ts',
      ),
      'utf8',
    );
    const parsed = parseStoriesFile(source);
    expect(parsed.stories).toHaveLength(5);
  });
});
