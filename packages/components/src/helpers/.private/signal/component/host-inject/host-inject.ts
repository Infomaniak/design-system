import { signal } from '@lit-labs/signals';
import { type Context, ContextConsumer } from '@lit/context';
import type { ReactiveControllerHost } from 'lit';
import { batch } from 'signal-utils/subtle/batched-effect';
import type { Signal } from '../../signal/signal.ts';

/**
 * Returns a signal that resolves to the value of the specified `Context` from a parent `ContextProducer`.
 *
 * @example:
 *
 * ```ts
 * const LOCALE = createContext<string>('locale');
 * ```
 *
 * ```ts
 * readonly #locale: Signal<string> = hostInject(this, LOCALE, (): string => navigator.language);
 * ```
 */
export function hostInject<GValue>(
  host: ReactiveControllerHost & HTMLElement,
  context: Context<unknown, GValue>,
  _default: () => GValue,
): Signal<GValue>;
export function hostInject<GValue>(
  host: ReactiveControllerHost & HTMLElement,
  context: Context<unknown, GValue>,
  _default?: undefined,
): Signal<GValue | undefined>;
export function hostInject<GValue>(
  host: ReactiveControllerHost & HTMLElement,
  context: Context<unknown, GValue>,
  _default?: (() => GValue) | undefined,
): Signal<GValue | undefined> {
  const getDefaultValue = _default === undefined ? (): undefined => undefined : _default;

  const signalValue: Signal<GValue | undefined> = signal<GValue | undefined>(getDefaultValue());

  new ContextConsumer(host, {
    context,
    callback: (value: GValue): void => {
      batch((): void => {
        signalValue.set(value ?? getDefaultValue());
      });
    },
    subscribe: true,
  });

  return signalValue;
}
