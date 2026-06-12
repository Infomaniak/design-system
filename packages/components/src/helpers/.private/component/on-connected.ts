import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { CleanUpFunction } from '../misc/clean-up-function.ts';

export type OnConnectedFunction = () => CleanUpFunction | void;

export type StopOnConnected = () => void;

/**
 * Calls `onConnectedFnc` when the host is connected, and the returned "cleanup" when the host is disconnected.
 *
 * @param {ReactiveControllerHost} host - The host instance the controller is associated with.
 * @param {OnConnectedFunction} onConnectedFnc - The function to be executed when the host is connected.
 * @return {StopOnConnected} A function to stop the connection handling logic.
 *
 * @example:
 *
 * ```ts
 * constructor() {
 *  onConnected(this, () => {
 *    const timer = setInterval(() => console.log('tick'), 1000);
 *
 *    return () => clearInterval(timer);
 *  });
 * }
 * ```
 */
export function onConnected(
  host: ReactiveControllerHost,
  onConnectedFnc: OnConnectedFunction,
): StopOnConnected {
  const ctrl: OnConnectedController = new OnConnectedController(host, onConnectedFnc).start();
  return (): void => {
    ctrl.stop();
  };
}

/* INTERNAL */

class OnConnectedController implements ReactiveController {
  readonly #host: ReactiveControllerHost;
  readonly #onConnectedFnc: OnConnectedFunction;

  #cleanupFnc: CleanUpFunction | undefined | void;

  constructor(host: ReactiveControllerHost, onConnectedFnc: OnConnectedFunction) {
    this.#host = host;
    this.#onConnectedFnc = onConnectedFnc;
  }

  #cleanUp(): void {
    if (this.#cleanupFnc !== undefined) {
      this.#cleanupFnc();
      this.#cleanupFnc = undefined;
    }
  }

  start(): this {
    this.#host.addController(this);
    return this;
  }

  stop(): this {
    this.#host.removeController(this);
    this.#cleanUp();
    return this;
  }

  hostConnected(): void {
    this.#cleanUp();
    this.#cleanupFnc = this.#onConnectedFnc();
  }

  hostDisconnected(): void {
    this.#cleanUp();
  }
}
