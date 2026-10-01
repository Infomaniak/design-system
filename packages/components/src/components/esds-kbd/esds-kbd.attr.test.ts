import { describe, expect, it } from 'vitest';
import { EsdsKbdAttr } from './esds-kbd.attr.ts';

EsdsKbdAttr.define();

describe('EsdsKbdAttr', () => {
  it('should throw when constructed on a non-<kbd> element', () => {
    const el = document.createElement('span');
    el.setAttribute('esds-kbd', '');

    const attr = el.attributes.getNamedItem('esds-kbd')!;

    expect(() => new EsdsKbdAttr(attr)).toThrow(
      'esds-kbd attribute can only be used on <kbd> elements',
    );
  });

  it('should have css applied', async () => {
    const el = document.body.appendChild(document.createElement('kbd'));
    el.setAttribute('esds-kbd', '');

    await Promise.resolve();

    expect(document.adoptedStyleSheets.length).toBe(1);

    el.removeAttribute('esds-kbd');

    await Promise.resolve();

    expect(document.adoptedStyleSheets.length).toBe(0);
  });
});
