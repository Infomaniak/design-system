import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  buildStorySnippets,
  cleanRenderTemplate,
  findAttributeHostTag,
  mergeArgs,
  parseStoriesFile,
  snippetReferencesComponent,
  synthesizeSnippet,
  toSnippetContext,
  type SnippetContext,
} from './story-snippets.ts';
import type { CemElementDocs } from './types.ts';

const currentDir = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(currentDir, '..', '..', '..', '..', '..');
const componentsDir = join(repositoryRoot, 'packages/components/src/components');

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

const SEPARATOR_CONTEXT: SnippetContext = {
  kind: 'element',
  tagName: 'esds-separator',
  attributeName: 'esds-separator',
  attributeNames: new Set(['orientation', 'decorative']),
  slotNames: new Set(),
};

const BADGE_CONTEXT: SnippetContext = {
  kind: 'element',
  tagName: 'esds-badge',
  attributeName: 'esds-badge',
  attributeNames: new Set(),
  slotNames: new Set(['']),
};

const NAMED_SLOT_CONTEXT: SnippetContext = {
  kind: 'element',
  tagName: 'esds-slot-host',
  attributeName: 'esds-slot-host',
  attributeNames: new Set(['label']),
  slotNames: new Set(['', 'icon']),
};

const BUTTON_CONTEXT: SnippetContext = {
  kind: 'attribute',
  tagName: 'esds-button',
  attributeName: 'esds-button',
  attributeNames: new Set(['disabled', 'loading']),
  slotNames: new Set(),
};

const BODY_CONTEXT: SnippetContext = {
  kind: 'attribute',
  tagName: 'esds-body',
  attributeName: 'esds-body',
  attributeNames: new Set(),
  slotNames: new Set(),
};

const HEADING_CONTEXT: SnippetContext = {
  kind: 'attribute',
  tagName: 'esds-heading',
  attributeName: 'esds-heading',
  attributeNames: new Set(),
  slotNames: new Set(),
};

const KBD_CONTEXT: SnippetContext = {
  kind: 'attribute',
  tagName: 'esds-kbd',
  attributeName: 'esds-kbd',
  attributeNames: new Set(),
  slotNames: new Set(),
};

const TEXT_LINK_CONTEXT: SnippetContext = {
  kind: 'attribute',
  tagName: 'esds-text-link',
  attributeName: 'esds-text-link',
  attributeNames: new Set(),
  slotNames: new Set(),
};

const ICON_CONTEXT: SnippetContext = {
  kind: 'element',
  tagName: 'esds-icon',
  attributeName: 'esds-icon',
  attributeNames: new Set(['name', 'inline']),
  slotNames: new Set(),
};

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

describe('toSnippetContext', () => {
  it('builds the rendering context from the CEM docs', () => {
    const cemDocs: CemElementDocs = {
      tagName: 'esds-badge',
      className: 'EsdsBadgeComponent',
      kind: 'element',
      attributeName: 'esds-badge',
      attributes: [],
      events: [],
      slots: [{ name: '', required: false }],
      cssProperties: [],
      cssParts: [],
    };
    expect(toSnippetContext(cemDocs)).toEqual({
      kind: 'element',
      tagName: 'esds-badge',
      attributeName: 'esds-badge',
      attributeNames: new Set(),
      slotNames: new Set(['']),
    });
  });
});

describe('synthesizeSnippet', () => {
  it('renders bare attributes for true booleans and skips unknown keys', () => {
    expect(synthesizeSnippet(SEPARATOR_CONTEXT, { decorative: true, badgeType: 'x' }, null)).toBe(
      '<esds-separator decorative></esds-separator>',
    );
  });

  it('renders quoted strings and escapes quotes for CEM attributes', () => {
    expect(synthesizeSnippet(SEPARATOR_CONTEXT, { orientation: 'a "quoted" note' }, null)).toBe(
      '<esds-separator orientation="a &quot;quoted&quot; note"></esds-separator>',
    );
  });

  it('renders numbers and skips falsy values', () => {
    expect(synthesizeSnippet(SEPARATOR_CONTEXT, { orientation: 2 }, null)).toBe(
      '<esds-separator orientation="2"></esds-separator>',
    );
    expect(synthesizeSnippet(SEPARATOR_CONTEXT, { orientation: '' }, null)).toBe(
      '<esds-separator></esds-separator>',
    );
  });

  it('renders a slot arg as child content for element kind', () => {
    expect(
      synthesizeSnippet(BADGE_CONTEXT, { badgeType: 'primary', 'default-slot': '3' }, null),
    ).toBe('<esds-badge>3</esds-badge>');
  });

  it('renders named slot args as child content and skips undeclared slots', () => {
    expect(synthesizeSnippet(NAMED_SLOT_CONTEXT, { label: 'Hi', 'icon-slot': 'X' }, null)).toBe(
      '<esds-slot-host label="Hi">X</esds-slot-host>',
    );
    expect(synthesizeSnippet(BADGE_CONTEXT, { 'icon-slot': 'X' }, null)).toBe(
      '<esds-badge></esds-badge>',
    );
  });

  it('keeps stringified numbers and drops non-primitive slot content', () => {
    expect(synthesizeSnippet(BADGE_CONTEXT, { 'default-slot': 42 }, null)).toBe(
      '<esds-badge>42</esds-badge>',
    );
    expect(synthesizeSnippet(BADGE_CONTEXT, { 'default-slot': false }, null)).toBe(
      '<esds-badge></esds-badge>',
    );
  });

  it('synthesizes host markup for attribute kind from the template host tag', () => {
    const template = [
      'render: (args) => html`<button',
      '  ${defineEsdsButtonAttr}',
      '  esds-button',
      '  ?disabled=${args.disabled}',
      '>`;',
    ].join('\n');
    expect(synthesizeSnippet(BUTTON_CONTEXT, { disabled: true }, template)).toBe(
      '<button esds-button disabled></button>',
    );
  });

  it('synthesizes CEM attribute values for attribute kind without inventing others', () => {
    const template = '<button ${define} esds-button>label</button>';
    expect(synthesizeSnippet(BUTTON_CONTEXT, { loading: true, content: 'Text' }, template)).toBe(
      '<button esds-button loading></button>',
    );
  });

  it('returns null for attribute kind without a derivable host tag', () => {
    expect(synthesizeSnippet(BUTTON_CONTEXT, {}, '<div>no attribute here</div>')).toBeNull();
    expect(synthesizeSnippet(BUTTON_CONTEXT, {}, null)).toBeNull();
  });
});

describe('findAttributeHostTag', () => {
  it('finds the first open tag carrying the attribute, nested templates included', () => {
    const template = [
      'html`',
      '  <div class="buttons-container">',
      '    ${BUTTON_TYPES.map((variant) => html`',
      '      <button',
      '        ${defineEsdsButtonAttr}',
      '        esds-button',
      '      >',
      '      </button>`)}',
      '  </div>`',
    ].join('\n');
    expect(findAttributeHostTag(template, 'esds-button')).toBe('button');
  });

  it('requires the exact attribute name and returns null otherwise', () => {
    expect(
      findAttributeHostTag('<a data-esds-button-type="primary">x</a>', 'esds-button'),
    ).toBeNull();
    expect(
      findAttributeHostTag('<button data-esds-button="x">y</button>', 'esds-button'),
    ).toBeNull();
    expect(findAttributeHostTag('<button\n  esds-button\n>y</button>', 'esds-button')).toBe(
      'button',
    );
  });
});

describe('snippetReferencesComponent', () => {
  it('requires the element tag for element kind', () => {
    expect(snippetReferencesComponent('<esds-badge data-x="y">3</esds-badge>', BADGE_CONTEXT)).toBe(
      true,
    );
    expect(snippetReferencesComponent('<div>esds-badge</div>', BADGE_CONTEXT)).toBe(false);
    expect(snippetReferencesComponent('<esds-badgeish></esds-badgeish>', BADGE_CONTEXT)).toBe(
      false,
    );
  });

  it('requires the attribute name inside a tag for attribute kind', () => {
    expect(snippetReferencesComponent('<button esds-button></button>', BUTTON_CONTEXT)).toBe(true);
    expect(snippetReferencesComponent('<p esds-body="md">x</p>', BODY_CONTEXT)).toBe(true);
    expect(
      snippetReferencesComponent('<a data-esds-button-type="primary">x</a>', BUTTON_CONTEXT),
    ).toBe(false);
    expect(snippetReferencesComponent('<div>use esds-button here</div>', BUTTON_CONTEXT)).toBe(
      false,
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

  it('resolves bracket-notation args, quoted bracket notation and ifDefined brackets', () => {
    expect(cleanRenderTemplate('<b>${args["a"]}</b>', { a: 'x' })).toBe('<b>x</b>');
    expect(cleanRenderTemplate("<b>${ifDefined(args['a'])}</b>", { a: 'x' })).toBe('<b>x</b>');
  });

  it('expands template(args) with the component tag for element kind', () => {
    expect(
      cleanRenderTemplate(
        '<div>${template(args)}</div>',
        { orientation: 'vertical' },
        SEPARATOR_CONTEXT,
      ),
    ).toBe('<div><esds-separator orientation="vertical"></esds-separator></div>');
  });

  it('fails when template(args) is used without a context', () => {
    expect(cleanRenderTemplate('<div>${template(args)}</div>', {})).toBeNull();
  });

  it('drops falsy boolean attributes and renders truthy ones bare', () => {
    expect(
      cleanRenderTemplate('<button ?disabled=${args.disabled}>x</button>', { disabled: false }),
    ).toBe('<button>x</button>');
    expect(
      cleanRenderTemplate('<button\n  ?disabled=${args.disabled}\n>x</button>', { disabled: true }),
    ).toBe('<button disabled>x</button>');
  });

  it('drops unknown args in boolean bindings (spread-provided controls)', () => {
    expect(
      cleanRenderTemplate('<button\n  esds-button\n  ?disabled=${args.disabled}\n>x</button>', {}),
    ).toBe('<button\n  esds-button>x</button>');
    expect(cleanRenderTemplate('<button ?flag="${args.flag}">x</button>', {})).toBe(
      '<button>x</button>',
    );
  });

  it('drops unknown args in unquoted attribute bindings', () => {
    expect(cleanRenderTemplate('<a href=${args.href}>x</a>', {})).toBe('<a>x</a>');
  });

  it('fails fast for unknown args interpolated as raw quoted text or child', () => {
    expect(cleanRenderTemplate('<a href="${args.href}">x</a>', {})).toBeNull();
    expect(cleanRenderTemplate('<a>${args.content}</a>', {})).toBeNull();
    expect(cleanRenderTemplate('<a>${args.flag}</a>', { flag: true })).toBeNull();
  });

  it('drops event bindings including arrow functions', () => {
    expect(cleanRenderTemplate('<button @click="${() => console.log(\'x\')}">y</button>', {})).toBe(
      '<button>y</button>',
    );
    expect(cleanRenderTemplate('<button @click=${handler}>y</button>', {})).toBe(
      '<button>y</button>',
    );
    expect(cleanRenderTemplate('<button @key-enter="${onEnter}">y</button>', {})).toBe(
      '<button>y</button>',
    );
  });

  it('drops dotted identifier-call directives such as array maps', () => {
    expect(
      cleanRenderTemplate(
        '<div>${BUTTON_TYPES.map((variant) => html`<button>${variant}</button>`)}</div>',
        {},
      ),
    ).toBe('<div></div>');
  });

  it('resolves number args as attribute values', () => {
    expect(cleanRenderTemplate('<b data-count=${args.count}></b>', { count: 2 })).toBe(
      '<b data-count="2"></b>',
    );
  });

  it('joins closing tags and tag gt split across lines', () => {
    expect(cleanRenderTemplate('<a\n    esds-text-link\n    >Text link</a\n  >', {})).toBe(
      '<a\n    esds-text-link>Text link</a>',
    );
  });

  it('returns null for unresolvable expressions and raw backticks', () => {
    expect(
      cleanRenderTemplate(
        "<div style=\"flex-direction: ${args.orientation === 'v' ? 'row' : 'col'}\">",
        { orientation: 'v' },
      ),
    ).toBeNull();
    expect(cleanRenderTemplate('${args.missing}', {})).toBeNull();
    expect(cleanRenderTemplate('<div>`</div>', {})).toBeNull();
  });
});

describe('buildStorySnippets', () => {
  it('falls back to canonical synthesis when the meta render is unresolvable', () => {
    const parsed = parseStoriesFile(SEPARATOR_STORIES);
    const snippets = buildStorySnippets({
      context: SEPARATOR_CONTEXT,
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
      context: BUTTON_CONTEXT,
      cemDefaults: { disabled: false },
      meta: parsed.meta,
      stories: parsed.stories,
    });
    expect(snippets[0]?.code).toBe(
      '<a\n    esds-button\n    href="https://infomaniak.com">Link content</a>',
    );
  });

  it('omits a story whose synthesis cannot derive a host tag', () => {
    const parsed = parseStoriesFile(
      [
        'const meta = { component: "esds-button" } satisfies Meta;',
        '',
        'export const Orphan = {',
        '  render: () => html`<div>nothing relevant</div>`,',
        '};',
      ].join('\n'),
    );
    const snippets = buildStorySnippets({
      context: BUTTON_CONTEXT,
      cemDefaults: {},
      meta: parsed.meta,
      stories: parsed.stories,
    });
    expect(snippets).toEqual([]);
  });

  it('falls back to synthesis when the cleaned template is unusable', () => {
    const parsed = parseStoriesFile(
      [
        'const meta = { component: "esds-button" } satisfies Meta;',
        '',
        'export const Types = {',
        '  render: (args) => html`',
        '    <div class="buttons-container">',
        '      ${BUTTON_TYPES.map((variant) => html`',
        '        <button ${define} esds-button>${variant}</button>',
        '      `)}',
        '    </div>',
        '  `,',
        '};',
      ].join('\n'),
    );
    const snippets = buildStorySnippets({
      context: BUTTON_CONTEXT,
      cemDefaults: {},
      meta: parsed.meta,
      stories: parsed.stories,
    });
    expect(snippets.map((snippet) => snippet.code)).toEqual(['<button esds-button></button>']);
  });
});

describe('real component stories', () => {
  function buildFor(componentFile: string, context: SnippetContext, cemDefaults: Args = {}) {
    const source = readFileSync(join(componentsDir, componentFile), 'utf8');
    const parsed = parseStoriesFile(source);
    return buildStorySnippets({
      context,
      cemDefaults,
      meta: parsed.meta,
      stories: parsed.stories,
    });
  }

  type Args = Record<string, string | number | boolean>;

  it('renders the real separator stories', () => {
    const snippets = buildFor(
      'esds-separator/esds-separator.component.stories.ts',
      SEPARATOR_CONTEXT,
      { orientation: 'horizontal', decorative: false },
    );
    expect(snippets.map((snippet) => snippet.code)).toEqual([
      '<esds-separator></esds-separator>',
      '<esds-separator orientation="vertical"></esds-separator>',
      '<esds-separator decorative></esds-separator>',
    ]);
  });

  it('renders the real button stories without phantom tags', () => {
    const snippets = buildFor('esds-button/esds-button.attr.stories.ts', BUTTON_CONTEXT, {});
    expect(snippets.map((snippet) => snippet.name)).toEqual([
      'Button',
      'Link',
      'Text Only',
      'Types',
      'Sizes',
    ]);
    expect(snippets.map((snippet) => snippet.code)).toEqual([
      [
        '<button',
        '      esds-button',
        '      data-esds-button-type="primary"',
        '      data-esds-button-size="medium"',
        '    >',
        '      <esds-icon name="esds:plus"></esds-icon>',
        '      Text content',
        '      <kbd esds-kbd="">⌘</kbd>',
        '    </button>',
      ].join('\n'),
      [
        '<a',
        '      esds-button',
        '      href="https://infomaniak.com"',
        '      target="_blank"',
        '    >',
        '      <esds-icon name="esds:plus"></esds-icon>',
        '      Link content',
        '    </a>',
      ].join('\n'),
      '<button\n      esds-button\n    >\n      Text content\n    </button>',
      '<button esds-button></button>',
      '<button esds-button></button>',
    ]);
  });

  it('renders the real badge stories with slot content as children', () => {
    const snippets = buildFor('esds-badge/esds-badge.component.stories.ts', BADGE_CONTEXT, {});
    expect(snippets.map((snippet) => snippet.code)).toEqual([
      '<esds-badge>3</esds-badge>',
      '<esds-badge></esds-badge>',
    ]);
  });

  it('renders the real body stories with host markup', () => {
    const snippets = buildFor('esds-body/esds-body.attr.stories.ts', BODY_CONTEXT, {});
    expect(snippets.map((snippet) => snippet.code)).toEqual([
      '<p\n      esds-body="md"\n    >\n      This is a body example\n    </p>',
      [
        '<p',
        '      esds-body="md"',
        '    >',
        '      This is a body example <strong>with strong content</strong>',
        '    </p>',
      ].join('\n'),
      '<p esds-body></p>',
    ]);
  });

  it('renders the real heading stories with host markup', () => {
    const snippets = buildFor('esds-heading/esds-heading.attr.stories.ts', HEADING_CONTEXT, {});
    expect(snippets).toHaveLength(3);
    expect(snippets[0]?.code).toBe(
      '<h1\n      esds-heading="md"\n    >\n      This is a heading example\n    </h1>',
    );
    expect(snippets[2]?.code).toContain('<h6\n      esds-heading="xs"');
    expect(snippets[2]?.code).not.toContain('?emphasized');
  });

  it('renders the real kbd stories with host markup', () => {
    const snippets = buildFor('esds-kbd/esds-kbd.attr.stories.ts', KBD_CONTEXT, {});
    expect(snippets[0]?.code).toBe(
      '<p>\n      Press\n      <kbd\n        esds-kbd>K</kbd>\n      to open the search.\n    </p>',
    );
    expect(snippets).toHaveLength(3);
  });

  it('renders the real text link stories with host markup', () => {
    const snippets = buildFor(
      'esds-text-link/esds-text-link.attr.stories.ts',
      TEXT_LINK_CONTEXT,
      {},
    );
    expect(snippets[0]?.code).toBe(
      '<a\n      esds-text-link\n      href="https://infomaniak.com">Text link</a>',
    );
    expect(snippets).toHaveLength(5);
  });

  it('renders the real icon stories', () => {
    const snippets = buildFor('esds-icon/esds-icon.component.stories.ts', ICON_CONTEXT, {
      inline: false,
    });
    expect(snippets.map((snippet) => snippet.code)).toEqual([
      '<esds-icon name="esds:headset"></esds-icon>',
      '<a href="#">\n      Follow this link\n      <esds-icon\n        name="esds:square-arrow-out-up-right"\n        inline></esds-icon>\n    </a>',
      '<esds-icon name="esds:bug"></esds-icon>',
    ]);
  });
});
