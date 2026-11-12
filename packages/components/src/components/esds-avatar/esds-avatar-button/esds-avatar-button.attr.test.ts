import { describe, expect, it, vi } from 'vitest';
import { EsdsAvatarButtonAttr } from './esds-avatar-button.attr.ts';

EsdsAvatarButtonAttr.define();

const flush = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve));
};

describe('EsdsAvatarButtonAttr', () => {
  it('should throw when constructed on a non-interactive element', () => {
    const el = document.createElement('span');
    el.setAttribute('esds-avatar-button', '');

    const attr = el.attributes.getNamedItem('esds-avatar-button')!;

    expect(() => new EsdsAvatarButtonAttr(attr)).toThrow(
      'esds-avatar-button attribute can only be used on <button> or <a> elements',
    );
  });

  it('should inject css and clean it up on disconnect', async () => {
    const el = document.body.appendChild(document.createElement('button'));
    el.setAttribute('esds-avatar-button', '');

    await flush();

    expect(document.adoptedStyleSheets.length).toBe(1);

    el.remove();
    await flush();

    expect(document.adoptedStyleSheets.length).toBe(0);
  });

  it('should inherit the button behavior from the headless attribute', async () => {
    const el = document.body.appendChild(document.createElement('a'));
    el.setAttribute('esds-avatar-button', '');

    await flush();

    expect(el.getAttribute('role')).toBe('button');

    const click = vi.spyOn(el, 'click');
    el.dispatchEvent(new KeyboardEvent('keypress', { code: 'Space' }));

    expect(click).toHaveBeenCalledTimes(1);

    el.remove();
    await flush();
  });
});
