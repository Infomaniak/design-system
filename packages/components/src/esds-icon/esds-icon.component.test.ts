import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EsdsIconComponent, _clearApiCache } from './esds-icon.component.ts';

describe('EsdsIconComponent', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
    _clearApiCache();
  });

  it('should be constructible and registered', () => {
    const el = document.createElement('esds-icon-lit');
    expect(el).instanceOf(EsdsIconComponent);
  });

  // it('should throw on invalid name without colon', async () => {
  //   const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //   container.append(el);
  //   el.name = 'invalid-no-colon';
  //   await expect(el.updateComplete).rejects.toThrow('Invalid `name`: missing separator `:`');
  // });
  //
  // it('should cancel previous fetch on disconnect', async () => {
  //   const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
  //   const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //   el.name = 'test-prefix:my-icon';
  //   container.append(el);
  //   await el.updateComplete;
  //   container.removeChild(el);
  //   expect(abortSpy).toHaveBeenCalled();
  //   abortSpy.mockRestore();
  // });
  //
  // describe('lazy loading via IntersectionObserver', () => {
  //   let mockObserve: ReturnType<typeof vi.fn>;
  //   let mockDisconnect: ReturnType<typeof vi.fn>;
  //   let observerInstances: MockIntersectionObserver[] = [];
  //
  //   class MockIntersectionObserver {
  //     callback: (entries: IntersectionObserverEntry[]) => void;
  //     observe = mockObserve;
  //     disconnect = mockDisconnect;
  //     unobserve = vi.fn();
  //     takeRecords = vi.fn();
  //     root = null;
  //     rootMargin = '';
  //     thresholds: number[] = [];
  //
  //     constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
  //       this.callback = callback;
  //       observerInstances.push(this);
  //     }
  //   }
  //
  //   beforeEach(() => {
  //     mockObserve = vi.fn();
  //     mockDisconnect = vi.fn();
  //     observerInstances = [];
  //     global.IntersectionObserver =
  //       MockIntersectionObserver as unknown as typeof IntersectionObserver;
  //   });
  //
  //   afterEach(() => {
  //     vi.restoreAllMocks();
  //   });
  //
  //   it('should create IntersectionObserver when not nolazy', async () => {
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:my-icon';
  //     container.append(el);
  //     await el.updateComplete;
  //     expect(mockObserve).toHaveBeenCalledWith(el);
  //   });
  //
  //   it('should load icon when element intersects', async () => {
  //     vi.spyOn(IconifyApi.prototype, 'getSVG').mockResolvedValue('<svg></svg>');
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:my-icon';
  //     container.append(el);
  //     await el.updateComplete;
  //
  //     observerInstances[0].callback([{ isIntersecting: true } as IntersectionObserverEntry]);
  //     await new Promise((r) => setTimeout(r, 0));
  //
  //     expect(IconifyApi.prototype.getSVG).toHaveBeenCalledWith({
  //       prefix: 'test-prefix',
  //       name: 'my-icon',
  //       signal: expect.any(AbortSignal),
  //     });
  //   });
  //
  //   it('should not load icon when element does not intersect', async () => {
  //     vi.spyOn(IconifyApi.prototype, 'getSVG').mockResolvedValue('<svg></svg>');
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:my-icon';
  //     container.append(el);
  //     await el.updateComplete;
  //
  //     observerInstances[0].callback([{ isIntersecting: false } as IntersectionObserverEntry]);
  //
  //     expect(IconifyApi.prototype.getSVG).not.toHaveBeenCalled();
  //   });
  // });
  //
  // describe('icon loading', () => {
  //   it('should render SVG content in svg mode', async () => {
  //     vi.spyOn(IconifyApi.prototype, 'getSVG').mockResolvedValue('<svg><circle /></svg>');
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:my-icon';
  //     container.append(el);
  //     await el.updateComplete;
  //
  //     await new Promise((r) => setTimeout(r, 10));
  //     await el.updateComplete;
  //
  //     expect(el.status).toBe('rendered');
  //     const shadow = el.shadowRoot;
  //     expect(shadow?.innerHTML).toContain('<svg>');
  //     expect(shadow?.innerHTML).toContain('<circle');
  //   });
  //
  //   it('should transition status to error on failed fetch', async () => {
  //     vi.spyOn(IconifyApi.prototype, 'getSVG').mockRejectedValue(new Error('Network error'));
  //     const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:my-icon';
  //     container.append(el);
  //     await el.updateComplete;
  //
  //     await new Promise((r) => setTimeout(r, 10));
  //     await el.updateComplete;
  //
  //     expect(el.status).toBe('error');
  //     expect(errorSpy).toHaveBeenCalledWith(
  //       'Failed to load icon: "test-prefix:my-icon"',
  //       expect.any(Error),
  //     );
  //     errorSpy.mockRestore();
  //   });
  //
  //   it('should not update status if signal was aborted before resolve', async () => {
  //     let resolveFn: ((value: string) => void) | undefined;
  //     vi.spyOn(IconifyApi.prototype, 'getSVG').mockImplementation(() => {
  //       return new Promise((resolve) => {
  //         resolveFn = resolve;
  //       });
  //     });
  //
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:my-icon';
  //     container.append(el);
  //     await el.updateComplete;
  //
  //     container.removeChild(el);
  //
  //     resolveFn?.('<svg></svg>');
  //     await new Promise((r) => setTimeout(r, 10));
  //
  //     expect(el.status).toBe('loading');
  //   });
  //
  //   it('should not log error if signal was aborted before reject', async () => {
  //     let rejectFn: ((reason: Error) => void) | undefined;
  //     vi.spyOn(IconifyApi.prototype, 'getSVG').mockImplementation(() => {
  //       return new Promise((_resolve, reject) => {
  //         rejectFn = reject;
  //       });
  //     });
  //
  //     const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:my-icon';
  //     container.append(el);
  //     await el.updateComplete;
  //
  //     container.removeChild(el);
  //
  //     rejectFn?.(new Error('Network error'));
  //     await new Promise((r) => setTimeout(r, 10));
  //
  //     expect(errorSpy).not.toHaveBeenCalled();
  //     errorSpy.mockRestore();
  //   });
  //
  //   it('should not load icon if not connected', async () => {
  //     const getSVGSpy = vi.spyOn(IconifyApi.prototype, 'getSVG').mockResolvedValue('<svg></svg>');
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:my-icon';
  //     el.requestUpdate();
  //     // Wait for the update cycle to complete without awaiting updateComplete
  //     // (disconnected elements may not resolve updateComplete reliably)
  //     await new Promise((r) => setTimeout(r, 10));
  //     expect(getSVGSpy).not.toHaveBeenCalled();
  //   });
  //
  //   it('should not load icon if name is empty', async () => {
  //     const getSVGSpy = vi.spyOn(IconifyApi.prototype, 'getSVG').mockResolvedValue('<svg></svg>');
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = '';
  //     container.append(el);
  //     await el.updateComplete;
  //
  //     expect(getSVGSpy).not.toHaveBeenCalled();
  //   });
  //
  //   it('should abort previous fetch when name changes', async () => {
  //     vi.spyOn(IconifyApi.prototype, 'getSVG').mockImplementation(() => new Promise(() => {}));
  //     const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
  //
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:icon-1';
  //     container.append(el);
  //     await el.updateComplete;
  //
  //     el.name = 'test-prefix:icon-2';
  //     await el.updateComplete;
  //
  //     expect(abortSpy).toHaveBeenCalled();
  //     expect(IconifyApi.prototype.getSVG).toHaveBeenCalledTimes(2);
  //     abortSpy.mockRestore();
  //   });
  // });
  //
  // describe('endpoint customization', () => {
  //   it('should use default Iconify API when endpoint is empty', async () => {
  //     const getSVGSpy = vi.spyOn(IconifyApi.prototype, 'getSVG').mockResolvedValue('<svg></svg>');
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:my-icon';
  //     container.append(el);
  //     await el.updateComplete;
  //
  //     await new Promise((r) => setTimeout(r, 10));
  //     await el.updateComplete;
  //
  //     expect(getSVGSpy).toHaveBeenCalledWith({
  //       prefix: 'test-prefix',
  //       name: 'my-icon',
  //       signal: expect.any(AbortSignal),
  //     });
  //   });
  // });
  //
  // describe('edge cases', () => {
  //   it('should handle empty name without error', async () => {
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     container.append(el);
  //     el.name = '';
  //     await expect(el.updateComplete).resolves.toBeDefined();
  //     expect(el.status).toBe('loading');
  //   });
  //
  //   it('should not throw on reconnect after disconnect', async () => {
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:my-icon';
  //     container.append(el);
  //     await el.updateComplete;
  //
  //     container.removeChild(el);
  //     container.append(el);
  //     await expect(el.updateComplete).resolves.toBeDefined();
  //   });
  //
  //   it('should render nothing when no svg content in svg mode', async () => {
  //     const el = document.createElement('esds-icon-lit') as EsdsIconComponent;
  //     el.name = 'test-prefix:my-icon';
  //     container.append(el);
  //     await el.updateComplete;
  //
  //     // Before fetch resolves, svg content is empty
  //     const shadow = el.shadowRoot;
  //     expect(shadow?.innerHTML).not.toContain('<svg');
  //   });
  // });
});
