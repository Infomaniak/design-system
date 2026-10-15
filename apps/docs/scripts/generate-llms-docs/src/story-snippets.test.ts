import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  buildStorySnippets,
  cleanRenderTemplate,
  extractRenderTemplate,
  humanizeExportName,
  mergeArgs,
  parsePropertyArgs,
  parseStoriesFile,
  parseValueLiteral,
  synthesizeTagSnippet,
} from './story-snippets.ts';

const currentDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(currentDir, '__fixtures__');
const repositoryRoot = join(currentDir, '..', '..', '..', '..', '..');

function readFixture(name: string): string {
  return readFileSync(join(fixturesDir, name), 'utf8');
}

describe('scanner edge cases', () => {
  it('picks a bare default export object as meta', () => {
    const parsed = parseStoriesFile("export default { component: 'esds-d' };");
    expect(parsed.meta.componentTag).toBe('esds-d');
  });

  it('unescapes escaped characters in string args', () => {
    const parsed = parseStoriesFile(
      "const meta = { args: { label: 'a\\'b\\nc\\td' } } satisfies Meta;",
    );
    expect(parsed.meta.args).toEqual({ label: "a'b\nc\td" });
  });

  it('returns null args when the args literal contains an unterminated string', () => {
    const parsed = parseStoriesFile("const meta = { args: { label: 'oops } satisfies Meta;");
    expect(parsed.meta.args).toBeNull();
  });

  it('skips unresolvable values: arrays, identifiers, shorthands, invalid keys', () => {
    const parsed = parseStoriesFile(
      'const meta = { args: { list: [1, 2], label: someVar, shorthand, 123: "x" } } satisfies Meta;',
    );
    expect(parsed.meta.args).toEqual({});
  });

  it('skips to the next comma over unterminated strings and templates', () => {
    const parsed = parseStoriesFile("const meta = { args: { a: 'x, y } satisfies Meta;");
    expect(parsed.meta.args).toBeNull();
    const template = parseStoriesFile('const meta = { args: { a: `tpl } satisfies Meta;');
    expect(template.meta.args).toBeNull();
  });

  it('returns null interactive args for unbalanced calls', () => {
    const nested = parseStoriesFile(
      'const meta = { interactive: storybookInteractiveControls(withDefaults({ a: 1 })) } satisfies Meta;',
    );
    expect(nested.meta.interactiveArgs).toEqual({ a: 1 });
    const unterminatedTemplate = parseStoriesFile(
      'const meta = { interactive: storybookInteractiveControls((x) => html`<y>) } satisfies Meta;',
    );
    expect(unterminatedTemplate.meta.interactiveArgs).toBeNull();
    const unterminatedParens = parseStoriesFile(
      'const meta = { interactive: storybookInteractiveControls((((( } satisfies Meta;',
    );
    expect(unterminatedParens.meta.interactiveArgs).toBeNull();
  });

  it('skips delimiters inside quotes and templates of interactive calls', () => {
    const quoted = parseStoriesFile(
      "const meta = { interactive: storybookInteractiveControls('a) b') } satisfies Meta;",
    );
    expect(quoted.meta.interactiveArgs).toBeNull();
    const templated = parseStoriesFile(
      'const meta = { interactive: storybookInteractiveControls(`a) b`) } satisfies Meta;',
    );
    expect(templated.meta.interactiveArgs).toBeNull();
    const expression = parseStoriesFile(
      'const meta = { interactive: storybookInteractiveControls({ v: `x${a(1, 2)}y` }) } satisfies Meta;',
    );
    expect(expression.meta.interactiveArgs).toEqual({});
  });

  it('skips template literals used as args values', () => {
    const parsed = parseStoriesFile(
      'const meta = { args: { v: `tpl, comma`, w: `${a}, ${b}`, x: 1 } } satisfies Meta;',
    );
    expect(parsed.meta.args).toEqual({ x: 1 });
  });

  it('ignores escaped backticks inside render templates', () => {
    const parsed = parseStoriesFile(
      'const meta = { render: (args) => html`<x>\\`y\\`${args.z}</x>` } satisfies Meta;',
    );
    expect(parsed.meta.renderTemplate).toBe('<x>\\`y\\`${args.z}</x>');
    expect(parsed.meta.renderTemplate === null).toBe(false);
  });

  it('handles braces inside template expressions', () => {
    expect(cleanRenderTemplate('<div>${JSON.stringify({a: 1})}</div>', {})).toBeNull();
    expect(cleanRenderTemplate('<div>${ {a: 1} }</div>', {})).toBeNull();
  });

  it('returns null for unterminated expressions nested in templates', () => {
    expect(parseStoriesFile('export const A = { render: () => html`<x>${ {a: 1} ')).toEqual({
      meta: { args: null, componentTag: null, interactiveArgs: null, renderTemplate: null },
      stories: [],
    });
    expect(parseStoriesFile("export const A = { render: () => html`<x>${ 'oops ")).toEqual({
      meta: { args: null, componentTag: null, interactiveArgs: null, renderTemplate: null },
      stories: [],
    });
    expect(parseStoriesFile('export const A = { render: () => html`<x>${ `oops ')).toEqual({
      meta: { args: null, componentTag: null, interactiveArgs: null, renderTemplate: null },
      stories: [],
    });
  });

  it('returns null interactive args when the call body brace is unbalanced', () => {
    const parsed = parseStoriesFile(
      'const meta = { interactive: storybookInteractiveControls({ a: 1) }} satisfies Meta;',
    );
    expect(parsed.meta.interactiveArgs).toBeNull();
  });

  it('continues to the next meta candidate when an earlier one is unbalanced', () => {
    const parsed = parseStoriesFile(
      "const broken = { oops\nconst meta = { component: 'esds-x' } satisfies Meta;",
    );
    expect(parsed.meta.componentTag).toBe('esds-x');
  });

  it('returns null jsdoc for non-jsdoc or empty comments', () => {
    const plain = parseStoriesFile('/* plain */\nexport const X = {};');
    expect(plain.stories[0]?.jsdoc).toBeNull();
    const empty = parseStoriesFile('/** */\nexport const X = {};');
    expect(empty.stories[0]?.jsdoc).toBeNull();
  });

  it('skips delimiters and escapes inside quotes and templates of interactive calls', () => {
    const escapedQuote = parseStoriesFile(
      "const meta = { interactive: storybookInteractiveControls('a\\')b') } satisfies Meta;",
    );
    expect(escapedQuote.meta.interactiveArgs).toBeNull();
    const escapedTemplate = parseStoriesFile(
      'const meta = { interactive: storybookInteractiveControls(`a\\)b`) } satisfies Meta;',
    );
    expect(escapedTemplate.meta.interactiveArgs).toBeNull();
    const expressions = parseStoriesFile(
      "const meta = { interactive: storybookInteractiveControls({ v: `x${ {a: 1} }y`, w: `${f(')')}`, u: `${`n`}z` }) } satisfies Meta;",
    );
    expect(expressions.meta.interactiveArgs).toEqual({});
  });

  it('skips template values with nested expressions when scanning args', () => {
    const parsed = parseStoriesFile(
      "const meta = { args: { a: { label: 'x\\,y' }, b: { label: `p\\,q` }, c: { value: `x${ {k: 1} }y, z` }, d: { value: `m${f(')')}n` }, e: { value: `o${`l`}p` }, f: 1 } } satisfies Meta;",
    );
    expect(parsed.meta.args).toEqual({ f: 1 });
  });

  it('resolves numeric args in render templates', () => {
    expect(cleanRenderTemplate('<x>${args.count}</x>', { count: 5 })).toBe('<x>5</x>');
    expect(cleanRenderTemplate('<x a=${ifDefined(args.count)}>t</x>', { count: 5 })).toBe(
      '<x a="5">t</x>',
    );
  });

  it('synthesizes directly when neither meta nor story defines a render', () => {
    const parsed = parseStoriesFile(
      "const meta = { component: 'esds-y' } satisfies Meta;\nexport const Plain = { args: { label: 'Hi' } };",
    );
    const snippets = buildStorySnippets({
      tagName: 'esds-y',
      cemDefaults: {},
      meta: parsed.meta,
      stories: parsed.stories,
    });
    expect(snippets).toEqual([
      { name: 'Plain', description: undefined, code: '<esds-y label="Hi"></esds-y>' },
    ]);
  });
});

describe('parseValueLiteral', () => {
  it('parses string, number and boolean literals', () => {
    expect(parseValueLiteral("'hi'", 0)).toEqual({ value: 'hi', end: 4 });
    expect(parseValueLiteral('"double"', 0)).toEqual({ value: 'double', end: 8 });
    expect(parseValueLiteral('-3.5', 0)).toEqual({ value: -3.5, end: 4 });
    expect(parseValueLiteral('true', 0)).toEqual({ value: true, end: 4 });
    expect(parseValueLiteral('false', 0)).toEqual({ value: false, end: 5 });
  });

  it('returns null for unterminated strings', () => {
    expect(parseValueLiteral("'oops", 0)).toBeNull();
  });

  it('returns null when a minus sign is not followed by digits', () => {
    expect(parseValueLiteral('-x', 0)).toBeNull();
  });

  it('returns null for unbalanced config objects', () => {
    expect(parseValueLiteral('{ value: 1', 0)).toBeNull();
  });

  it('returns null for objects without a value property', () => {
    expect(parseValueLiteral('{ label: 1 }', 0)).toBeNull();
  });

  it('returns null for config objects with unresolvable values', () => {
    expect(parseValueLiteral('{ value: `tpl` }', 0)).toBeNull();
  });

  it('returns null for identifiers and other expressions', () => {
    expect(parseValueLiteral('someVar', 0)).toBeNull();
  });
});

describe('parsePropertyArgs', () => {
  it('returns null when args is not an object literal', () => {
    expect(parsePropertyArgs('args: someVar')).toBeNull();
  });

  it('returns null when the args literal is unbalanced', () => {
    expect(parsePropertyArgs('args: { unterminated')).toBeNull();
  });

  it('returns null when no args property exists', () => {
    expect(parsePropertyArgs('label: 1')).toBeNull();
  });

  it('supports quoted keys', () => {
    expect(parsePropertyArgs("{ args: { 'quoted': 1 } }")).toEqual({ quoted: 1 });
  });
});

describe('extractRenderTemplate', () => {
  it('extracts the body of a render template', () => {
    expect(extractRenderTemplate('render: (args) => html`<x>${args.y}</x>`')).toBe(
      '<x>${args.y}</x>',
    );
  });

  it('returns null without a render', () => {
    expect(extractRenderTemplate('label: 1')).toBeNull();
  });

  it('returns null for an unterminated template', () => {
    expect(extractRenderTemplate('render: (args) => html`<x>')).toBeNull();
  });
});

describe('parseStoriesFile', () => {
  it('extracts meta fields from a custom-render stories file', () => {
    const parsed = parseStoriesFile(readFixture('button-stories.txt'));
    expect(parsed.meta.componentTag).toBe('esds-button');
    expect(parsed.meta.args).toBeNull();
    expect(parsed.meta.interactiveArgs).toBeNull();
    expect(parsed.meta.renderTemplate).toContain('${template(args)}');
  });

  it('extracts story fields from a custom-render stories file', () => {
    const parsed = parseStoriesFile(readFixture('button-stories.txt'));
    expect(parsed.stories).toHaveLength(5);
    const link = parsed.stories.find((story) => story.exportName === 'Link');
    expect(link).toEqual({
      exportName: 'Link',
      jsdoc: 'Renders a link version of the button.',
      args: null,
      interactiveArgs: { href: 'https://infomaniak.com', content: 'Link content' },
      renderTemplate: expect.stringContaining('${args.href}'),
    });
    const withBadge = parsed.stories.find((story) => story.exportName === 'WithBadge');
    expect(withBadge?.interactiveArgs).toEqual({ content: 'Badge', badgeType: 'primary' });
    const withComment = parsed.stories.find((story) => story.exportName === 'WithComment');
    expect(withComment?.args).toEqual({ content: 'Commented' });
    const noRender = parsed.stories.find((story) => story.exportName === 'NoRender');
    expect(noRender?.renderTemplate).toBeNull();
  });

  it('extracts meta-level render and per-story args from an args-only stories file', () => {
    const parsed = parseStoriesFile(readFixture('separator-stories.txt'));
    expect(parsed.meta.componentTag).toBe('esds-separator');
    expect(parsed.meta.args).toBeNull();
    expect(parsed.meta.renderTemplate).toContain('${template(args)}');
    expect(parsed.stories).toHaveLength(3);
    const vertical = parsed.stories.find((story) => story.exportName === 'Vertical');
    expect(vertical?.args).toEqual({ orientation: 'vertical' });
    const decorative = parsed.stories.find((story) => story.exportName === 'Decorative');
    expect(decorative?.args).toEqual({ decorative: true });
  });

  it('parses meta-level literal args and as Meta suffix', () => {
    const parsed = parseStoriesFile(
      [
        "const meta = { component: 'esds-x', args: { label: 'Save', count: 2, active: true } } as Meta;",
        'export default meta;',
      ].join('\n'),
    );
    expect(parsed.meta.componentTag).toBe('esds-x');
    expect(parsed.meta.args).toEqual({ label: 'Save', count: 2, active: true });
  });

  it('returns an empty result for sources without stories', () => {
    const parsed = parseStoriesFile('export const nothing = 42;');
    expect(parsed.meta.componentTag).toBeNull();
    expect(parsed.meta.args).toBeNull();
    expect(parsed.meta.interactiveArgs).toBeNull();
    expect(parsed.meta.renderTemplate).toBeNull();
    expect(parsed.stories).toEqual([]);
  });

  it('handles unterminated templates without throwing', () => {
    const parsed = parseStoriesFile(
      'export const A = { render: (args) => html`<x>${args.y} } satisfies Meta;',
    );
    expect(parsed.stories).toEqual([]);
    const unterminatedMeta = parseStoriesFile('const meta = { component: "esds-x"');
    expect(unterminatedMeta.meta.componentTag).toBeNull();
  });

  it('skips stories with unparseable object bodies', () => {
    const parsed = parseStoriesFile('export const Broken = { render: (args) => html`<x>');
    expect(parsed.stories).toEqual([]);
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
    expect(parsed.meta.args).toBeNull();
    expect(parsed.stories).toHaveLength(3);
    expect(parsed.stories.map((story) => story.exportName)).toEqual([
      'Default',
      'Vertical',
      'Decorative',
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
    expect(parsed.meta.componentTag).toBe('esds-button');
    expect(parsed.stories).toHaveLength(5);
    const button = parsed.stories.find((story) => story.exportName === 'Button');
    expect(button?.interactiveArgs).toEqual({
      content: 'Text content',
      buttonType: 'primary',
      size: 'medium',
    });
  });
});

describe('mergeArgs', () => {
  it('merges with later sources overriding earlier ones', () => {
    expect(mergeArgs({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('skips null and undefined sources', () => {
    expect(mergeArgs(null, { a: 1 }, undefined, { b: 2 })).toEqual({ a: 1, b: 2 });
    expect(mergeArgs()).toEqual({});
  });
});

describe('synthesizeTagSnippet', () => {
  it('renders bare attributes for true booleans and omits false/null/undefined', () => {
    expect(
      synthesizeTagSnippet('esds-separator', {
        decorative: true,
        disabled: false,
        name: undefined,
        label: null,
      }),
    ).toBe('<esds-separator decorative></esds-separator>');
  });

  it('renders quoted strings and numbers and escapes quotes', () => {
    expect(
      synthesizeTagSnippet('esds-icon', { name: 'esds:plus', count: 3, note: 'a "quoted" note' }),
    ).toBe('<esds-icon name="esds:plus" count="3" note="a &quot;quoted&quot; note"></esds-icon>');
  });

  it('renders an empty tag for empty or omitting args', () => {
    expect(synthesizeTagSnippet('esds-kbd', {})).toBe('<esds-kbd></esds-kbd>');
    expect(synthesizeTagSnippet('esds-kbd', { label: '' })).toBe('<esds-kbd></esds-kbd>');
  });
});

describe('cleanRenderTemplate', () => {
  it('resolves quoted args interpolation and directives', () => {
    expect(
      cleanRenderTemplate(
        '<a\n    ${defineComponentAttr}\n    esds-button\n    href="${args.href}"\n    >${args.content}</a>',
        { href: 'https://infomaniak.com', content: 'Link content' },
      ),
    ).toBe('<a\n    esds-button\n    href="https://infomaniak.com"\n    >Link content</a>');
  });

  it('resolves unquoted ifDefined attributes when present', () => {
    expect(
      cleanRenderTemplate(
        '<button data-badge=${ifDefined(args.badgeType)}>${args.content}</button>',
        {
          badgeType: 'primary',
          content: 'Badge',
        },
      ),
    ).toBe('<button data-badge="primary">Badge</button>');
  });

  it('removes unquoted ifDefined attributes when absent', () => {
    expect(
      cleanRenderTemplate(
        '<button esds-button data-badge=${ifDefined(args.badgeType)}>x</button>',
        {
          badgeType: false,
        },
      ),
    ).toBe('<button esds-button>x</button>');
  });

  it('strips comments and collapses whitespace-only lines', () => {
    expect(
      cleanRenderTemplate(
        '<button esds-button>\n    <!-- a TODO comment -->\n    ${args.content}\n  </button>',
        {
          content: 'Commented',
        },
      ),
    ).toBe('<button esds-button>\n    Commented\n  </button>');
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

  it('returns null for template(args) without a component tag', () => {
    expect(cleanRenderTemplate('<div>${template(args)}</div>', {})).toBeNull();
  });

  it('returns null for ternaries, maps, nested templates and boolean interpolations', () => {
    const ternary = "<div style=\"flex-direction: ${args.orientation === 'v' ? 'row' : 'col'}\">";
    expect(cleanRenderTemplate(ternary, { orientation: 'v' })).toBeNull();
    expect(cleanRenderTemplate('${["a", "b"].map((v) => html`<span>${v}</span>`)}', {})).toBeNull();
    expect(
      cleanRenderTemplate('<button ?disabled=${args.disabled}>x</button>', { disabled: false }),
    ).toBeNull();
    expect(cleanRenderTemplate('${args.missing}', {})).toBeNull();
    expect(cleanRenderTemplate('${unknownIdentifier}', {})).toBeNull();
  });

  it('returns null for top-level backticks and unterminated expressions', () => {
    expect(cleanRenderTemplate('<div>`nested`</div>', {})).toBeNull();
    expect(cleanRenderTemplate('<div>${args.content', {})).toBeNull();
  });
});

describe('humanizeExportName', () => {
  it('splits camelCase export names into display names', () => {
    expect(humanizeExportName('TextOnly')).toBe('Text Only');
    expect(humanizeExportName('WithStrongContent')).toBe('With Strong Content');
    expect(humanizeExportName('AllSizes')).toBe('All Sizes');
    expect(humanizeExportName('Default')).toBe('Default');
  });
});

describe('buildStorySnippets', () => {
  it('cleans resolvable custom renders and synthesizes canonical tags otherwise', () => {
    const parsed = parseStoriesFile(readFixture('button-stories.txt'));
    const snippets = buildStorySnippets({
      tagName: 'esds-button',
      cemDefaults: { disabled: false, loading: false },
      meta: parsed.meta,
      stories: parsed.stories,
    });
    expect(snippets.map((snippet) => snippet.name)).toEqual([
      'Link',
      'With Badge',
      'With Comment',
      'Mapped',
      'No Render',
    ]);
    expect(snippets[0]?.description).toBe('Renders a link version of the button.');
    expect(snippets[0]?.code).toBe(
      '<a\n    esds-button\n    href="https://infomaniak.com"\n    >Link content</a>',
    );
    expect(snippets[1]?.code).toBe(
      '<button esds-button data-badge="primary">\n    Badge\n  </button>',
    );
    expect(snippets[2]?.code).toBe('<button esds-button>\n    Commented\n  </button>');
    expect(snippets[3]?.code).toBe('<esds-button content="Mapped"></esds-button>');
    expect(snippets[4]?.code).toBe(
      '<button><esds-button content="Canonical"></esds-button></button>',
    );
  });

  it('falls back to synthesis for args-only stories with an unresolvable meta render', () => {
    const parsed = parseStoriesFile(readFixture('separator-stories.txt'));
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

  it('builds snippets for the real separator stories file', () => {
    const source = readFileSync(
      join(
        repositoryRoot,
        'packages/components/src/components/esds-separator/esds-separator.component.stories.ts',
      ),
      'utf8',
    );
    const parsed = parseStoriesFile(source);
    const snippets = buildStorySnippets({
      tagName: 'esds-separator',
      cemDefaults: { orientation: 'horizontal', decorative: false },
      meta: parsed.meta,
      stories: parsed.stories,
    });
    expect(snippets.map((snippet) => snippet.code)).toEqual([
      '<esds-separator></esds-separator>',
      '<esds-separator orientation="vertical"></esds-separator>',
      '<esds-separator decorative></esds-separator>',
    ]);
  });

  it('builds snippets for the real button stories file', () => {
    const source = readFileSync(
      join(
        repositoryRoot,
        'packages/components/src/components/esds-button/esds-button.attr.stories.ts',
      ),
      'utf8',
    );
    const parsed = parseStoriesFile(source);
    const snippets = buildStorySnippets({
      tagName: 'esds-button',
      cemDefaults: {},
      meta: parsed.meta,
      stories: parsed.stories,
    });
    const names = snippets.map((snippet) => snippet.name);
    expect(names).toEqual(['Button', 'Link', 'Text Only', 'Types', 'Sizes']);
    const button = snippets.find((snippet) => snippet.name === 'Button');
    expect(button?.code).toBe(
      '<esds-button content="Text content" buttonType="primary" size="medium"></esds-button>',
    );
  });
});
