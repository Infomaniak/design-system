import { LitElement } from 'lit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  InjectableValue,
  InjectionContext,
} from '../../../../injection-context/injection-context.ts';
import { onConnected } from '../../../component/on-connected.ts';
import { hostInject } from './host-inject.ts';

class TestHostElement extends LitElement {}

customElements.define('test-host-inject', TestHostElement);

function createTestHost(): TestHostElement {
  return document.createElement('test-host-inject') as TestHostElement;
}

describe('hostInject', () => {
  let hostA: TestHostElement;
  let hostB: TestHostElement;

  beforeEach(() => {
    hostA = createTestHost();
    hostB = createTestHost();

    InjectionContext.root = undefined;
  });

  afterEach(() => {
    hostA.remove();
    hostB.remove();

    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('should return a signal with the default value', () => {
    const key = new InjectableValue<string>('key');

    expect(hostInject(hostA, key, (): string => 'default').get()).toBe('default');
  });

  it('should return a signal with `undefined` when no default is provided', () => {
    const key = new InjectableValue<string>('key');

    expect(hostInject<string>(hostA, key).get()).toBeUndefined();
  });

  it('should share the default value across hosts when `sharedDefault` is enabled', () => {
    const key = new InjectableValue<Record<string, never>>('key');

    const signalA = hostInject(hostA, key, (): Record<string, never> => ({}), {
      sharedDefault: true,
    });
    const signalB = hostInject(hostB, key, (): Record<string, never> => ({}), {
      sharedDefault: true,
    });

    expect(signalA.get()).toBe(signalB.get());
  });

  it('should not share the default value across hosts when `sharedDefault` is disabled', () => {
    const key = new InjectableValue<Record<string, never>>('key');

    const signalA = hostInject(hostA, key, (): Record<string, never> => ({}));
    const signalB = hostInject(hostB, key, (): Record<string, never> => ({}));

    expect(signalA.get()).not.toBe(signalB.get());
  });

  it('should share the default value across hosts with a `Map` fallback when the engine rejects symbols as WeakMap keys (ex: Firefox ESR)', async () => {
    vi.stubGlobal('WeakMap', LegacyWeakMap);

    vi.resetModules();

    const { hostInject: legacyHostInject } = await import('./host-inject.ts');

    const key = new InjectableValue<Record<string, never>>('key');

    const signalA = legacyHostInject(hostA, key, (): Record<string, never> => ({}), {
      sharedDefault: true,
    });
    const signalB = legacyHostInject(hostB, key, (): Record<string, never> => ({}), {
      sharedDefault: true,
    });

    expect(signalA.get()).toBe(signalB.get());
  });

  it('should resolve the injected value when the host connects', () => {
    const key = new InjectableValue<string>('key');

    InjectionContext.root = new InjectionContext([key.define('injected')]);

    const host = document.body.appendChild(hostA);
    const signalValue = hostInject(host, key, (): string => 'default');

    expect(signalValue.get()).toBe('injected');
  });

  it('should fallback to the default value when the host connects and no context provides one', () => {
    const key = new InjectableValue<string>('key');

    const host = document.body.appendChild(hostA);
    const signalValue = hostInject(host, key, (): string => 'default');

    expect(signalValue.get()).toBe('default');
  });

  it('should call the clean-up function when the host disconnects', () => {
    let cleanedUp: boolean = false;

    const host = document.body.appendChild(hostA);

    onConnected(host, (): (() => void) | void => {
      return (): void => {
        cleanedUp = true;
      };
    });

    expect(cleanedUp).toBe(false);

    host.remove();

    expect(cleanedUp).toBe(true);
  });

  it('should stop observing the host connection when the returned function is called', () => {
    let connectedCount: number = 0;

    const stop: () => void = onConnected(hostA, (): void => {
      connectedCount++;
    });

    document.body.appendChild(hostA);

    expect(connectedCount).toBe(1);

    hostA.remove();
    document.body.appendChild(hostA);

    expect(connectedCount).toBe(2);

    stop();

    hostA.remove();
    document.body.appendChild(hostA);

    expect(connectedCount).toBe(2);
  });
});

/* INTERNAL */

/**
 * Simulates an engine without the "Symbols as WeakMap keys" ES2023 feature (ex: Firefox ESR),
 * where `WeakMap.set` throws a `TypeError` for symbol keys.
 */
class LegacyWeakMap {
  readonly #map: Map<object, unknown> = new Map();

  set(key: unknown, value: unknown): this {
    if (typeof key !== 'object' || key === null) {
      throw new TypeError('WeakMap key must be an object');
    }

    this.#map.set(key, value);

    return this;
  }
}
