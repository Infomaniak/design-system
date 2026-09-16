import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EsdsSeparatorComponent } from './esds-separator.component.ts';

const styles: string = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'esds-separator.component.css'),
  'utf8',
);

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

    it('should update aria-orientation when orientation changes after first render', async () => {
      const el = createElement();
      await el.updateComplete;

      expect(el.getAttribute('role')).toBe('separator');
      expect(el.getAttribute('aria-orientation')).toBe('horizontal');

      el.orientation = 'vertical';
      await el.updateComplete;

      expect(el.getAttribute('role')).toBe('separator');
      expect(el.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should treat unknown orientation as horizontal', async () => {
      const el = createElement();
      el.setAttribute('orientation', 'diagonal');
      await el.updateComplete;

      expect(el.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should hide from the accessibility tree when decorative', async () => {
      const el = createElement();
      el.decorative = true;
      await el.updateComplete;

      expect(el.hasAttribute('decorative')).toBe(true);
      expect(el.getAttribute('role')).toBe('separator');
      expect(el.hasAttribute('aria-hidden')).toBe(true);
      expect(el.hasAttribute('aria-orientation')).toBe(false);
    });

    it('should hide when decorative is set after first render', async () => {
      const el = createElement();
      await el.updateComplete;

      el.decorative = true;
      await el.updateComplete;

      expect(el.hasAttribute('aria-hidden')).toBe(true);
      expect(el.hasAttribute('aria-orientation')).toBe(false);
    });

    it('should unhide when decorative is removed', async () => {
      const el = createElement();
      el.decorative = true;
      await el.updateComplete;
      el.decorative = false;
      await el.updateComplete;

      expect(el.hasAttribute('aria-hidden')).toBe(false);
      expect(el.getAttribute('role')).toBe('separator');
      expect(el.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should respect a consumer role set before first render', async () => {
      const el = document.createElement('esds-separator');
      el.setAttribute('role', 'menuitem');
      container.append(el);
      await el.updateComplete;

      expect(el.getAttribute('role')).toBe('menuitem');
      expect(el.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should not overwrite a consumer role set after first render', async () => {
      const el = createElement();
      await el.updateComplete;
      el.setAttribute('role', 'menuitem');

      el.orientation = 'vertical';
      el.decorative = true;
      await el.updateComplete;

      expect(el.getAttribute('role')).toBe('menuitem');
      expect(el.hasAttribute('aria-hidden')).toBe(true);
    });
  });

  describe('layout', () => {
    it('should be full-width horizontally', () => {
      expect(styles).toContain('width: 100%');
    });

    it('should stretch as a flex item vertically', () => {
      expect(styles).toContain('align-self: stretch');
      expect(styles).toContain('height: auto');
    });

    it('should size the separator with the thickness token in both orientations', () => {
      expect(styles).toContain('height: var(--esds-separator-thickness)');
      expect(styles).toContain('width: var(--esds-separator-thickness)');
    });
  });

  describe('shadow structure', () => {
    it('should render no shadow content and expose no CSS parts', async () => {
      const el = createElement();
      await el.updateComplete;

      const shadow = el.shadowRoot!;
      expect(Array.from(shadow.children).every((node) => node.tagName === 'STYLE')).toBe(true);
      expect(shadow.querySelector('.line')).toBeNull();
      expect(shadow.querySelector('.separator')).toBeNull();
      expect(shadow.querySelector('[part]')).toBeNull();
    });

    it('should ignore light DOM children', async () => {
      const el = createElement();
      el.innerHTML = '<span>label</span>';
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('slot')).toBeNull();
    });
  });
});
