import { describe, expect, it } from 'vitest';
import { EsdsBodyAttr } from './esds-body.attr.ts';

EsdsBodyAttr.define();

describe('EsdsBodyAttr', () => {
  it('should have css applied', async () => {
    const el = document.body.appendChild(document.createElement('div'));
    el.setAttribute('esds-body', 'sm');

    await Promise.resolve();

    expect(document.adoptedStyleSheets.length).toBe(1);

    el.removeAttribute('esds-body');

    await Promise.resolve();

    expect(document.adoptedStyleSheets.length).toBe(0);
  });
});
