import type { Signal as TC39Signal } from '@lit-labs/signals';

/**
 * Represents the configuration options for a Signal instance adhering to the TC39 Signal proposal.
 *
 * This type is a direct mapping to `TC39Signal.Options` and is used to define the generic parameter
 * for the value type of the signal.
 *
 * @template GValue - The type associated with the value of the Signal.
 */
export type SignalOptions<GValue> = TC39Signal.Options<GValue>;
