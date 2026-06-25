import type { ReactiveControllerHost } from 'lit';
import type { StopEffect } from '../../effect/stop-effect.ts';
import type { Signal } from '../../signal/signal.ts';
import { componentEffect } from '../component-effect/component-effect.ts';

export type ClassListLike = string | readonly string[] | null | undefined;

/**
 * Bind's a list of css classes with a signal.
 *
 * @example:
 *
 * ```ts
 * constructor() {
 *  this.disabled = signal(false);
 *  this.mode = signal('small');
 *
 *  hostClassList(this, computed(() => {
 *    const list: string[] = [];
 *    if (this.disabled.get()) {
 *      list.push('disabled');
 *    }
 *    list.push(`mode-${this.mode.get()}`);
 *    return list;
 *  ));
 * }
 * ```
 */
export function hostClassList(
  host: ReactiveControllerHost & Element,
  signal: Signal<ClassListLike>,
): StopEffect {
  let classNames: readonly string[] = [];

  return componentEffect(host, (): void => {
    // 1) remove previous classes
    host.classList.remove(...classNames);

    classNames = classListLikeToClassList(signal.get());

    // 2) add current classes
    host.classList.add(...classNames);
  });
}

/* INTERNAL */

/**
 * Converts a string, an array of strings, null, or undefined as a list of class names.
 */
function classListLikeToClassList(input: ClassListLike): readonly string[] {
  if (Array.isArray(input)) {
    return normalizeClassList(input);
  } else if (typeof input === 'string') {
    // INFO: `'          '.split(/\s+/)` returns `['', '']`, so in any case we have to "normalize"
    return normalizeClassList(input.split(' '));
  } else {
    return [];
  }
}

/**
 * Removes invalid classes from a list of class names.
 */
function normalizeClassList(input: readonly string[]): readonly string[] {
  return input
    .map((className: string): string => className.trim())
    .filter((className: string): boolean => className !== '');
}
