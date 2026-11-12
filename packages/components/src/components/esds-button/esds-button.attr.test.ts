import { describe, expect, it, vi } from 'vitest';
import { EsdsButtonAttr } from './esds-button.attr.ts';

EsdsButtonAttr.define();

const flush = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve));
};

describe('EsdsButtonAttr', () => {
  it('should throw when constructed on a non-interactive element', () => {
    const el = document.createElement('span');
    el.setAttribute('esds-button', '');

    const attr = el.attributes.getNamedItem('esds-button')!;

    expect(() => new EsdsButtonAttr(attr)).toThrow(
      'esds-button attribute can only be used on <button> or <a> elements',
    );
  });

  it('should inject css and clean it up on disconnect', async () => {
    const el = document.body.appendChild(document.createElement('button'));
    el.setAttribute('esds-button', '');

    await flush();

    expect(document.adoptedStyleSheets.length).toBe(1);

    el.remove();
    await flush();

    expect(document.adoptedStyleSheets.length).toBe(0);
  });

  it('should keep the button behavior when used on an anchor', async () => {
    const el = document.body.appendChild(document.createElement('a'));
    el.setAttribute('esds-button', '');

    await flush();

    expect(el.getAttribute('role')).toBe('button');

    const click = vi.spyOn(el, 'click');
    el.dispatchEvent(new KeyboardEvent('keypress', { code: 'Space' }));

    expect(click).toHaveBeenCalledTimes(1);

    el.remove();
    await flush();
  });
});
