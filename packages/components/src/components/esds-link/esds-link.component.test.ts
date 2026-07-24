import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EsdsLinkComponent } from './esds-link.component.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSS_CONTENT = readFileSync(join(__dirname, 'esds-link.component.css'), 'utf-8');

EsdsLinkComponent.define();

describe('EsdsLinkComponent', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  it('should be constructible and registered', () => {
    const el = document.createElement('esds-link');
    expect(el).instanceOf(EsdsLinkComponent);
  });

  describe('attributes', () => {
    it('should reflect href to the anchor', async () => {
      const el = document.createElement('esds-link');
      el.href = 'https://example.com';
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('href')).toBe('https://example.com');
    });

    it('should not set href attribute when href is empty', async () => {
      const el = document.createElement('esds-link');
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.hasAttribute('href')).toBe(false);
    });

    it('should reflect aria-label to the anchor', async () => {
      const el = document.createElement('esds-link');
      el.ariaLabel = 'Label text';
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('aria-label')).toBe('Label text');
    });

    it('should reflect aria-current to the anchor', async () => {
      const el = document.createElement('esds-link');
      el.ariaCurrent = 'page';
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('aria-current')).toBe('page');
    });

    it('should reflect title to the anchor', async () => {
      const el = document.createElement('esds-link');
      el.title = 'Tooltip text';
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('title')).toBe('Tooltip text');
    });

    it('should reflect referrerpolicy to the anchor', async () => {
      const el = document.createElement('esds-link');
      el.referrerPolicy = 'no-referrer';
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('referrerpolicy')).toBe('no-referrer');
    });

    it('should reflect target to the anchor', async () => {
      const el = document.createElement('esds-link');
      el.target = '_blank';
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('target')).toBe('_blank');
    });

    it('should not set target attribute when target is empty', async () => {
      const el = document.createElement('esds-link');
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.hasAttribute('target')).toBe(false);
    });

    it('should reflect download to the anchor', async () => {
      const el = document.createElement('esds-link');
      el.download = 'file.pdf';
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('download')).toBe('file.pdf');
    });

    it('should not set download attribute when download is not set', async () => {
      const el = document.createElement('esds-link');
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.hasAttribute('download')).toBe(false);
    });

    it('should set empty download attribute when download is explicitly empty', async () => {
      const el = document.createElement('esds-link');
      el.setAttribute('download', '');
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.hasAttribute('download')).toBe(true);
      expect(anchor?.getAttribute('download')).toBe('');
    });

    it('should not set rel when target is not _blank and no rel provided', async () => {
      const el = document.createElement('esds-link');
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('rel')).toBeNull();
    });

    it('should reflect custom rel', async () => {
      const el = document.createElement('esds-link');
      el.rel = 'nofollow';
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('rel')).toBe('nofollow');
    });

    it('should auto-add noopener noreferrer when target is _blank and no rel attribute is set', async () => {
      const el = document.createElement('esds-link');
      el.target = '_blank';
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('should NOT auto-add noopener noreferrer when target is _blank but rel is set to empty string', async () => {
      const el = document.createElement('esds-link');
      el.target = '_blank';
      el.setAttribute('rel', '');
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('rel')).toBeNull();
    });

    it('should NOT auto-add noopener noreferrer when target is _blank and custom rel is set', async () => {
      const el = document.createElement('esds-link');
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'nofollow');
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('rel')).toBe('nofollow');
    });

    it('should reflect rel after JS property change', async () => {
      const el = document.createElement('esds-link');
      el.target = '_blank';
      container.append(el);
      await el.updateComplete;

      // Initially auto-add
      expect(el.shadowRoot?.querySelector('a')?.getAttribute('rel')).toBe('noopener noreferrer');

      // Set rel property - should reflect to attribute and override auto
      el.rel = 'nofollow';
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('a')?.getAttribute('rel')).toBe('nofollow');
      expect(el.getAttribute('rel')).toBe('nofollow');
    });
  });

  describe('slot', () => {
    it('should project slot content into the anchor', async () => {
      const el = document.createElement('esds-link');
      container.append(el);
      el.appendChild(document.createTextNode('Link text'));
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor?.querySelector('slot')).toBeInstanceOf(HTMLSlotElement);
      expect(el.childNodes[0]?.textContent?.trim()).toBe('Link text');
    });

    it('should render anchor when no slot content is provided', async () => {
      const el = document.createElement('esds-link');
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a');
      expect(anchor).toBeInstanceOf(HTMLAnchorElement);
    });
  });

  describe('styles', () => {
    it('should apply inline-flex display with gap to the anchor', () => {
      expect(CSS_CONTENT).toContain('display: inline-flex');
      expect(CSS_CONTENT).toContain('gap: var(--esds-spacing-xs)');
      expect(CSS_CONTENT).toContain('white-space: nowrap');
    });
  });

  describe('events', () => {
    it('should dispatch esds-link-click on anchor click', async () => {
      const el = document.createElement('esds-link');
      el.href = '#';
      container.append(el);
      await el.updateComplete;

      const clickSpy = vi.fn();
      el.addEventListener('esds-link-click', clickSpy);

      const anchor = el.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      const mouseEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      anchor.dispatchEvent(mouseEvent);

      expect(clickSpy).toHaveBeenCalledTimes(1);
      const event = clickSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('esds-link-click');
      expect(event.cancelable).toBe(true);
      expect(event.composed).toBe(true);
      expect(event.bubbles).toBe(true);
      expect(event.detail.nativeEvent).toBeInstanceOf(MouseEvent);
    });

    it('should prevent native navigation when custom event is canceled', async () => {
      const el = document.createElement('esds-link');
      el.href = '#';
      container.append(el);
      await el.updateComplete;

      el.addEventListener('esds-link-click', (e: Event) => {
        e.preventDefault();
      });

      const anchor = el.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      const mouseEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      anchor.dispatchEvent(mouseEvent);

      expect(mouseEvent.defaultPrevented).toBe(true);
    });

    it('should not prevent native navigation when custom event is not canceled', async () => {
      const el = document.createElement('esds-link');
      el.href = '#';
      container.append(el);
      await el.updateComplete;

      const anchor = el.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      const mouseEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      anchor.dispatchEvent(mouseEvent);

      expect(mouseEvent.defaultPrevented).toBe(false);
    });

    it('should warn when href is empty', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const el = document.createElement('esds-link');
      container.append(el);
      await el.updateComplete;

      expect(warnSpy).toHaveBeenCalledOnce();
      expect(warnSpy).toHaveBeenCalledWith(
        '[esds-link] Missing "href" attribute — the link will not be keyboard accessible.',
      );
      warnSpy.mockRestore();
    });
  });
});
