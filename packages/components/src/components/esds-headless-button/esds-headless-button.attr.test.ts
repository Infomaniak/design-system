import { describe, expect, it, vi } from 'vitest';
import { EsdsHeadlessButtonAttr } from './esds-headless-button.attr.ts';

EsdsHeadlessButtonAttr.define();

const flush = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve));
};

const createButtonElement = (): HTMLButtonElement => {
  const el = document.createElement('button');
  el.setAttribute('esds-headless-button', '');

  return el;
};

const createAnchorElement = (): HTMLAnchorElement => {
  const el = document.createElement('a');
  el.setAttribute('esds-headless-button', '');

  return el;
};

describe('EsdsHeadlessButtonAttr', () => {
  it('should throw when constructed on a non-interactive element', () => {
    const el = document.createElement('span');
    el.setAttribute('esds-headless-button', '');

    const attr = el.attributes.getNamedItem('esds-headless-button')!;

    expect(() => new EsdsHeadlessButtonAttr(attr)).toThrow(
      'esds-headless-button attribute can only be used on <button> or <a> elements',
    );
  });

  it('should not inject any css', async () => {
    const el = document.body.appendChild(createButtonElement());

    await flush();

    expect(document.adoptedStyleSheets.length).toBe(0);

    el.remove();
    await flush();
  });

  it('should turn an anchor into a button semantically', async () => {
    const el = document.body.appendChild(createAnchorElement());

    await flush();

    expect(el.getAttribute('role')).toBe('button');

    el.remove();
    await flush();
  });

  it('should call click() exactly once per Space press on an enabled anchor', async () => {
    const el = document.body.appendChild(createAnchorElement());
    el.href = '#';

    await flush();

    const click = vi.spyOn(el, 'click');
    el.dispatchEvent(new KeyboardEvent('keypress', { code: 'Space' }));

    expect(click).toHaveBeenCalledTimes(1);

    el.remove();
    await flush();
  });

  it('should not call click() on Space press when the anchor is disabled', async () => {
    const el = document.body.appendChild(createAnchorElement());
    el.setAttribute('disabled', '');

    await flush();

    const click = vi.spyOn(el, 'click');
    el.dispatchEvent(new KeyboardEvent('keypress', { code: 'Space' }));

    expect(click).not.toHaveBeenCalled();

    el.remove();
    await flush();
  });

  it('should not call click() on other key presses', async () => {
    const el = document.body.appendChild(createAnchorElement());

    await flush();

    const click = vi.spyOn(el, 'click');
    el.dispatchEvent(new KeyboardEvent('keypress', { code: 'Enter' }));

    expect(click).not.toHaveBeenCalled();

    el.remove();
    await flush();
  });

  it('should not make an enabled element inert on press', async () => {
    const el = document.body.appendChild(createButtonElement());

    await flush();

    const event = new Event('pointerdown', { cancelable: true });
    el.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(el.hasAttribute('inert')).toBe(false);

    el.remove();
  });

  it('should make a disabled element inert on press and restore it on release', async () => {
    const el = document.body.appendChild(createButtonElement());
    el.setAttribute('disabled', '');

    await flush();

    const event = new Event('pointerdown', { cancelable: true });
    el.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(el.hasAttribute('inert')).toBe(true);

    window.dispatchEvent(new Event('pointerup'));

    expect(el.hasAttribute('inert')).toBe(false);

    el.remove();
  });

  it('should make a loading element inert on key press and restore focus on release', async () => {
    const el = document.body.appendChild(createButtonElement());
    el.setAttribute('loading', '');

    await flush();

    el.dispatchEvent(new Event('keydown', { cancelable: true }));
    expect(el.hasAttribute('inert')).toBe(true);

    const focus = vi.spyOn(el, 'focus');
    window.dispatchEvent(new Event('keyup'));

    expect(el.hasAttribute('inert')).toBe(false);
    expect(focus).toHaveBeenCalledTimes(1);

    el.remove();
  });

  it('should mirror disabled/loading to aria attributes and save/restore tabindex on anchors', async () => {
    const el = document.body.appendChild(createAnchorElement());
    el.textContent = 'Link';

    await flush();

    el.setAttribute('disabled', '');
    await flush();

    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.hasAttribute('aria-busy')).toBe(false);
    expect(el.getAttribute('tabindex')).toBe('-1');

    el.setAttribute('loading', '');
    await flush();

    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.getAttribute('aria-label')).toBe('Link');

    el.removeAttribute('disabled');
    await flush();

    // `loading` alone keeps the element "disabled or loading": aria-disabled stays.
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.getAttribute('aria-label')).toBe('Link');

    el.removeAttribute('loading');
    await flush();

    expect(el.hasAttribute('aria-disabled')).toBe(false);
    expect(el.hasAttribute('aria-busy')).toBe(false);
    expect(el.hasAttribute('aria-label')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);

    el.remove();
    await flush();
  });

  it('should restore a user-defined tabindex on anchors', async () => {
    const el = document.body.appendChild(createAnchorElement());
    el.setAttribute('tabindex', '0');

    await flush();

    el.setAttribute('disabled', '');
    await flush();

    expect(el.getAttribute('tabindex')).toBe('-1');

    el.removeAttribute('disabled');
    await flush();

    expect(el.getAttribute('tabindex')).toBe('0');

    el.remove();
    await flush();
  });

  it('should drop the tabindex it introduced when no user-defined tabindex exists', async () => {
    const el = document.body.appendChild(createAnchorElement());

    await flush();

    el.setAttribute('disabled', '');
    await flush();

    expect(el.getAttribute('tabindex')).toBe('-1');

    el.removeAttribute('disabled');
    await flush();

    expect(el.hasAttribute('tabindex')).toBe(false);

    el.remove();
    await flush();
  });

  it('should stop syncing the state after disconnection', async () => {
    const el = document.body.appendChild(createAnchorElement());

    await flush();

    el.remove();
    await flush();

    el.setAttribute('disabled', '');
    await flush();

    expect(el.hasAttribute('aria-disabled')).toBe(false);
  });
});
