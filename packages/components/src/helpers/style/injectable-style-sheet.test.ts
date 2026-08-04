import { afterEach, describe, expect, it } from 'vitest';
import { InjectableStyleSheet } from './injectable-style-sheet.ts';

describe('InjectableStyleSheet', () => {
  afterEach(() => {
    document.adoptedStyleSheets.length = 0;
  });

  describe('parse', () => {
    it('should create an instance with a parsed CSSStyleSheet', () => {
      const sheet = InjectableStyleSheet.parse('.foo { color: red; }');

      expect(sheet).instanceOf(InjectableStyleSheet);
    });
  });

  describe('inject', () => {
    it('should add the stylesheet to the container on first injection', () => {
      const sheet = InjectableStyleSheet.parse('.foo { color: red; }');

      sheet.inject(document);

      expect(document.adoptedStyleSheets).toHaveLength(1);
    });

    it('should not add the stylesheet twice on subsequent injections', () => {
      const sheet = InjectableStyleSheet.parse('.foo { color: red; }');

      sheet.inject(document);
      sheet.inject(document);

      expect(document.adoptedStyleSheets).toHaveLength(1);
    });

    it('should remove the stylesheet when the cleanup function is called', () => {
      const sheet = InjectableStyleSheet.parse('.foo { color: red; }');

      const cleanup = sheet.inject(document);
      expect(document.adoptedStyleSheets).toHaveLength(1);

      cleanup();

      expect(document.adoptedStyleSheets).toHaveLength(0);
    });

    it('should only remove the stylesheet once even if cleanup is called multiple times', () => {
      const sheet = InjectableStyleSheet.parse('.foo { color: red; }');

      const cleanup = sheet.inject(document);

      cleanup();
      cleanup();

      expect(document.adoptedStyleSheets).toHaveLength(0);
    });

    it('should keep the stylesheet until all cleanups have been called', () => {
      const sheet = InjectableStyleSheet.parse('.foo { color: red; }');

      const cleanup1 = sheet.inject(document);
      const cleanup2 = sheet.inject(document);

      expect(document.adoptedStyleSheets).toHaveLength(1);

      cleanup1();

      expect(document.adoptedStyleSheets).toHaveLength(1);

      cleanup2();

      expect(document.adoptedStyleSheets).toHaveLength(0);
    });

    it('should support injecting into a shadow root', () => {
      const host = document.createElement('div');
      document.body.appendChild(host);
      const shadowRoot = host.attachShadow({ mode: 'open' });

      const sheet = InjectableStyleSheet.parse('.foo { color: red; }');

      const cleanup = sheet.inject(shadowRoot);

      expect(shadowRoot.adoptedStyleSheets).toHaveLength(1);

      cleanup();

      expect(shadowRoot.adoptedStyleSheets).toHaveLength(0);

      host.remove();
    });
  });

  describe('injectFrom', () => {
    it('should resolve a shadow root container from an element inside it', () => {
      const host = document.createElement('div');
      document.body.appendChild(host);
      const shadowRoot = host.attachShadow({ mode: 'open' });
      const inner = document.createElement('span');
      shadowRoot.appendChild(inner);

      const sheet = InjectableStyleSheet.parse('.foo { color: red; }');

      const cleanup = sheet.injectFrom(inner);

      expect(shadowRoot.adoptedStyleSheets).toHaveLength(1);

      cleanup();

      expect(shadowRoot.adoptedStyleSheets).toHaveLength(0);

      host.remove();
    });

    it('should throw when no container can be found', () => {
      const detached = document.createElement('div');

      const sheet = InjectableStyleSheet.parse('.foo { color: red; }');

      expect(() => sheet.injectFrom(detached)).toThrow('Could not find container');
    });
  });
});
