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
 * Bind's a css classe with a signal.
 *
 * @example:
 *
 * ```ts
 * constructor() {
 *  this.disabled = signal(false);
 *
 *  hostClass(this, 'disabled', this.disabled);
 * }
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
