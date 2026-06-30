import { IconifyApi } from '@infomaniak-design-system/components';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EsdsIconComponent } from './esds-icon.component.ts';

EsdsIconComponent.define();

describe('EsdsIconComponent', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  it('should be constructible and registered', () => {
    const el = document.createElement('esds-icon-lit');
    expect(el).instanceOf(EsdsIconComponent);
  });

  describe('lazy loading via IntersectionObserver', () => {
    let mockObserve: ReturnType<typeof vi.fn>;
    let mockDisconnect: ReturnType<typeof vi.fn>;
    let observerInstances: MockIntersectionObserver[] = [];

    class MockIntersectionObserver {
      callback: (entries: IntersectionObserverEntry[]) => void;
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = vi.fn();
      takeRecords = vi.fn();
      root = null;
      rootMargin = '';
      thresholds: number[] = [];

      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        this.callback = callback;
        observerInstances.push(this);
      }
    }

    beforeEach(() => {
      mockObserve = vi.fn();
      mockDisconnect = vi.fn();
      observerInstances = [];
      global.IntersectionObserver =
        MockIntersectionObserver as unknown as typeof IntersectionObserver;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create IntersectionObserver when not nolazy', async () => {
      const el = document.createElement('esds-icon-lit');
      el.name = 'test-prefix:my-icon';
      container.append(el);
      await el.updateComplete;
      expect(mockObserve).toHaveBeenCalledWith(el);
    });

    it('should load icon when element intersects', async () => {
      vi.spyOn(IconifyApi.prototype, 'getSVG').mockResolvedValue('<svg></svg>');
      const el = document.createElement('esds-icon-lit');
      el.name = 'test-prefix:my-icon';
      container.append(el);
      await el.updateComplete;

      observerInstances[0].callback([{ isIntersecting: true } as IntersectionObserverEntry]);
      await new Promise((r) => setTimeout(r, 0));

      expect(IconifyApi.prototype.getSVG).toHaveBeenCalledWith({
        prefix: 'test-prefix',
        name: 'my-icon',
        signal: expect.any(AbortSignal),
      });
    });

    it('should not load icon when element does not intersect', async () => {
      vi.spyOn(IconifyApi.prototype, 'getSVG').mockResolvedValue('<svg></svg>');
      const el = document.createElement('esds-icon-lit');
      el.name = 'test-prefix:my-icon';
      container.append(el);
      await el.updateComplete;

      observerInstances[0].callback([{ isIntersecting: false } as IntersectionObserverEntry]);

      expect(IconifyApi.prototype.getSVG).not.toHaveBeenCalled();
    });
  });

  describe('icon loading', () => {
    it('should not update status if signal was aborted before resolve', async () => {
      let resolveFn: ((value: string) => void) | undefined;
      vi.spyOn(IconifyApi.prototype, 'getSVG').mockImplementation(() => {
        return new Promise((resolve) => {
          resolveFn = resolve;
        });
      });

      const el = document.createElement('esds-icon-lit');
      el.name = 'test-prefix:my-icon';
      container.append(el);
      await el.updateComplete;

      container.removeChild(el);

      resolveFn?.('<svg></svg>');
      await new Promise((r) => setTimeout(r, 10));

      expect(el.status).toBe('loading');
    });

    it('should not log error if signal was aborted before reject', async () => {
      let rejectFn: ((reason: Error) => void) | undefined;
      vi.spyOn(IconifyApi.prototype, 'getSVG').mockImplementation(() => {
        return new Promise((_resolve, reject) => {
          rejectFn = reject;
        });
      });

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const el = document.createElement('esds-icon-lit');
      el.name = 'test-prefix:my-icon';
      container.append(el);
      await el.updateComplete;

      container.removeChild(el);

      rejectFn?.(new Error('Network error'));
      await new Promise((r) => setTimeout(r, 10));

      expect(errorSpy).not.toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it('should not load icon if not connected', async () => {
      const getSVGSpy = vi.spyOn(IconifyApi.prototype, 'getSVG').mockResolvedValue('<svg></svg>');
      const el = document.createElement('esds-icon-lit');
      el.name = 'test-prefix:my-icon';
      el.requestUpdate();
      // Wait for the update cycle to complete without awaiting updateComplete
      // (disconnected elements may not resolve updateComplete reliably)
      await new Promise((r) => setTimeout(r, 10));
      expect(getSVGSpy).not.toHaveBeenCalled();
    });

    it('should not load icon if name is empty', async () => {
      const getSVGSpy = vi.spyOn(IconifyApi.prototype, 'getSVG').mockResolvedValue('<svg></svg>');
      const el = document.createElement('esds-icon-lit');
      el.name = '';
      container.append(el);
      await el.updateComplete;

      expect(getSVGSpy).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty name without error', async () => {
      const el = document.createElement('esds-icon-lit');
      container.append(el);
      el.name = '';
      await expect(el.updateComplete).resolves.toBeDefined();
      expect(el.status).toBe('loading');
    });

    it('should not throw on reconnect after disconnect', async () => {
      const el = document.createElement('esds-icon-lit');
      el.name = 'test-prefix:my-icon';
      container.append(el);
      await el.updateComplete;

      container.removeChild(el);
      container.append(el);
      await expect(el.updateComplete).resolves.toBeDefined();
    });

    it('should render nothing when no svg content in svg mode', async () => {
      const el = document.createElement('esds-icon-lit');
      el.name = 'test-prefix:my-icon';
      container.append(el);
      await el.updateComplete;

      // Before fetch resolves, svg content is empty
      const shadow = el.shadowRoot;
      expect(shadow?.innerHTML).not.toContain('<svg');
    });
  });
});
