import { afterEach, describe, expect, it, vi } from 'vitest';

import { AttributeRegistry, CustomAttribute } from './custom-attribute.ts';

class TestAttribute extends CustomAttribute {
  connectedCallback = vi.fn();
  disconnectedCallback = vi.fn();
  changedCallback = vi.fn();
}

describe('CustomAttribute', () => {
  it('should expose the underlying attr name, value, and ownerElement', () => {
    const element = document.createElement('div');
    element.setAttribute('test-attr', 'hello');

    const attr = element.attributes.getNamedItem('test-attr')!;

    class DirectAttribute extends CustomAttribute {}

    const instance = new DirectAttribute(attr);

    expect(instance.name).toBe('test-attr');
    expect(instance.value).toBe('hello');
    expect(instance.ownerElement).toBe(element);
  });

  it('should update the underlying attr value when set', () => {
    const element = document.createElement('div');
    element.setAttribute('test-attr', 'hello');

    const attr = element.attributes.getNamedItem('test-attr')!;

    class DirectAttribute extends CustomAttribute {}

    const instance = new DirectAttribute(attr);

    instance.value = 'world';

    expect(instance.value).toBe('world');
    expect(attr.value).toBe('world');
    expect(element.getAttribute('test-attr')).toBe('world');
  });
});

describe('AttributeRegistry', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('static getters', () => {
    it('should return the same instance for a given document via AttributeRegistry.of()', () => {
      const registry1 = AttributeRegistry.of(document);
      const registry2 = AttributeRegistry.of(document);

      expect(registry1).toBe(registry2);
    });

    it('should return different instances for different documents', () => {
      const otherDocument = document.implementation.createDocument(null, '', null);

      const registry1 = AttributeRegistry.of(document);
      const registry2 = AttributeRegistry.of(otherDocument);

      expect(registry1).not.toBe(registry2);
    });

    it('should return an instance via AttributeRegistry.root', () => {
      expect(AttributeRegistry.root).toBe(AttributeRegistry.of(document));
    });
  });

  describe('define', () => {
    it('should register a custom attribute constructor', () => {
      const registry = AttributeRegistry.of(document);

      registry.define('test-define', TestAttribute);

      expect(registry.get('test-define')).toBe(TestAttribute);
    });

    it('should throw when the name is not dash-case', () => {
      const registry = AttributeRegistry.of(document);

      expect(() => registry.define('nodash', TestAttribute)).toThrow('Invalid name');
    });

    it('should throw when the name starts with aria-', () => {
      const registry = AttributeRegistry.of(document);

      expect(() => registry.define('aria-something', TestAttribute)).toThrow('Invalid name');
    });

    it('should throw when the name starts with data-', () => {
      const registry = AttributeRegistry.of(document);

      expect(() => registry.define('data-something', TestAttribute)).toThrow('Invalid name');
    });

    it('should throw when the custom attribute is already registered', () => {
      const registry = AttributeRegistry.of(document);

      registry.define('test-duplicate', TestAttribute);

      expect(() => registry.define('test-duplicate', TestAttribute)).toThrow(
        'already registered',
      );
    });
  });

  describe('defineOptionally', () => {
    it('should define the attribute when not already registered', () => {
      const registry = AttributeRegistry.of(document);

      registry.defineOptionally('test-optional', TestAttribute);

      expect(registry.get('test-optional')).toBe(TestAttribute);
    });

    it('should not throw when the attribute is already registered', () => {
      const registry = AttributeRegistry.of(document);

      registry.define('test-optional-2', TestAttribute);

      expect(() => registry.defineOptionally('test-optional-2', TestAttribute)).not.toThrow();
    });
  });

  describe('whenDefined', () => {
    it('should resolve immediately when the attribute is already defined', async () => {
      const registry = AttributeRegistry.of(document);

      registry.define('test-when-defined', TestAttribute);

      const ctor = await registry.whenDefined('test-when-defined');

      expect(ctor).toBe(TestAttribute);
    });

    it('should resolve once the attribute is defined', async () => {
      const registry = AttributeRegistry.of(document);

      const promise = registry.whenDefined('test-when-defined-later');

      registry.define('test-when-defined-later', TestAttribute);

      const ctor = await promise;

      expect(ctor).toBe(TestAttribute);
    });
  });

  describe('lifecycle', () => {
    it('should call connectedCallback when an element with the attribute is connected', async () => {
      const registry = AttributeRegistry.of(document);

      const connectSpy = vi.fn();
      class LifecycleAttribute extends CustomAttribute {
        connectedCallback = connectSpy;
      }

      registry.define('test-lifecycle-connect', LifecycleAttribute);

      const element = document.createElement('div');
      element.setAttribute('test-lifecycle-connect', 'value');
      document.body.appendChild(element);

      await vi.waitFor(() => {
        expect(connectSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should call disconnectedCallback when an element with the attribute is removed', async () => {
      const registry = AttributeRegistry.of(document);

      const connectSpy = vi.fn();
      const disconnectSpy = vi.fn();
      class DisconnectAttribute extends CustomAttribute {
        connectedCallback = connectSpy;
        disconnectedCallback = disconnectSpy;
      }

      registry.define('test-lifecycle-disconnect', DisconnectAttribute);

      const element = document.createElement('div');
      element.setAttribute('test-lifecycle-disconnect', 'value');
      document.body.appendChild(element);
      await vi.waitFor(() => {
        expect(connectSpy).toHaveBeenCalledTimes(1);
      });

      element.remove();

      await vi.waitFor(() => {
        expect(disconnectSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should call connectedCallback for elements already in the document when defined', () => {
      const registry = AttributeRegistry.of(document);

      const connectSpy = vi.fn();
      class PredefinedAttribute extends CustomAttribute {
        connectedCallback = connectSpy;
      }

      const element = document.createElement('div');
      element.setAttribute('test-lifecycle-predefined', 'value');
      document.body.appendChild(element);

      registry.define('test-lifecycle-predefined', PredefinedAttribute);

      expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it('should call connectedCallback for nested elements when connected to the document', async () => {
      const registry = AttributeRegistry.of(document);

      const connectSpy = vi.fn();
      class NestedAttribute extends CustomAttribute {
        connectedCallback = connectSpy;
      }

      registry.define('test-lifecycle-nested', NestedAttribute);

      const parent = document.createElement('div');
      const child = document.createElement('span');
      child.setAttribute('test-lifecycle-nested', 'value');
      parent.appendChild(child);
      document.body.appendChild(parent);

      await vi.waitFor(() => {
        expect(connectSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
