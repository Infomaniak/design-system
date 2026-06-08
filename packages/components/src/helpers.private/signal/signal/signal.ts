import type { Signal as TC39Signal } from '@lit-labs/signals';

/**
 * Represents a reactive signal that follows the TC39 proposal for reactive data flow.
 *
 * A `Signal` is used to manage and compute reactive values that can automatically
 * propagate changes through dependent computations. This type specifically represents a
 * `Readonly` signal.
 *
 * @template GValue - The type of the value of this signal.
 */
export type Signal<GValue> = TC39Signal.State<GValue> | TC39Signal.Computed<GValue>;
