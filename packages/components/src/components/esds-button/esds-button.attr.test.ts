import { describe, expect, it } from 'vitest';
import { EsdsButtonAttr } from './esds-button.attr.ts';

EsdsButtonAttr.define();

describe('EsdsButtonAttr', () => {
  it('should keep an author-defined aria-label on connect (anchor)', async () => {
    const el = document.createElement('a');
    el.href = '#';
    el.setAttribute('esds-button', '');
    el.setAttribute('aria-label', 'open link 1');
    el.textContent = 'open';

    document.body.appendChild(el);

    await Promise.resolve();

    expect(el.getAttribute('aria-label')).toBe('open link 1');
  });

  it('should keep an author-defined aria-label after a loading round-trip (anchor)', async () => {
    const el = document.createElement('a');
    el.href = '#';
    el.setAttribute('esds-button', '');
    el.setAttribute('aria-label', 'open link 2');
    el.textContent = 'open';

    document.body.appendChild(el);

    await Promise.resolve();

    el.setAttribute('loading', '');

    await Promise.resolve();

    el.removeAttribute('loading');

    await Promise.resolve();

    expect(el.getAttribute('aria-label')).toBe('open link 2');
  });

  it('should announce the text content while loading when no author-defined aria-label exists (anchor)', async () => {
    const el = document.createElement('a');
    el.href = '#';
    el.setAttribute('esds-button', '');
    el.textContent = 'open link 3';

    document.body.appendChild(el);

    await Promise.resolve();

    el.setAttribute('loading', '');

    await Promise.resolve();

    expect(el.getAttribute('aria-label')).toBe('open link 3');

    el.removeAttribute('loading');

    await Promise.resolve();

    expect(el.getAttribute('aria-label')).toBeNull();
  });

  it('should keep an author-defined aria-label on connect (button)', async () => {
    const el = document.createElement('button');
    el.setAttribute('esds-button', '');
    el.setAttribute('aria-label', 'open link 4');
    el.textContent = 'open';

    document.body.appendChild(el);

    await Promise.resolve();

    expect(el.getAttribute('aria-label')).toBe('open link 4');
  });
});
