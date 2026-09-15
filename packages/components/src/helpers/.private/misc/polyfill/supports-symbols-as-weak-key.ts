let SUPPORTS_SYMBOLS_AS_WEAK_KEY: boolean | undefined;

/**
 * Determines whether the current JavaScript environment supports using symbols as keys in WeakMap.
 *
 * @return {boolean} True if symbols can be used as keys in WeakMap, otherwise false.
 */
export function supportsSymbolsAsWeakKey(): boolean {
  if (SUPPORTS_SYMBOLS_AS_WEAK_KEY === undefined) {
    try {
      // `WeakMap.set` returns the map instance itself, and the result is consumed by
      // `instanceof`: a minifier can neither remove the call nor fold the expression.
      // (A previous `void new WeakMap([[Symbol(), 1]])` formulation was dead-code
      // eliminated by the oxc minifier, always yielding `true`.)
      SUPPORTS_SYMBOLS_AS_WEAK_KEY = new WeakMap().set(Symbol(), 1) instanceof WeakMap;
    } catch {
      SUPPORTS_SYMBOLS_AS_WEAK_KEY = false;
    }
  }

  return SUPPORTS_SYMBOLS_AS_WEAK_KEY;
}
