import { EsdsSeparatorComponent } from '@infomaniak-design-system/components';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

EsdsSeparatorComponent.define();

async function tick(): Promise<void> {
  await new Promise((resolve: (value: void) => void) => setTimeout(resolve, 0));
}

/**
 * Waits for the `slotchange` event to fire, then for the reactive update it
 * triggers (through the `#hasContent` signal) to complete.
 */
async function settled(el: EsdsSeparatorComponent): Promise<void> {
  await tick();
  await el.updateComplete;
}

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

  describe('slot', () => {
    function getContent(el: EsdsSeparatorComponent): HTMLElement {
      return el.shadowRoot!.querySelector('.content')!;
    }

    it('should hide content wrapper when empty', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(getContent(el).hasAttribute('hidden')).toBe(true);
    });

    it('should show content wrapper when content is present at initial render', async () => {
      const el = document.createElement('esds-separator');
      el.append('OR');
      container.append(el);
      await settled(el);

      expect(getContent(el).hasAttribute('hidden')).toBe(false);
    });

    it('should show content wrapper when slotted content is added', async () => {
      const el = createElement();
      await el.updateComplete;
      el.append('OR');
      await settled(el);

      expect(getContent(el).hasAttribute('hidden')).toBe(false);
    });

    it('should show content wrapper when slotted content is an element', async () => {
      const el = createElement();
      await el.updateComplete;
      const label = document.createElement('span');
      label.textContent = 'OR';
      el.append(label);
      await settled(el);

      expect(getContent(el).hasAttribute('hidden')).toBe(false);
    });

    it('should ignore comment nodes', async () => {
      const el = createElement();
      await el.updateComplete;
      el.append(document.createComment('SSR placeholder'));
      await settled(el);

      expect(getContent(el).hasAttribute('hidden')).toBe(true);
    });

    it('should ignore whitespace-only text nodes', async () => {
      const el = createElement();
      await el.updateComplete;
      el.append('\n  ');
      await settled(el);

      expect(getContent(el).hasAttribute('hidden')).toBe(true);
    });

    it('should hide content wrapper again when slotted content is removed', async () => {
      const el = createElement();
      el.append('OR');
      await settled(el);
      expect(getContent(el).hasAttribute('hidden')).toBe(false);

      el.textContent = '';
      await settled(el);

      expect(getContent(el).hasAttribute('hidden')).toBe(true);
    });

    it('should keep content visible when adding more slotted content', async () => {
      const el = createElement();
      el.append('OR');
      await settled(el);

      const renderBefore = el.shadowRoot!.querySelector('.separator');
      el.append('AND');
      await settled(el);

      expect(getContent(el).hasAttribute('hidden')).toBe(false);
      expect(el.shadowRoot!.querySelector('.separator')).toBe(renderBefore);
    });
  });

  describe('shadow structure', () => {
    it('should render two lines and no CSS parts', async () => {
      const el = createElement();
      await el.updateComplete;

      const shadow = el.shadowRoot!;
      expect(shadow.querySelectorAll('.line').length).toBe(2);
      expect(shadow.querySelector('.separator')).not.toBeNull();
      expect(shadow.querySelector('.content')).not.toBeNull();
      expect(shadow.querySelector('[part]')).toBeNull();
    });
  });
});
