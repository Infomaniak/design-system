import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EsdsAvatarComponent } from './esds-avatar.component.ts';

const styles: string = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'esds-avatar.component.css'),
  'utf8',
);

EsdsAvatarComponent.define();

describe('EsdsAvatarComponent', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  function createElement(): EsdsAvatarComponent {
    const el = document.createElement('esds-avatar');
    container.append(el);
    return el;
  }

  it('should be constructible and registered', () => {
    const el = createElement();
    expect(el).instanceOf(EsdsAvatarComponent);
    expect(customElements.get('esds-avatar')).toBe(EsdsAvatarComponent);
  });

  it('should also register the nested icon component when defined', () => {
    expect(customElements.get('esds-icon')).toBeDefined();
    expect(() => EsdsAvatarComponent.define()).not.toThrow();
  });

  describe('content rendering', () => {
    it('should render a fallback user icon when no content is provided', async () => {
      const el = createElement();
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector('esds-icon');
      expect(icon).not.toBeNull();
      expect(icon?.getAttribute('name')).toBe('esds:user');
      expect(el.shadowRoot?.querySelector('img')).toBeNull();
      expect(el.shadowRoot?.querySelector('.initials')).toBeNull();
    });

    it('should render initials', async () => {
      const el = createElement();
      el.initials = 'AB';
      await el.updateComplete;

      const initials = el.shadowRoot?.querySelector('.initials');
      expect(initials?.textContent?.trim()).toBe('AB');
      expect(el.shadowRoot?.querySelector('img')).toBeNull();
      expect(el.shadowRoot?.querySelector('esds-icon')).toBeNull();
    });

    it('should render an icon', async () => {
      const el = createElement();
      el.icon = 'esds:user';
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector('esds-icon');
      expect(icon?.getAttribute('name')).toBe('esds:user');
      expect(el.shadowRoot?.querySelector('img')).toBeNull();
      expect(el.shadowRoot?.querySelector('.initials')).toBeNull();
    });

    it('should render an image', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      await el.updateComplete;

      const img = el.shadowRoot?.querySelector('img');
      expect(img?.getAttribute('src')).toBe('https://example.com/me.png');

      img?.dispatchEvent(new Event('load'));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('esds-icon')).toBeNull();
      expect(el.shadowRoot?.querySelector('.initials')).toBeNull();
    });

    it('should accept content set through attributes', async () => {
      const el = document.createElement('esds-avatar');
      el.setAttribute('initials', 'CD');
      container.append(el);
      await el.updateComplete;

      expect(el.initials).toBe('CD');
      expect(el.shadowRoot?.querySelector('.initials')?.textContent?.trim()).toBe('CD');
    });
  });

  describe('content priority', () => {
    it('should prioritize image over icon and initials', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      el.icon = 'esds:user';
      el.initials = 'AB';
      await el.updateComplete;

      el.shadowRoot?.querySelector('img')?.dispatchEvent(new Event('load'));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('img')).not.toBeNull();
      expect(el.shadowRoot?.querySelector('esds-icon')).toBeNull();
      expect(el.shadowRoot?.querySelector('.initials')).toBeNull();
    });

    it('should prioritize icon over initials', async () => {
      const el = createElement();
      el.icon = 'esds:user';
      el.initials = 'AB';
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('esds-icon')).not.toBeNull();
      expect(el.shadowRoot?.querySelector('.initials')).toBeNull();
    });

    it('should switch to the image when set after another content', async () => {
      const el = createElement();
      el.initials = 'AB';
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('.initials')).not.toBeNull();

      el.image = 'https://example.com/me.png';
      await el.updateComplete;

      el.shadowRoot?.querySelector('img')?.dispatchEvent(new Event('load'));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('img')).not.toBeNull();
      expect(el.shadowRoot?.querySelector('.initials')).toBeNull();
    });

    it('should fall back to the default icon when the image is removed', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('img')).not.toBeNull();

      el.image = undefined;
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector('esds-icon');
      expect(icon?.getAttribute('name')).toBe('esds:user');
    });
  });

  describe('image fallback', () => {
    it('should render a fallback while the image is loading', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      el.initials = 'AB';
      await el.updateComplete;

      const img = el.shadowRoot?.querySelector('img');
      expect(img).not.toBeNull();
      expect(img?.hasAttribute('hidden')).toBe(true);
      expect(el.shadowRoot?.querySelector('.initials')?.textContent?.trim()).toBe('AB');
      expect(el.getAttribute('data-image-state')).toBe('loading');
    });

    it('should reveal the image once loaded', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      el.initials = 'AB';
      await el.updateComplete;

      el.shadowRoot?.querySelector('img')?.dispatchEvent(new Event('load'));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('img')?.hasAttribute('hidden')).toBe(false);
      expect(el.shadowRoot?.querySelector('.initials')).toBeNull();
      expect(el.getAttribute('data-image-state')).toBe('loaded');
    });

    it('should fall back to the initials when the image fails to load', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      el.initials = 'AB';
      await el.updateComplete;

      el.shadowRoot?.querySelector('img')?.dispatchEvent(new Event('error'));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.initials')?.textContent?.trim()).toBe('AB');
      expect(el.shadowRoot?.querySelector('img')?.hasAttribute('hidden')).toBe(true);
      expect(el.getAttribute('data-image-state')).toBe('error');
    });

    it('should fall back to the icon when the image fails to load', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      el.icon = 'esds:user';
      el.initials = 'AB';
      await el.updateComplete;

      el.shadowRoot?.querySelector('img')?.dispatchEvent(new Event('error'));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('esds-icon')?.getAttribute('name')).toBe('esds:user');
      expect(el.shadowRoot?.querySelector('.initials')).toBeNull();
      expect(el.getAttribute('data-image-state')).toBe('error');
    });

    it('should fall back to the default user icon when the image fails to load', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      await el.updateComplete;

      el.shadowRoot?.querySelector('img')?.dispatchEvent(new Event('error'));
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector('esds-icon');
      expect(icon?.getAttribute('name')).toBe('esds:user');
      expect(el.getAttribute('data-image-state')).toBe('error');
    });

    it('should reset the state to loading when the image changes', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      el.initials = 'AB';
      await el.updateComplete;

      el.shadowRoot?.querySelector('img')?.dispatchEvent(new Event('load'));
      await el.updateComplete;
      expect(el.getAttribute('data-image-state')).toBe('loaded');

      el.image = 'https://example.com/other.png';
      await el.updateComplete;

      expect(el.getAttribute('data-image-state')).toBe('loading');
      expect(el.shadowRoot?.querySelector('img')?.hasAttribute('hidden')).toBe(true);
      expect(el.shadowRoot?.querySelector('.initials')?.textContent?.trim()).toBe('AB');
    });

    it('should remove the image state when the image is removed', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      await el.updateComplete;

      el.shadowRoot?.querySelector('img')?.dispatchEvent(new Event('error'));
      await el.updateComplete;

      el.image = undefined;
      await el.updateComplete;

      expect(el.getAttribute('data-image-state')).toBeNull();
      expect(el.shadowRoot?.querySelector('img')).toBeNull();
    });

    it('should label the fallback exposed while the image is loading', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      el.initials = 'AB';
      el.label = 'Valentin Dupont';
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.initials')?.getAttribute('aria-label')).toBe(
        'Valentin Dupont',
      );
      expect(el.getAttribute('data-image-state')).toBe('loading');
    });
  });

  describe('a11y', () => {
    it('should expose the image content as an image with a default label', async () => {
      const el = createElement();
      el.image = 'https://example.com/me.png';
      await el.updateComplete;

      const img = el.shadowRoot?.querySelector('img');
      expect(img?.getAttribute('role')).toBe('img');
      expect(img?.getAttribute('alt')).toBe('avatar with image');
      expect(img?.getAttribute('aria-label')).toBe('avatar with image');
    });

    it('should label the icon content by default', async () => {
      const el = createElement();
      el.icon = 'esds:user';
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector('esds-icon');
      expect(icon?.getAttribute('role')).toBe('img');
      expect(icon?.getAttribute('aria-label')).toBe('avatar with icon');
    });

    it('should label the initials content with the initials by default', async () => {
      const el = createElement();
      el.initials = 'AB';
      await el.updateComplete;

      const initials = el.shadowRoot?.querySelector('.initials');
      expect(initials?.getAttribute('role')).toBe('img');
      expect(initials?.getAttribute('aria-label')).toBe('avatar with initials: AB');
    });

    it('should label the fallback icon content by default', async () => {
      const el = createElement();
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector('esds-icon');
      expect(icon?.getAttribute('aria-label')).toBe('avatar with icon');
    });

    it('should override every default label with the provided label', async () => {
      const el = createElement();
      el.label = 'Valentin Dupont';

      el.image = 'https://example.com/me.png';
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('img')?.getAttribute('alt')).toBe('Valentin Dupont');

      el.image = undefined;
      el.initials = 'VD';
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('.initials')?.getAttribute('aria-label')).toBe(
        'Valentin Dupont',
      );

      el.initials = undefined;
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('esds-icon')?.getAttribute('aria-label')).toBe(
        'Valentin Dupont',
      );
    });

    it('should not reflect the label attribute', async () => {
      const el = createElement();
      el.label = 'Valentin Dupont';
      await el.updateComplete;

      expect(el.hasAttribute('label')).toBe(false);
    });
  });

  describe('layout', () => {
    it('should be circular by default', () => {
      expect(styles).toContain('border-radius: var(--esds-avatar-border-radius-circle)');
    });

    it('should support a square shape through the shape attribute', () => {
      expect(styles).toContain(`:host([shape='square'])`);
      expect(styles).toContain('border-radius: var(--esds-avatar-border-radius-square)');
    });

    it('should make the image fill the avatar without distortion', () => {
      expect(styles).toContain('height: 100%');
      expect(styles).toContain('width: 100%');
      expect(styles).toContain('object-fit: cover');
    });

    it('should clip overflowing content', () => {
      expect(styles).toContain('overflow: hidden');
    });
  });
});
