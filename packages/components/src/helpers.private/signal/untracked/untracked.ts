import { Signal as TC39Signal } from '@lit-labs/signals';

/**
 * Executes the provided callback function in an untracked context, ensuring that any reactive tracking
 * mechanisms (ex: `signal.get()` do not observe the execution or its effects. This is useful for scenarios where changes
 * triggered within the callback should not cause reactive updates.
 *
 * @example:
 *
 * ```ts
 * componentEffect(this, () => {
 *  const value = this.signalA.get();
 *  const untrackedValue = untracked(() => this.signalB.get());
 *  // signalB is not tracked
 * })
 * ```
 */
export function untracked<GReturn>(callback: () => GReturn): GReturn {
  return TC39Signal.subtle.untrack<GReturn>(callback);
}
