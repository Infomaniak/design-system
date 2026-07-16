let SUPPORTS_SYMBOLS_AS_WEAK_KEY: boolean | undefined;

/**
 * Determines whether the current JavaScript environment supports using symbols as keys in WeakMap.
 *
 * @return {boolean} True if symbols can be used as keys in WeakMap, otherwise false.
 */
export function supportsSymbolsAsWeakKey(): boolean {
  if (SUPPORTS_SYMBOLS_AS_WEAK_KEY === undefined) {
    try {
      void new WeakMap([[Symbol(), 1]]);
      SUPPORTS_SYMBOLS_AS_WEAK_KEY = true;
    } catch {
      SUPPORTS_SYMBOLS_AS_WEAK_KEY = false;
    }
  }

  return SUPPORTS_SYMBOLS_AS_WEAK_KEY;
}
