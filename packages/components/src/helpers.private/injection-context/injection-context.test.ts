import { describe, expect, it } from 'vitest';
import { Injectable, InjectionContext } from './injection-context.ts';

describe('InjectionContext', () => {
  it('should provide injected values', () => {
    const locale = new Injectable('locale');

    InjectionContext.root = new InjectionContext([locale.use('en-US')]);

    expect(InjectionContext.get(document, locale)).toBe('en-US');

    const div = document.body.appendChild(document.createElement('div'));

    expect(InjectionContext.get(div, locale)).toBe('en-US');

    const ctx = new InjectionContext([locale.use('fr-FR')]);

    document.body.setAttribute(InjectionContext.attributeName, ctx.id);

    expect(InjectionContext.get(div, locale)).toBe('fr-FR');
    expect(InjectionContext.get(document.body, locale)).toBe('fr-FR');
    expect(InjectionContext.get(document, locale)).toBe('en-US');
  });
});
