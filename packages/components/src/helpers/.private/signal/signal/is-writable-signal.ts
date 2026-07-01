import { Signal as TC39Signal } from 'signal-polyfill';
import type { WritableSignal } from './writable-signal.ts';

/**
 * Determines whether the given input is a WritableSignal.
 *
 * @template GValue - The type of the value of this WritableSignal.
 * @param {unknown} input - The value to be checked.
 * @return {boolean} Returns true if the input is a WritableSignal, otherwise false.
 */
export function isWritableSignal<GValue>(input: unknown): input is WritableSignal<GValue> {
  return TC39Signal.isState(input);
}
