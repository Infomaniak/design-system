import type { ReactiveControllerHost } from 'lit';
import type { StopEffect } from '../../effect/stop-effect.ts';
import type { Signal } from '../../signal/signal.ts';
import { componentEffect } from '../component-effect/component-effect.ts';

export type StylePropertyValueLike = string | StylePropertyValue | null | undefined;

/**
 * Bind's a style property with a signal.
 *
 * @example:
 *
 * ```ts
 * constructor() {
 *  this.color = signal('red !important'); // or { value: 'red', priority: 'important' }
 *
 *  hostStyle(this, 'color', this.color);
 * }
 * ```
 */
export function hostStyle(
  host: HTMLElement & ReactiveControllerHost,
  propertyName: string,
  signal: Signal<StylePropertyValueLike>,
): StopEffect {
  return componentEffect(host, (): void => {
    setStylePropertyValueLike(host, propertyName, signal.get());
  });
}

/* STYLE PROPERTY */

export interface StylePropertyValue {
  readonly value: string;
  readonly priority?: 'important' | string | undefined;
}

export function stringToStylePropertyValue(input: string): StylePropertyValue {
  const priorityIndex: number = input.indexOf(' !');

  return priorityIndex === -1
    ? {
        value: input,
      }
    : {
        value: input.slice(0, priorityIndex),
        priority: input.slice(priorityIndex + 2),
      };
}

export function setStylePropertyValueLike(
  element: HTMLElement,
  propertyName: string,
  propertyValueLike: StylePropertyValueLike,
): void {
  if (propertyValueLike === null || propertyValueLike === undefined || propertyValueLike === '') {
    element.style.removeProperty(propertyName);
  } else {
    const { value, priority }: StylePropertyValue =
      typeof propertyValueLike === 'string'
        ? stringToStylePropertyValue(propertyValueLike)
        : propertyValueLike;

    element.style.setProperty(propertyName, value, priority === '' ? undefined : priority);
  }
}
