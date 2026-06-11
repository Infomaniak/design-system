export type InjectedEntry<GValue> = readonly [name: symbol, value: GValue];

export type InjectionContextEntries = Iterable<InjectedEntry<unknown>>;

export class InjectionContext {
  static root: InjectionContext | undefined;

  static readonly attributeName = 'data-inject' as const;

  static readonly #instances: Map<string, WeakRef<InjectionContext>> = new Map();

  static get<GValue>(
    source: Node,
    name: symbol | Injectable<unknown>,
    _default?: (() => GValue) | undefined,
  ): GValue {
    if (name instanceof Injectable) {
      name = name.key;
    }

    let node: Node | null = source;

    while (node !== null) {
      if (isElementNode(node)) {
        const attributeValue: string | null = node.getAttribute(this.attributeName);

        if (attributeValue !== null) {
          const context: InjectionContext | undefined = this.#instances
            .get(attributeValue)
            ?.deref();

          if (context === undefined) {
            throw new Error(`Missing InjectionContext instance with id: ${attributeValue}`);
          }

          if (context.has(name)) {
            return context.get<GValue>(name);
          }
        }

        node = node.parentNode;
      } else if (isShadowRoot(node)) {
        node = node.host;
      } else {
        node = node.parentNode;
      }
    }

    if (InjectionContext.root !== undefined && InjectionContext.root.has(name)) {
      return InjectionContext.root.get<GValue>(name);
    } else if (_default !== undefined) {
      return _default();
    } else {
      throw new Error(`Missing context's value for ${String(name)}`);
    }
  }

  readonly #id: string;
  readonly #context: ReadonlyMap<symbol, unknown>;

  constructor(entries?: InjectionContextEntries) {
    this.#id = `${Math.floor(Math.random() * 0x1_0000_0000)
      .toString(16)
      .padStart(8, '0')}-${Date.now().toString(16).padStart(12, '0')}`;

    this.#context = new Map(entries);

    InjectionContext.#instances.set(this.#id, new WeakRef(this));

    const registry = new FinalizationRegistry<string>((id: string): void => {
      InjectionContext.#instances.delete(id);
    });

    registry.register(this, this.#id);
  }

  get id(): string {
    return this.#id;
  }

  get size(): number {
    return this.#context.size;
  }

  has(name: symbol): boolean {
    return this.#context.has(name);
  }

  get<GValue>(name: symbol): GValue {
    if (this.#context.has(name)) {
      return this.#context.get(name) as GValue;
    } else {
      throw new Error(`Missing context's value for ${String(name)}`);
    }
  }

  getOptional<GValue>(name: symbol): GValue | undefined {
    return this.#context.get(name) as GValue | undefined;
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
export class Injectable<GValue> {
  readonly #key: symbol;

  constructor(name: string) {
    this.#key = Symbol(name);
  }

  get key(): symbol {
    return this.#key;
  }

  use(value: GValue): InjectedEntry<GValue> {
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
