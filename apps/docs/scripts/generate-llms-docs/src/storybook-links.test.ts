import { describe, expect, it } from 'vitest';
import { relativizeStorybookLinks } from './storybook-links.ts';

const TARGETS = new Map<string, string>([
  ['design-tokens-getting-started--docs', 'llms/design-tokens/getting-started.md'],
  ['welcome--docs', 'llms/welcome.md'],
  ['designers-guide-figma-plugins--docs', 'llms/designers-guide/figma-plugins.md'],
]);

describe('relativizeStorybookLinks', () => {
  it('rewrites markdown links to the generated page', () => {
    expect(
      relativizeStorybookLinks(
        'Read [the guide](./?path=/docs/design-tokens-getting-started--docs) first.',
        TARGETS,
        'llms/welcome.md',
      ),
    ).toBe('Read [the guide](design-tokens/getting-started.md) first.');
  });

  it('preserves fragments and computes the relative path for nested pages', () => {
    expect(
      relativizeStorybookLinks(
        '[Figma plugins](./?path=/docs/designers-guide-figma-plugins--docs#esds-icons)',
        TARGETS,
        'llms/designers-guide/web/shadcn-kit.md',
      ),
    ).toBe('[Figma plugins](../figma-plugins.md#esds-icons)');
  });

  it('drops links to unknown story ids, keeping the label', () => {
    expect(
      relativizeStorybookLinks(
        '[dead](./?path=/docs/unknown--docs) and [alive](?path=/docs/welcome--docs)',
        TARGETS,
        'llms/welcome.md',
      ),
    ).toBe('dead and [alive](welcome.md)');
  });

  it('leaves non-docs urls untouched', () => {
    const markdown =
      '[story](?path=/story/components-button--primary) and [docs](https://example.com/docs)';
    expect(relativizeStorybookLinks(markdown, TARGETS, 'llms/welcome.md')).toBe(markdown);
  });

  it('rewrites href attributes and removes unknown ones', () => {
    expect(
      relativizeStorybookLinks(
        '<a href="./?path=/docs/welcome--docs" class="card">Welcome</a>\n<a href="./?path=/docs/unknown--docs">Dead</a>',
        TARGETS,
        'llms/typography.md',
      ),
    ).toBe('<a href="welcome.md" class="card">Welcome</a>\n<a >Dead</a>');
  });

  it('leaves links inside fenced code blocks untouched', () => {
    const markdown = [
      '```md',
      '[guide](./?path=/docs/unknown--docs)',
      '<a href="./?path=/docs/unknown--docs">x</a>',
      '```',
    ].join('\n');
    expect(relativizeStorybookLinks(markdown, TARGETS, 'llms/welcome.md')).toBe(markdown);
  });
});
