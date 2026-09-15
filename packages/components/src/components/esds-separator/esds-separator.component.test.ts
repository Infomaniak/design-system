import { EsdsSeparatorComponent } from '@infomaniak-design-system/components';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

EsdsSeparatorComponent.define();

describe('EsdsSeparatorComponent', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  function createElement(): EsdsSeparatorComponent {
    const el = document.createElement('esds-separator');
    container.append(el);
    return el;
  }

  it('should be constructible and registered', () => {
    const el = createElement();
    expect(el).instanceOf(EsdsSeparatorComponent);
    expect(customElements.get('esds-separator')).toBe(EsdsSeparatorComponent);
  });

  it('should not throw when defined twice', () => {
    expect(() => EsdsSeparatorComponent.define()).not.toThrow();
  });

  describe('a11y', () => {
    it('should default to horizontal separator role', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.orientation).toBe('horizontal');
      expect(el.decorative).toBe(false);
      expect(el.getAttribute('role')).toBe('separator');
      expect(el.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should reflect vertical orientation', async () => {
      const el = createElement();
      el.orientation = 'vertical';
      await el.updateComplete;

      expect(el.hasAttribute('orientation')).toBe(true);
      expect(el.getAttribute('orientation')).toBe('vertical');
      expect(el.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should treat unknown orientation as horizontal', async () => {
      const el = createElement();
      el.setAttribute('orientation', 'diagonal');
      await el.updateComplete;

      expect(el.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should use presentation role when decorative', async () => {
      const el = createElement();
      el.decorative = true;
      await el.updateComplete;

      expect(el.hasAttribute('decorative')).toBe(true);
      expect(el.getAttribute('role')).toBe('presentation');
      expect(el.hasAttribute('aria-orientation')).toBe(false);
    });

    it('should restore separator role when not decorative anymore', async () => {
      const el = createElement();
      el.decorative = true;
      await el.updateComplete;
      el.decorative = false;
      await el.updateComplete;

      expect(el.getAttribute('role')).toBe('separator');
      expect(el.getAttribute('aria-orientation')).toBe('horizontal');
    });
  });

  describe('shadow structure', () => {
    it('should render a single line and no CSS parts', async () => {
      const el = createElement();
      await el.updateComplete;

      const shadow = el.shadowRoot!;
      expect(shadow.querySelectorAll('.line').length).toBe(1);
      expect(shadow.querySelector('.separator')).not.toBeNull();
      expect(shadow.querySelector('[part]')).toBeNull();
    });
  });
});
