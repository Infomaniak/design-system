import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EsdsIconComponent, type EsdsIconComponentMode } from './esds-icon.component.ts';

describe('EsdsIconComponent', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should be constructible and registered', () => {
    const el = document.createElement('esds-icon');
    expect(el).instanceOf(EsdsIconComponent);
  });

  it('should have default mode as svg and default inline as false', () => {
    const el = new EsdsIconComponent();
    expect(el.mode).toBe('svg');
    expect(el.inline).toBe(false);
    expect(el.nolazy).toBe(false);
  });

  it('should reflect nolazy attribute', async () => {
    const el = document.createElement('esds-icon') as EsdsIconComponent;
    container.append(el);
    el.nolazy = true;
    await el.updateComplete;
    expect(el.hasAttribute('nolazy')).toBe(true);
  });

  it('should reflect inline attribute', async () => {
    const el = document.createElement('esds-icon') as EsdsIconComponent;
    container.append(el);
    el.inline = true;
    await el.updateComplete;
    expect(el.hasAttribute('inline')).toBe(true);
  });

  it('should throw on invalid name without colon', async () => {
    const el = document.createElement('esds-icon') as EsdsIconComponent;
    container.append(el);
    el.name = 'invalid-no-colon';
    await expect(el.updateComplete).rejects.toThrow('Invalid `name`: missing separator `:`');
  });

  it('should throw on invalid mode', async () => {
    const el = document.createElement('esds-icon') as EsdsIconComponent;
    container.append(el);
    el.mode = 'invalid' as unknown as EsdsIconComponentMode;
    await expect(el.updateComplete).rejects.toThrow(
      "Invalid mode: invalid. Expected 'svg', 'bg', or 'mask'.",
    );
  });

  it('should parse name correctly', async () => {
    const el = document.createElement('esds-icon') as EsdsIconComponent;
    container.append(el);
    el.name = 'test-prefix:my-icon';
    await el.updateComplete;
    expect(el.name).toBe('test-prefix:my-icon');
  });

  it('should update status when loading icon', async () => {
    const el = document.createElement('esds-icon') as EsdsIconComponent;
    el.nolazy = true;
    el.name = 'test-prefix:my-icon';
    container.append(el);
    await el.updateComplete;
    expect(el.status).toBe('loading');
  });

  it('should cancel previous fetch on disconnect', async () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    const el = document.createElement('esds-icon') as EsdsIconComponent;
    el.nolazy = true;
    el.name = 'test-prefix:my-icon';
    container.append(el);
    await el.updateComplete;
    container.removeChild(el);
    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });
});
