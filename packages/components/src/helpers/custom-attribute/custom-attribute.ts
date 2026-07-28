/**
 * Inspired from:
 *
 * {@link https://github.com/lume/custom-attributes}
 * {@link https://github.com/lume/element-behaviors}
 * {@link https://github.com/WICG/webcomponents/issues/1029}
 */

/* DEFINITION */

/**
 * Represents the definition of a custom attribute and provides lifecycle callbacks for observing changes.
 *
 * This interface defines the structure and behavior for custom attributes,
 * including properties for accessing attribute metadata and optional lifecycle callbacks
 * for handling connection and data changes.
 */
export interface CustomAttributeDefinition extends Pick<Attr, 'ownerElement' | 'name' | 'value'> {
  /**
   * Invoked when:
   *  - the Attr is added to an element
   *  - OR the element becomes connected to the document
   * AND both are true
   */
  connectedCallback?(): void;

  /**
   * Invoked when:
   *  - the Attr is removed from an element
   *  - OR the element becomes disconnected from the document
   */
  disconnectedCallback?(): void;

  /**
   * Invoked when:
   *  - the Attr's value change
   */
  changedCallback?(oldValue: string, newValue: string): void;
}

export type CustomAttributeConstructor = new (attr: Attr) => CustomAttributeDefinition;

/* CUSTOM ATTRIBUTE */

/**
 * Represents a custom attribute attached to a specific DOM element.
 * This class provides access to the attribute's name, its associated element,
 * and its current value.
 *
 * Implements the CustomAttributeDefinition interface.
 */
export abstract class CustomAttribute implements CustomAttributeDefinition {
  readonly #attr: Attr;

  constructor(attr: Attr) {
    this.#attr = attr;
  }

  get ownerElement(): Element | null {
    return this.#attr.ownerElement;
  }

  get name(): string {
    return this.#attr.name;
  }

  get value(): string {
    return this.#attr.value;
  }

  set value(input: string) {
    this.#attr.value = input;
  }
}

/* REGISTRY */

/**
 * A registry for managing custom attributes within a specific document. This class allows for
 * defining, registering, and retrieving custom attributes while managing their lifecycle events
 * (e.g., connection, disconnection, and value changes) across the associated elements.
 */
export class AttributeRegistry {
  static #instances: WeakMap<Document, AttributeRegistry> = new WeakMap();

  static get root(): AttributeRegistry {
    return this.of(document);
  }

  /**
   * Retrieves an existing instance of `AttributeRegistry` associated with the specified document,
   * or creates a new instance if none exists.
   *
   * @param {Document} root - The document for which the `AttributeRegistry` instance is retrieved or created.
   * @return {AttributeRegistry} The instance of `AttributeRegistry` associated with the specified document.
   */
  static of(root: Document): AttributeRegistry {
    let instance: AttributeRegistry | undefined = this.#instances.get(root);
    if (instance === undefined) {
      instance = new AttributeRegistry(root);
      this.#instances.set(root, instance);
    }
    return instance;
  }

  readonly #root: Document;

  readonly #registry: Map<string, CustomAttributeConstructor> = new Map();
  readonly #attributeInstances: WeakMap<Attr, CustomAttributeDefinition> = new WeakMap();
  /**
   * Contains the Attr instances of the elements that have been processed by the observer.
   *
   * => When an element is processed, we cannot get the _removed_ Attr, thus we have to store them in a WeakMap.
   */
  readonly #indirectAttrInstances: WeakMap<Element, Map<string, Attr>> = new WeakMap();

  readonly #lastConnected: WeakMap<CustomAttributeDefinition, boolean> = new WeakMap();
  readonly #lastAttributeValue: WeakMap<CustomAttributeDefinition, string> = new WeakMap();

  readonly #observer: MutationObserver = new MutationObserver(
    (mutations: readonly MutationRecord[]): void => {
      for (let i: number = 0; i < mutations.length; i++) {
        const { type, target, attributeName, addedNodes, removedNodes }: MutationRecord =
          mutations[i];

        if (type === 'attributes') {
          // => attribute mutation

          console.assert(target instanceof Element);
          console.assert(attributeName !== null);

          const attr: Attr | undefined =
            (target as Element).attributes.getNamedItem(
              attributeName!,
            ) /* get the current element's Attr -> it could be null if the attribute was removed */ ??
            this.#getIndirectAttrInstance(target as Element, attributeName!);

          console.assert(attr !== undefined);

          this.#setIndirectAttrInstance(target as Element, attributeName!, attr!);

          // search for the next attribute's value -> default on the current attribute's value
          let currentValue: string | null = attr!.value;

          // search for the next mutation -> the attribute's value may have changed multiple times
          for (let j: number = i + 1; j < mutations.length; j++) {
            const nextMutation: MutationRecord = mutations[j];

            if (
              nextMutation.type === 'attributes' &&
              nextMutation.target === attr!.ownerElement &&
              nextMutation.attributeName === attr!.name
            ) {
              currentValue = nextMutation.oldValue;
              break;
            }
          }

          this.#refreshAttr(attr!, currentValue);
        } else if (type === 'childList') {
          for (const node of removedNodes) {
            this.#refreshTree(node);
          }

          for (const node of addedNodes) {
            this.#refreshTree(node);
          }
        }
      }
    },
  );

  readonly #whenDefined: Map<string, PromiseWithResolvers<CustomAttributeConstructor>[]> =
    new Map();

  constructor(root: Document) {
    this.#root = root;
  }

  /**
   * Retrieves an instance of a custom attribute definition associated with the specified attribute.
   * If an instance does not already exist, a new one is created and stored for future retrieval.
   *
   * @param {Attr} attr - The attribute for which to retrieve or create the custom attribute definition instance.
   * @return {CustomAttributeDefinition} The instance of the custom attribute definition associated with the given attribute.
   * @throws {Error} If no constructor is found for the specified attribute.
   */
  #getInstance(attr: Attr): CustomAttributeDefinition {
    const ctor: CustomAttributeConstructor | undefined = this.#registry.get(attr.name);

    if (ctor === undefined) {
      throw new Error(`Missing entry for attribute ${JSON.stringify(attr.name)}`);
    }

    let instance: CustomAttributeDefinition | undefined = this.#attributeInstances.get(attr);

    if (instance === undefined) {
      instance = new ctor(attr);
      this.#attributeInstances.set(attr, instance);
    }

    return instance;
  }

  #getIndirectAttrInstance(element: Element, attributeName: string): Attr | undefined {
    return this.#indirectAttrInstances.get(element)?.get(attributeName);
  }

  #setIndirectAttrInstance(element: Element, attributeName: string, attr: Attr | undefined): void {
    let indirectAttrInstances: Map<string, Attr> | undefined =
      this.#indirectAttrInstances.get(element);

    if (attr === undefined) {
      if (indirectAttrInstances !== undefined) {
        indirectAttrInstances.delete(attributeName);

        if (indirectAttrInstances.size === 0) {
          this.#indirectAttrInstances.delete(element);
        }
      }
    } else {
      if (indirectAttrInstances === undefined) {
        indirectAttrInstances = new Map();
        this.#indirectAttrInstances.set(element, indirectAttrInstances);
      }

      indirectAttrInstances.set(attributeName, attr);
    }
  }

  /**
   * Recursively refreshes the elements of a DOM tree starting from the specified node.
   *
   * @param {Node} [from=this.#root] - The node from which to start refreshing the DOM tree. Defaults to the root node of the tree.
   */
  #refreshTree(from: Node = this.#root): void {
    const treeWalker: TreeWalker = this.#root.createTreeWalker(from, NodeFilter.SHOW_ELEMENT);

    if (from.nodeType === Node.ELEMENT_NODE) {
      this.#refreshElement(from as Element);
    }

    while (treeWalker.nextNode()) {
      console.assert(treeWalker.currentNode instanceof Element);
      this.#refreshElement(treeWalker.currentNode as Element);
    }
  }

  /**
   * Refreshes the specified DOM element by processing and updating its attributes.
   *
   * @param {Element} element - The DOM element to be refreshed.
   */
  #refreshElement(element: Element): void {
    const elementAttributes: Set<Attr> = new Set();

    // append all the cached attributes of the element
    const attributeNameToAttr: Map<string, Attr> | undefined =
      this.#indirectAttrInstances.get(element);

    if (attributeNameToAttr !== undefined) {
      for (const attr of attributeNameToAttr.values()) {
        elementAttributes.add(attr);

        if (element.attributes.getNamedItem(attr.name) !== attr) {
          this.#setIndirectAttrInstance(element as Element, attr.name, undefined);
        }
      }
    }

    // append all the attributes of the element that have not been processed yet
    for (const attr of element.attributes) {
      if (this.#registry.has(attr.name) && !elementAttributes.has(attr)) {
        elementAttributes.add(attr);

        this.#setIndirectAttrInstance(element, attr.name, attr);
      }
    }

    // refresh the element's attributes
    for (const attr of elementAttributes) {
      this.#refreshAttr(attr);
    }
  }

  /**
   * Refreshes the state of the provided custom attribute instance based on its connectivity
   * and attribute value changes. Invokes appropriate lifecycle callbacks such as
   * `connectedCallback`, `disconnectedCallback`, and `changedCallback` when conditions are met.
   *
   * @param {Attr} attr - The attribute whose state needs to be refreshed.
   * @param {string | null} [attributeValue=attr.value] - The new value of the attribute.
   * Defaults to the current value of the attribute.
   */
  #refreshAttr(attr: Attr, attributeValue: string | null = attr.value): void {
    const instance: CustomAttributeDefinition = this.#getInstance(attr);

    const connected: boolean =
      attr.ownerElement !== null && attr.ownerElement.isConnected && attributeValue !== null;
    const lastConnected: boolean | undefined = this.#lastConnected.get(instance);

    if (lastConnected === undefined || connected !== lastConnected) {
      this.#lastConnected.set(instance, connected);

      if (connected) {
        instance.connectedCallback?.();
      } else {
        instance.disconnectedCallback?.();
      }
    }

    const lastAttributeValue: string | null = this.#lastAttributeValue.get(instance) ?? null;
    const currentAttributeValue: string | null = attr.ownerElement === null ? null : attributeValue;

    if (currentAttributeValue !== lastAttributeValue) {
      if (currentAttributeValue === null) {
        this.#lastAttributeValue.delete(instance);
      } else {
        this.#lastAttributeValue.set(instance, currentAttributeValue);

        if (lastAttributeValue !== null) {
          instance.changedCallback?.(lastAttributeValue, currentAttributeValue);
        }
      }
    }
  }

  /**
   * Defines a custom attribute and registers it with the internal registry.
   *
   * @param {string} name - The name of the custom attribute to define. Must be `dash-case`.
   * @param {CustomAttributeConstructor} ctor - The constructor function for the custom attribute.
   * @throws {Error} Throws an error if the name is not valid.
   * @throws {Error} Throws an error if a custom attribute with the same name is already registered.
   */
  define(name: string, ctor: CustomAttributeConstructor): void {
    if (!/^[a-z]+(-[a-z]+)+$/.test(name) || name.startsWith('aria-') || name.startsWith('data-')) {
      throw new Error(`Invalid name ${JSON.stringify(name)}`);
    }

    if (this.#registry.has(name)) {
      throw new Error(`CustomAttribute ${JSON.stringify(name)} already registered`);
    }

    this.#registry.set(name, ctor);

    // `this.#observer.disconnect();` -> implicitly done by `this.#observer.observe`

    this.#observer.observe(this.#root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      attributeFilter: Array.from(this.#registry.keys()),
    });

    for (const element of this.#root.querySelectorAll(`[${name}]`)) {
      this.#refreshElement(element);
    }

    const promiseWithResolvers: PromiseWithResolvers<CustomAttributeConstructor>[] | undefined =
      this.#whenDefined.get(name);

    if (promiseWithResolvers !== undefined) {
      for (const { resolve } of promiseWithResolvers) {
        resolve(ctor);
      }

      this.#whenDefined.delete(name);
    }
  }

  /**
   * Conditionally defines a custom attribute if it has not already been registered.
   *
   * @see define
   * @param {string} name - The name of the custom attribute to define.
   * @param {CustomAttributeConstructor} ctor - The constructor function for the custom attribute.
   */
  defineOptionally(name: string, ctor: CustomAttributeConstructor): void {
    if (!this.#registry.has(name)) {
      this.define(name, ctor);
    }
  }

  /**
   * Retrieves a custom attribute constructor by its name from the registry.
   *
   * @param {string} name - The name of the custom attribute to retrieve.
   * @return {CustomAttributeConstructor | undefined } The constructor of the custom attribute if found; otherwise, undefined.
   */
  get(name: string): CustomAttributeConstructor | undefined {
    return this.#registry.get(name);
  }

  /**
   * Returns a promise that resolves to the constructor of a custom attribute
   * when it is defined in the registry. If the custom attribute is already
   * defined, the promise resolves immediately with the constructor. If it is not
   * yet defined, the promise resolves once the custom attribute is registered.
   *
   * @param {string} name - The name of the custom attribute to look up in the registry.
   * @return {Promise<CustomAttributeConstructor> } A promise that resolves to the constructor of the custom attribute.
   */
  whenDefined(name: string): Promise<CustomAttributeConstructor> {
    const ctor: CustomAttributeConstructor | undefined = this.#registry.get(name);

    if (ctor === undefined) {
      const promiseWithResolvers: PromiseWithResolvers<CustomAttributeConstructor> =
        Promise.withResolvers<CustomAttributeConstructor>();

      let whenDefined: PromiseWithResolvers<CustomAttributeConstructor>[] | undefined =
        this.#whenDefined.get(name);

      if (whenDefined === undefined) {
        whenDefined = [];
        this.#whenDefined.set(name, whenDefined);
      }

      whenDefined.push(promiseWithResolvers);

      return promiseWithResolvers.promise;
    } else {
      return Promise.resolve(ctor);
    }
  }
}
