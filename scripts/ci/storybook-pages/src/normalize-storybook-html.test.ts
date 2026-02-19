import { describe, expect, it } from 'vitest';
import { normalizeStorybookIframeHtml } from './normalize-storybook-html.ts';

describe('normalizeStorybookIframeHtml', () => {
  it('rewrites absolute vite mocker entry script path to relative path', () => {
    const html = `<html><head><script type="module" src="/vite-inject-mocker-entry.js"></script></head></html>`;

    expect(normalizeStorybookIframeHtml(html)).toContain('src="./vite-inject-mocker-entry.js"');
  });

  it('does not change html when script is already relative', () => {
    const html = `<html><head><script type="module" src="./vite-inject-mocker-entry.js"></script></head></html>`;

    expect(normalizeStorybookIframeHtml(html)).toBe(html);
  });
});
