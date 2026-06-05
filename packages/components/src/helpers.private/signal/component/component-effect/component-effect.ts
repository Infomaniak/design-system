import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { batchedEffect } from 'signal-utils/subtle/batched-effect';
import type { EffectFunction } from '../../effect/effect-function.ts';
import type { StopEffect } from '../../effect/stop-effect.ts';

/**
 * A `ReactiveController` implementation that manages lifecycle and execution
 * of a reactive side effect for a host component. The side effect is defined
 * by a user-provided effect function.
 */
class ComponentEffectController implements ReactiveController {
  readonly #host: ReactiveControllerHost;
  readonly #effectFnc: EffectFunction;

  #stopEffect: StopEffect | undefined;

  constructor(host: ReactiveControllerHost, effectFnc: EffectFunction) {
    this.#host = host;
    this.#effectFnc = effectFnc;
    host.addController(this);
  }

  start(): this {
    this.#host.addController(this);
    return this;
  }

  stop(): this {
    this.#host.removeController(this);
    if (this.#stopEffect !== undefined) {
      this.#stopEffect();
      this.#stopEffect = undefined;
    }
    return this;
  }

  hostConnected(): void {
    this.#stopEffect = batchedEffect(this.#effectFnc);
  }

  hostDisconnected(): void {
    this.#stopEffect!();
    this.#stopEffect = undefined;
  }
}

/**
 * Establishes a reactive effect tied to the lifecycle of a host component.
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
  const ctrl = new ComponentEffectController(host, effectFnc);
  return (): void => {
    ctrl.stop();
  };
}
