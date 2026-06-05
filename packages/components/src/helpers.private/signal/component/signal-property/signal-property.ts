import { signal } from '@lit-labs/signals';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { batch } from 'signal-utils/subtle/batched-effect';
import type { SignalOptions } from '../../signal/signal-options.ts';
import type { WritableSignal } from '../../signal/writable-signal.ts';
import { untracked } from '../../untracked/untracked.ts';
import { componentEffect } from '../component-effect/component-effect.ts';

/**
 * A controller that synchronizes a ReactiveControllerHost property with a writable signal.
 *
 * This class manages the two-way synchronization between a host property and a signal,
 * ensuring that the property and signal states stay consistent with each other.
 *
 * @template GThis The type of the host that this controller is attached to.
 * @template GKey The type of the property key in the host which is managed by this controller.
 * @implements {ReactiveController}
 */
class SignalPropertyController<
  GThis extends ReactiveControllerHost,
  GKey extends keyof GThis,
> implements ReactiveController {
  readonly #host: GThis;
  readonly #key: GKey;
  readonly #equals: (a: GThis[GKey], b: GThis[GKey]) => boolean;
  readonly #signal: WritableSignal<GThis[GKey]>;
  #initialized: boolean;

  constructor(
    host: GThis,
    key: GKey,
    { equals = Object.is, ...options }: SignalOptions<GThis[GKey]> = {},
  ) {
    this.#host = host;
    this.#key = key;
    this.#equals = equals;
    // NOTE: `host[key]` may not be initialized yet
    this.#signal = signal<GThis[GKey]>(host[key], {
      ...options,
      equals,
    });
    this.#initialized = false;
    host.addController(this);

    componentEffect(host, (): void => {
      const signalValue: GThis[GKey] = this.#signal.get();

      if (this.#initialized) {
        if (!this.#equals(this.#host[this.#key], signalValue)) {
          this.#host[this.#key] = signalValue;
        }
      }
    });
  }

  get signal(): WritableSignal<GThis[GKey]> {
    return this.#signal;
  }

  hostUpdate(): void {
    untracked((): void => {
      if (!this.#initialized) {
        this.#initialized = true;
      }

      const propertyValue: GThis[GKey] = this.#host[this.#key];

      if (!this.#equals(propertyValue, this.#signal.get())) {
        batch((): void => {
          this.#signal.set(propertyValue);
        });
      }
    });
  }
}

/**
 * Creates a writable signal synced with a specified property on a reactive controller host.
 *
 * @param {GThis} host - The reactive controller host instance.
 * @param {GKey} key - The key of the property on the host to bind the signal to.
 * @param {SignalOptions<GThis[GKey]>} [options] - Optional configuration for the signal.
 * @return {WritableSignal<GThis[GKey]>} A writable signal associated with the specified property.
 *
 * @example:
 *
 * ```ts
 * @property({ type: String })
 * accessor name!: string;
 *
 * readonly #name: WritableSignal<string> = signalProperty(this, 'name');
 * ```
 */
export function signalProperty<GThis extends ReactiveControllerHost, GKey extends keyof GThis>(
  host: GThis,
  key: GKey,
  options?: SignalOptions<GThis[GKey]>,
): WritableSignal<GThis[GKey]> {
  return new SignalPropertyController<GThis, GKey>(host, key, options).signal;
}
