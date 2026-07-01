import { type InjectedKeyLike, InjectionContext } from '@infomaniak-design-system/components';
import { signal } from '@lit-labs/signals';
import type { ReactiveControllerHost } from 'lit';
import { batch } from 'signal-utils/subtle/batched-effect';
import { onConnected } from '../../../component/on-connected.ts';
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
  key: InjectedKeyLike,
  _default: () => GValue,
): Signal<GValue>;
export function hostInject<GValue>(
  host: ReactiveControllerHost & HTMLElement,
  key: InjectedKeyLike,
  _default?: undefined,
): Signal<GValue | undefined>;
export function hostInject<GValue>(
  host: ReactiveControllerHost & HTMLElement,
  key: InjectedKeyLike,
  _default?: (() => GValue) | undefined,
): Signal<GValue | undefined> {
  const getDefaultValue = _default === undefined ? (): undefined => undefined : _default;

  const signalValue: Signal<GValue | undefined> = signal<GValue | undefined>(getDefaultValue());

  onConnected(host, (): void => {
    batch((): void => {
      signalValue.set(InjectionContext.get<GValue>(host, key) ?? getDefaultValue());
    });
  });

  return signalValue;
}
