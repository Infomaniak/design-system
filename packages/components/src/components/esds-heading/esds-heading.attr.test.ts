import { describe, expect, it } from 'vitest';
import { EsdsHeadingAttr } from './esds-heading.attr.ts';

EsdsHeadingAttr.define();

describe('EsdsHeadingAttr', () => {
  it('should have css applied', async () => {
    const el = document.body.appendChild(document.createElement('div'));
    el.setAttribute('esds-heading', 'lg');

    await Promise.resolve();

    expect(document.adoptedStyleSheets.length).toBe(1);

    el.removeAttribute('esds-heading');

    await Promise.resolve();

    expect(document.adoptedStyleSheets.length).toBe(0);
  });
});
