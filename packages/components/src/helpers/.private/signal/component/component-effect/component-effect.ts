import type { ReactiveControllerHost } from 'lit';
import { batchedEffect } from 'signal-utils/subtle/batched-effect';
import { onConnected } from '../../../component/on-connected.ts';
import type { CleanUpFunction } from '../../../misc/clean-up-function.ts';
import type { EffectFunction } from '../../effect/effect-function.ts';
import type { StopEffect } from '../../effect/stop-effect.ts';

/**
 * Creates a reactive effect tied to the lifecycle of a host component.
 *
 * @param {ReactiveControllerHost} host - The host component to which the effect is tied.
 * @param {EffectFunction} effectFnc - The effect function to execute reactively.
 * @return {StopEffect} A function to stop and clean up the reactive effect.
 *
 * @example:
 *
 * ```ts
 * constructor() {
 *  componentEffect(this, () => {
 *    console.log(this.signal.get());
 *  });
 *  // NOTE: the effect is stopped when the component is disconnected
 * }
 * ```
 */
export function componentEffect(
  host: ReactiveControllerHost,
  effectFnc: EffectFunction,
): StopEffect {
  return onConnected(host, (): StopEffect => {
    let cleanupFnc: CleanUpFunction | undefined | void;

    const cleanup: CleanUpFunction = (): void => {
      if (cleanupFnc !== undefined) {
        cleanupFnc();
        cleanupFnc = undefined;
      }
    };

    const stopEffect: StopEffect = batchedEffect((): void => {
      cleanup();
      cleanupFnc = effectFnc();
    });

    return (): void => {
      stopEffect();
      cleanup();
    };
  });
}
