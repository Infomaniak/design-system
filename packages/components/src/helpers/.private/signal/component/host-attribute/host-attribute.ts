import type { ReactiveControllerHost } from 'lit';
import type { StopEffect } from '../../effect/stop-effect.ts';
import type { Signal } from '../../signal/signal.ts';
import { componentEffect } from '../component-effect/component-effect.ts';

/**
 * Reflects the value of a signal as an attribute of the host element.
 *
 * The attribute is kept in sync with the signal: it is set to the current signal value, and removed
 * while the value is `null` or `undefined`. The effect is tied to the connection of the host, so the
 * attribute is re-applied if the host is reconnected.
 *
 * NOTE: writes to the signal must be wrapped in a `batch()` call so that the reflection is applied
 * synchronously at the end of the batch, and the effect keeps being scheduled on further writes.
 *
 * @param {ReactiveControllerHost & Element} host - The host element the attribute is reflected on.
 * @param {string} name - The name of the attribute reflecting the signal value.
 * @param {Signal<string | null | undefined>} signalValue - The signal whose value is reflected.
 * @return {StopEffect} A function to stop and clean up the reflection effect.
 *
 * @example:
 *
 * ```ts
 * constructor() {
 *   super();
 *
 *   hostAttribute(this, 'data-image-state', this.#imageState);
 * }
 * ```
 */
export function hostAttribute(
  host: ReactiveControllerHost & Element,
  name: string,
  signalValue: Signal<string | null | undefined>,
): StopEffect {
  return componentEffect(host, (): void => {
    const value: string | null | undefined = signalValue.get();
    if (value === null || value === undefined) {
      host.removeAttribute(name);
    } else {
      host.setAttribute(name, value);
    }
  });
}
