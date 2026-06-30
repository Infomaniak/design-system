/* TYPES */

export type InjectedEntry<GValue> = readonly [key: symbol, value: GValue];

export type InjectionContextEntries = Iterable<InjectedEntry<unknown>>;

export type InjectedKeyLike = symbol | InjectableValue<unknown>;

function injectedKeyLikeToKey(input: InjectedKeyLike): symbol {
  return input instanceof InjectableValue ? input.key : input;
}

export interface InjectionContextOptions {
  readonly weak?: boolean;
}

/* CLASS */

/**
 * Represents a context for dependency injection. It allows for storing and retrieving values
 * associated with symbols (`InjectedKeyLike`), providing a mechanism for scoped dependency injection.
 */
export class InjectionContext {
  /**
   * Represents the **root** `InjectionContext` or is undefined if none is set.
   */
  static root: InjectionContext | undefined;

  static readonly attributeName = 'data-inject' as const;

  static readonly #instances: Map<string, WeakRef<InjectionContext> | InjectionContext> = new Map();

  /**
   * Retrieves a value associated with the specified key from the nearest context within the provided node's hierarchy.
   *
   * @template GValue The type of value to retrieve.
   * @param {Node} source - The starting node from which to begin searching for the value.
   * @param {InjectedKeyLike} key - The key used to locate the desired value within the context.
   * @return {GValue | undefined} The value associated with the key if found, or `undefined` if no matching context is found.
   */
  static get<GValue>(source: Node, key: InjectedKeyLike): GValue | undefined {
    key = injectedKeyLikeToKey(key);

    let node: Node | null = source;

    while (node !== null) {
      if (isElementNode(node)) {
        const attributeValue: string | null = node.getAttribute(this.attributeName);

        if (attributeValue !== null) {
          let context: WeakRef<InjectionContext> | InjectionContext | undefined =
            this.#instances.get(attributeValue);

          if (context === undefined) {
            throw new Error(
              `Missing InjectionContext instance with id ${JSON.stringify(attributeValue)}`,
            );
          }

          if (context instanceof WeakRef) {
            context = context.deref();

            if (context === undefined) {
              this.#instances.delete(attributeValue);

              throw new Error(
                `Context with id ${JSON.stringify(attributeValue)} was unreferenced: did you forget to keep a referenced onto it ?`,
              );
            }
          }

          if (context.has(key)) {
            return context.get<GValue>(key);
          }
        }

        node = node.parentNode;
      } else if (isShadowRoot(node)) {
        node = node.host;
      } else {
        node = node.parentNode;
      }
    }

    return InjectionContext.root !== undefined && InjectionContext.root.has(key)
      ? InjectionContext.root.get<GValue>(key)
      : undefined;
  }

  readonly #id: string;
  readonly #context: ReadonlyMap<symbol, unknown>;

  /**
   * Constructs an instance of the InjectionContext.
   *
   * @param {InjectionContextEntries} entries - The initial key-value pairs to populate the context.
   * @param {InjectionContextOptions} options - Configuration options for the context.
   * @param {boolean} [options.weak=true] - Determines whether the context should be weakly referenced.
   * @return {InjectionContext} A new instance of the InjectionContext.
   */
  constructor(entries: InjectionContextEntries, { weak = true }: InjectionContextOptions = {}) {
    this.#id = `${Math.floor(Math.random() * 0x1_0000_0000)
      .toString(16)
      .padStart(8, '0')}-${Date.now().toString(16).padStart(12, '0')}`;

    this.#context = new Map(entries);

    InjectionContext.#instances.set(this.#id, weak ? new WeakRef(this) : this);

    if (weak) {
      const registry = new FinalizationRegistry<string>((id: string): void => {
        InjectionContext.#instances.delete(id);
      });

      registry.register(this, this.#id);
    }
  }

  get id(): string {
    return this.#id;
  }

  /**
   * Destroys manually the current `InjectionContext` instance.
   */
  destroy(): void {
    InjectionContext.#instances.delete(this.#id);
    if (InjectionContext.root === this) {
      InjectionContext.root = undefined;
    }
  }

  /* MAP LIKE PROPERTIES/METHODS */

  get size(): number {
    return this.#context.size;
  }

  has(key: InjectedKeyLike): boolean {
    return this.#context.has(injectedKeyLikeToKey(key));
  }

  get<GValue>(key: InjectedKeyLike): GValue | undefined {
    return this.#context.get(injectedKeyLikeToKey(key)) as GValue | undefined;
  }

  keys(): MapIterator<symbol> {
    return this.#context.keys();
  }

  values(): MapIterator<unknown> {
    return this.#context.values();
  }

  entries(): MapIterator<InjectedEntry<unknown>> {
    return this.#context.entries();
  }

  [Symbol.iterator](): MapIterator<InjectedEntry<unknown>> {
    return this.#context[Symbol.iterator]();
  }
}

/**
 * A generic class used to define injectable values with unique symbolic keys used by `InjectionContext`.
 *
 * @template GValue The type of value that can be injected.
 */
export class InjectableValue<GValue> {
  readonly #key: symbol;

  constructor(name: string) {
    this.#key = Symbol(name);
  }

  get key(): symbol {
    return this.#key;
  }

  /**
   * Creates an `InjectedEntry` to use when constructing a new `InjectionContext`.
   *
   * @param {GValue} value - The new value to be set.
   * @returns {InjectedEntry<GValue>} An immutable tuple containing the key and the value.
   */
  define(value: GValue): InjectedEntry<GValue> {
    return Object.freeze([this.#key, value]);
  }
}

/* INTERNAL */

function isElementNode(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

function isShadowRoot(node: Node): node is ShadowRoot {
  return node instanceof ShadowRoot;
}
