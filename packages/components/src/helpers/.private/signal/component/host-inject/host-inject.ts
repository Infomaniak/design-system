import { signal } from '@lit-labs/signals';
import type { ReactiveControllerHost } from 'lit';
import { batch } from 'signal-utils/subtle/batched-effect';
import {
  type InjectedKeyLike,
  InjectionContext,
} from '../../../../injection-context/injection-context.ts';
import { onConnected } from '../../../component/on-connected.ts';
import type { Signal } from '../../signal/signal.ts';

/**
 * Returns a signal that resolves to the value of the specified injection key from a parent `InjectionContext`.
 *
 * @example:
 *
 * ```ts
 * readonly #locale: Signal<string> = hostInject(this, LOCALE, (): string => navigator.language);
 * ```
 */
export function hostInject<GValue>(
  host: Node & ReactiveControllerHost,
  key: InjectedKeyLike,
  _default: () => GValue,
): Signal<GValue>;
export function hostInject<GValue>(
  host: Node & ReactiveControllerHost,
  key: InjectedKeyLike,
  _default?: undefined,
): Signal<GValue | undefined>;
export function hostInject<GValue>(
  host: Node & ReactiveControllerHost,
  key: InjectedKeyLike,
  _default?: (() => GValue) | undefined,
): Signal<GValue | undefined> {
  const getDefaultValue = _default === undefined ? (): undefined => undefined : _default;

  const value: Signal<GValue | undefined> = signal<GValue | undefined>(getDefaultValue());

  onConnected(host, (): void => {
    batch((): void => {
      value.set(InjectionContext.get<GValue>(host, key) ?? getDefaultValue());
    });
  });

  return value;
}
