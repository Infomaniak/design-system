export type CapturedInjectionContext = ReadonlyMap<symbol, unknown>;

export type InjectedEntry<GValue> = readonly [name: symbol, value: GValue];

export type ExtraInjectedEntries = Iterable<InjectedEntry<unknown>>;

/**
 * Represents a context management system for dependency injection.
 * Provides functionality to capture, restore, and extend injection contexts,
 * as well as retrieve values from the current context.
 *
 * @example
 *
 * ```ts
 * // create a new Injectable instance: `locale`
 * const locale = new Injectable('locale');
 *
 * InjectionContext.extend([locale.inject('en-US')], (): void => {
 *   // code within this block will use the provided context
 *   console.log(InjectionContext.get(locale)); // 'en-US'
 *
 *   InjectionContext.extend([locale.inject('fr-FR')], (): void => {
 *     // code within this block will use the extended context
 *     console.log(InjectionContext.get(locale)); // 'fr-FR'
 *   });
 *
 *   // captures the context for asynchronous operations
 *   const context: CapturedInjectionContext = InjectionContext.capture();
 *
 *   setTimeout((): void => {
 *     // restores the captured context
 *     InjectionContext.restore(context, () => {
 *       // code within this block will use the restored context
 *       console.log(InjectionContext.get(locale)); // 'en-US'
 *     });
 *   }, 1000);
 * });
 * ```
 */
export class InjectionContext {
  static #context: CapturedInjectionContext = new Map();

  /**
   * Captures and returns the current injection context.
   *
   * @returns {CapturedInjectionContext} The active injection context at the time this method is called.
   */
  static capture(): CapturedInjectionContext {
    return this.#context;
  }

  /**
   * Restores a specific context for the duration of the callback execution.
   *
   * @template GArguments The type of the arguments to pass to the callback function.
   * @template GReturn The type of the return value of the callback function.
   * @param {CapturedInjectionContext} context The context to temporarily apply.
   * @param {(...args: GArguments) => GReturn} callback The function to execute with the restored context.
   * @param {...GArguments} args The arguments to pass to the callback function.
   * @returns {GReturn} The result of the callback function execution.
   */
  static restore<GArguments extends readonly unknown[], GReturn>(
    context: CapturedInjectionContext,
    callback: (...args: GArguments) => GReturn,
    ...args: GArguments
  ): GReturn {
    const previous: CapturedInjectionContext = this.#context;

    try {
      this.#context = context;
      return callback(...args);
    } finally {
      this.#context = previous;
    }
  }

  /**
   * Extends the current context with additional entries for the duration of the callback execution.
   *
   * @template GArguments The type of the arguments to pass to the callback function.
   * @template GReturn The type of the return value of the callback function.
   * @param {ExtraInjectedEntries} context A set of additional key-value pairs to extend the current context.
   * @param {function(...GArguments): GReturn} callback The function to execute with the new context.
   * @param {...GArguments} args The arguments to pass to the callback function.
   * @returns {GReturn} The result of the callback function execution.
   */
  static extend<GArguments extends readonly unknown[], GReturn>(
    context: ExtraInjectedEntries,
    callback: (...args: GArguments) => GReturn,
    ...args: GArguments
  ): GReturn {
    return this.restore<GArguments, GReturn>(
      new Map([...this.#context, ...context]),
      callback,
      ...args,
    );
  }

  /*--*/

  /**
   * Retrieves a value associated with the specified key from the context.
   * If the key is not found, returns a default value if provided, otherwise throws an error.
   *
   * @param {symbol | Injectable<unknown>} name The key or Injectable object used to retrieve the value from the context.
   * @param {(() => GValue) | undefined} [_default] Optional function to provide a default value if the key is not found.
   * @returns {GValue} The value associated with the key in the context, or the default value returned by `_default` if key is not found.
   * @throws {Error} If the key is not found in the context and no default value is provided.
   */
  static get<GValue>(
    name: symbol | Injectable<unknown>,
    _default?: (() => GValue) | undefined,
  ): GValue {
    if (name instanceof Injectable) {
      name = name.key;
    }

    if (this.#context.has(name)) {
      return this.#context.get(name) as GValue;
    } else if (_default !== undefined) {
      return _default();
    } else {
      throw new Error(`Missing context's value for ${String(name)}`);
    }
  }
}

/**
 * A generic class used to define injectable values with unique symbolic keys used by `InjectionContext`.
 *
 * @template GValue The type of value that can be injected.
 */
export class Injectable<GValue> {
  readonly #key: symbol;

  constructor(name: string) {
    this.#key = Symbol(name);
  }

  get key(): symbol {
    return this.#key;
  }

  inject(value: GValue): InjectedEntry<GValue> {
    return Object.freeze([this.#key, value]);
  }
}
