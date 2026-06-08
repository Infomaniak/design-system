import type { ReactiveControllerHost } from 'lit';
import type { StopEffect } from '../../effect/stop-effect.ts';
import type { Signal } from '../../signal/signal.ts';
import { componentEffect } from '../component-effect/component-effect.ts';

/**
 * Bind's a style property with a signal.
 *
 * @example:
 *
 * ```ts
 * constructor() {
 *  this.color = signal('red !important');
 *
 *  hostStyle(this, 'color', this.color);
 * }
 * ```
 */
export function hostStyle(
  host: HTMLElement & ReactiveControllerHost,
  propertyName: string,
  signal: Signal<string | null | undefined>,
): StopEffect {
  return componentEffect(host, (): void => {
    const signalValue: string | null | undefined = signal.get();

    if (signalValue === null || signalValue === undefined || signalValue === '') {
      host.style.removeProperty(propertyName);
      return;
    }

    const priorityIndex: number = signalValue.indexOf(' !');

    if (priorityIndex === -1) {
      host.style.setProperty(propertyName, signalValue);
    } else {
      host.style.setProperty(
        propertyName,
        signalValue.slice(0, priorityIndex),
        signalValue.slice(priorityIndex + 2),
      );
    }
  });
}
