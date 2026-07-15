import { signal } from '@lit-labs/signals';
import type { ReactiveControllerHost } from 'lit';
import { batch } from 'signal-utils/subtle/batched-effect';
import {
  type InjectedKeyLike,
  injectedKeyLikeToKey,
  InjectionContext,
} from '../../../../injection-context/injection-context.ts';
import { onConnected } from '../../../component/on-connected.ts';
import { supportsSymbolsAsWeakKey } from '../../../misc/polyfill/supports-symbols-as-weak-key.ts';
import type { Signal } from '../../signal/signal.ts';

export interface HostInjectOptions {
  readonly sharedDefault?: boolean;
}

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
  options?: HostInjectOptions,
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
  { sharedDefault = false }: HostInjectOptions = {},
): Signal<GValue | undefined> {
  let getDefaultValue: () => GValue | undefined =
    _default === undefined ? (): undefined => undefined : _default;

  if (sharedDefault) {
    getDefaultValue = generateSharedDefaultFunction(key, getDefaultValue);
  }

  const signalValue: Signal<GValue | undefined> = signal<GValue | undefined>(getDefaultValue());

  onConnected(host, (): void => {
    batch((): void => {
      signalValue.set(InjectionContext.get<GValue>(host, key) ?? getDefaultValue());
    });
  });

  return signalValue;
}

/* INTERNAL */

const SHARED_DEFAULT_VALUES_MAP = supportsSymbolsAsWeakKey()
  ? new WeakMap<symbol, unknown>()
  : new Map<symbol, unknown>();

function generateSharedDefaultFunction<GValue>(
  key: InjectedKeyLike,
  _default: () => GValue,
): () => GValue {
  const normalizedKey: symbol = injectedKeyLikeToKey(key);

  return (): GValue => {
    let value: GValue | undefined = SHARED_DEFAULT_VALUES_MAP.get(normalizedKey) as
      GValue | undefined;

    if (value === undefined) {
      value = _default();
      SHARED_DEFAULT_VALUES_MAP.set(normalizedKey, value);
    }

    return value;
  };
}
