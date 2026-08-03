import type { CleanUpFunction } from '../.private/misc/clean-up-function.ts';

/**
 * A class used to manage the injection and removal of CSS stylesheets into documents or shadow roots.
 * This class ensures that a stylesheet is only injected once per container and provides cleanup
 * functionality to remove injected styles when they are no longer needed.
 *
 * @internal
 */
export class InjectableStyleSheet {
  /**
   * Parses a CSS string and returns an instance of InjectableStyle.
   *
   * @param {string} css - The CSS string to be parsed and applied to a new CSSStyleSheet instance.
   * @param {CSSStyleSheetInit} [options] - Optional configuration object for the CSSStyleSheet.
   * @return {InjectableStyleSheet} An instance of InjectableStyle containing the parsed CSSStyleSheet.
   */
  static parse(css: string, options?: CSSStyleSheetInit): InjectableStyleSheet {
    const sheet: CSSStyleSheet = new CSSStyleSheet(options);
    sheet.replaceSync(css);

    return new InjectableStyleSheet(sheet);
  }

  readonly #sheet: CSSStyleSheet;
  readonly #injected: WeakMap<DocumentOrShadowRoot, number>;

  /**
   * Creates an instance of the class.
   *
   * @param {CSSStyleSheet} sheet The CSSStyleSheet where styles are defined.
   */
  constructor(sheet: CSSStyleSheet) {
    this.#sheet = sheet;
    this.#injected = new WeakMap();
  }

  /**
   * Injects this stylesheet into the given container.
   * If the container has already been injected with the stylesheet, it increments the injection count.
   *
   * @param {DocumentOrShadowRoot} container - The document or shadow root into which the stylesheet will be injected.
   * @return {CleanUpFunction} A function that when called, removes the injected stylesheet from the container.
   */
  inject(container: DocumentOrShadowRoot): CleanUpFunction {
    const count: number | undefined = this.#injected.get(container);

    if (count === undefined) {
      this.#injected.set(container, 1);
      container.adoptedStyleSheets.push(this.#sheet);
    } else {
      this.#injected.set(container, count + 1);
    }

    let removed: boolean = false;

    return (): void => {
      if (!removed) {
        removed = true;
        this.#remove(container);
      }
    };
  }

  /**
   * Removes this stylesheet from the specified container or decrements its reference count.
   *
   * @param {DocumentOrShadowRoot} container - The document or shadow root where the stylesheet is removed.
   */
  #remove(container: DocumentOrShadowRoot): void {
    const count: number | undefined = this.#injected.get(container);

    if (count === 1) {
      this.#injected.delete(container);
      const index: number = container.adoptedStyleSheets.indexOf(this.#sheet);
      container.adoptedStyleSheets.splice(index, 1);
    } else {
      this.#injected.set(container, count! - 1);
    }
  }

  /**
   * Retrieves the container for a given node. The container can be a Document or a ShadowRoot.
   *
   * @param {Node} node - The starting node from which to find the container.
   * @return {DocumentOrShadowRoot} - The document or shadow root containing the node.
   * @throws {Error} If no container is found.
   */
  #getContainer(node: Node): DocumentOrShadowRoot {
    let container: Node | null = node;

    while (container !== null) {
      if (container instanceof Document || container instanceof ShadowRoot) {
        return container;
      } else {
        container = container.parentNode;
      }
    }

    throw new Error('Could not find container');
  }

  /**
   * Injects this stylesheet from the specified DOM element.
   *
   * @param {Element} node - The DOM element from which the stylesheet should be applied.
   * @return {CleanUpFunction} A function that, when called, removes the applied stylesheet.
   * Call this function when the Node becomes disconnected from the DOM.
   */
  injectFrom(node: Element): CleanUpFunction {
    return this.inject(this.#getContainer(node));
  }
}
