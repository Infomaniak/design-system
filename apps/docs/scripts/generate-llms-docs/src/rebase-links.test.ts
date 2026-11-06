import { describe, expect, it } from 'vitest';
import { collectRelativeLinkTargets, rebaseRelativeLinks } from './rebase-links.ts';

describe('rebaseRelativeLinks', () => {
  it('rebases markdown links, images and html attributes to the site root', () => {
    const rebased = rebaseRelativeLinks(
      [
        '[text](design-tokens/t2/text.md)',
        '',
        '[typography](../typography.md)',
        '',
        '![palette](palette.png)',
        '',
        '<a href="./helpers.md">Helpers</a>',
        "and <img src='logo.svg'>",
      ].join('\n'),
      'llms/designers-guide',
    );
    expect(rebased).toContain('](llms/designers-guide/design-tokens/t2/text.md)');
    expect(rebased).toContain('](llms/typography.md)');
    expect(rebased).toContain('![palette](llms/designers-guide/palette.png)');
    expect(rebased).toContain('href="llms/designers-guide/helpers.md"');
    expect(rebased).toContain("src='llms/designers-guide/logo.svg'");
  });

  it('re-anchors root file links to bare site-root names', () => {
    const rebased = rebaseRelativeLinks(
      '[i](./llms.txt) [f](../llms-full.txt) [d](DESIGN.md) [d2](./DESIGN.md)',
      'llms',
    );
    expect(rebased).toBe('[i](llms.txt) [f](llms-full.txt) [d](DESIGN.md) [d2](DESIGN.md)');
  });

  it('leaves non-rebasable targets untouched', () => {
    const markdown = [
      '[mail](mailto:support@infomaniak.ch)',
      '[ext](https://infomaniak.ch/x.md)',
      '[hash](#styles)',
      '[abs](/assets/x.png)',
      '[proto](//cdn.example/y.png)',
      '[story](./?path=/story/welcome--docs)',
      '[query](?path=/story/x)',
      'empty src: <img src="">',
    ].join('\n');
    expect(rebaseRelativeLinks(markdown, 'llms')).toBe(markdown);
  });

  it('leaves fenced code blocks untouched', () => {
    const markdown = [
      'Before [real](real.md).',
      '',
      '```html',
      '<a href="../fenced.md">Fenced</a>',
      '[label](fenced.md)',
      '```',
      '',
      '~~~md',
      '[tilde](../fenced.md)',
      '~~~',
      '',
      'After [tail](tail.md).',
    ].join('\n');
    const rebased = rebaseRelativeLinks(markdown, 'llms');
    expect(rebased).toContain('](llms/real.md)');
    expect(rebased).toContain('](llms/tail.md)');
    expect(rebased).toContain('(../fenced.md)');
    expect(rebased).toContain('(fenced.md)');
  });

  it('leaves targets that collapse to the site root untouched', () => {
    expect(rebaseRelativeLinks('[root](..)', 'llms')).toBe('[root](..)');
  });

  it('rebases links with multi-line labels', () => {
    expect(rebaseRelativeLinks('[multi\nline](x.md)', 'llms')).toBe('[multi\nline](llms/x.md)');
  });
});

describe('collectRelativeLinkTargets', () => {
  it('collects unique relative targets outside fences', () => {
    const targets = collectRelativeLinkTargets(
      [
        '[a](llms/x.md#hash)',
        '[b](llms/x.md)',
        '[c](DESIGN.md)',
        '[d](https://x)',
        '[e](#styles)',
        '',
        '```',
        '[f](fenced.md)',
        '```',
        '',
        '<a href="./h.md">h</a>',
        "and <img src=''>",
      ].join('\n'),
    );
    expect([...targets]).toEqual(['llms/x.md#hash', 'llms/x.md', 'DESIGN.md', './h.md']);
  });
});
