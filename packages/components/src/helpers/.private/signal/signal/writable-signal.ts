import type { Signal as TC39Signal } from '@lit-labs/signals';

/**
 * Represents a writable reactive signal that holds a state of type `GValue`.
 * A `WritableSignal` allows both reading and updating its current value.
 *
 * It can be used to represent mutable states in a reactive programming model,
 * with updates to its value triggering any subscribed reactions or computations.
 *
 * This type is built on the `TC39Signal.State` interface, which provides
 * the core functionalities for state management and reactivity.
 *
 * @template GValue - The type of the state value held by the signal.
 */
export type WritableSignal<GValue> = TC39Signal.State<GValue>;
