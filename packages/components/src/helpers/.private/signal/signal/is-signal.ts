import { Signal as TC39Signal } from 'signal-polyfill';
import type { Signal } from './signal.ts';

/**
 * Determines whether the given input is a Signal.
 *
 * @template GValue - The type of the value of this signal.
 * @param {unknown} input - The value to be checked.
 * @return {boolean} Returns true if the input is a Signal, otherwise false.
 */
export function isSignal<GValue>(input: unknown): input is Signal<GValue> {
  return TC39Signal.isState(input) || TC39Signal.isComputed(input);
}
