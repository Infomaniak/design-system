import type { ReactiveControllerHost } from 'lit';
import type { StopEffect } from '../../effect/stop-effect.ts';
import type { Signal } from '../../signal/signal.ts';
import { componentEffect } from '../component-effect/component-effect.ts';

export type ClassListLike = string | readonly string[] | null | undefined;

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
export function hostClass(
  host: HTMLElement & ReactiveControllerHost,
  className: string,
  signal: Signal<boolean>,
): StopEffect {
  return componentEffect(host, (): void => {
    host.classList.toggle(className, signal.get());
  });
}
