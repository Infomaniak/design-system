import {
  AttributeRegistry,
  CustomAttribute,
  type CustomAttributeDefinition,
} from '../../helpers/custom-attribute/custom-attribute.ts';

export interface EsdsHeadlessButtonAttrDefineOptions {
  readonly registry?: AttributeRegistry;
}

/**
 * The button contract as a custom attribute: the semantics and behavior of a button applied to
 * native `<button>` and `<a>` elements, without any styling.
 *
 * Responsibilities (the "headless" layer):
 * - prevents usage on non-interactive elements;
 * - anchors behave as buttons: `role="button"` and Space triggers `click()`;
 * - press becomes inert while `disabled` or `loading` (prevents hover/focus side effects);
 * - `disabled`/`loading` are mirrored to `aria-disabled`/`aria-busy` on anchors, with a
 *   tabindex save/restore, and `loading` mirrors the text content to `aria-label`.
 *
 * It injects **zero** CSS: the element keeps its native look. Look layers (e.g. `EsdsButtonAttr`,
 * `EsdsAvatarButtonAttr`) extend this class to add their styling, so an element carries exactly one
 * behavior-bearing attribute. See `esds-headless-button.attr.md` for the composition rules.
 *
 * @summary Headless button attribute
 * @element esds-headless-button
 * @attr disabled - Disables the button
 * @attr loading - Displays a loading state on the button
 */
export class EsdsHeadlessButtonAttr extends CustomAttribute implements CustomAttributeDefinition {
  static define({
    registry = AttributeRegistry.root,
  }: EsdsHeadlessButtonAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-headless-button', EsdsHeadlessButtonAttr);
  }

  readonly #observer: MutationObserver = new MutationObserver((): void => {
    this.#updateAnchorElementState();
  });

  #userDefinedTabIndexValue: string | null | undefined = undefined;

  constructor(attr: Attr) {
    if (attr.ownerElement?.tagName !== 'BUTTON' && attr.ownerElement?.tagName !== 'A') {
      throw new Error(`${attr.name} attribute can only be used on <button> or <a> elements`);
    }
    super(attr);

    const element: HTMLElement = this.ownerElement! as HTMLElement;

    if (isAnchorElement(element)) {
      element.role = 'button';

      element.addEventListener('keypress', (event: KeyboardEvent): void => {
        if (event.code === 'Space') {
          if (isElementDisabledOrLoading(element)) {
            return;
          }
          element.click();
        }
      });
    }

    makeElementInertOnDownUpEvent(element, 'pointer');
    makeElementInertOnDownUpEvent(element, 'key');
  }

  /**
   * Syncs the state of an anchor to its element. Only ever invoked for anchors: the observer is
   * attached and the state update triggered from anchor-only code paths (behavioral parity with the
   * pre-split `EsdsButtonAttr`, where buttons never received any state sync).
   */
  #updateAnchorElementState(): void {
    const element: HTMLElement = this.ownerElement! as HTMLElement;

    if (isElementDisabledOrLoading(element)) {
      element.setAttribute('aria-disabled', 'true');
    } else {
      element.removeAttribute('aria-disabled');
    }

    if (isElementLoading(element)) {
      element.setAttribute('aria-busy', 'true');
    } else {
      element.removeAttribute('aria-busy');
    }

    if (isElementDisabled(element)) {
      if (this.#userDefinedTabIndexValue === undefined) {
        this.#userDefinedTabIndexValue = element.getAttribute('tabindex');
      }
      element.setAttribute('tabindex', '-1');
    } else {
      if (this.#userDefinedTabIndexValue !== undefined) {
        if (this.#userDefinedTabIndexValue === null) {
          element.removeAttribute('tabindex');
        } else {
          element.setAttribute('tabindex', this.#userDefinedTabIndexValue);
        }
        this.#userDefinedTabIndexValue = undefined;
      }
    }

    if (isElementLoading(element)) {
      element.setAttribute('aria-label', element.textContent.trim());
    } else {
      element.removeAttribute('aria-label');
    }
  }

  connectedCallback(): void {
    const element: Element = this.ownerElement!;

    if (isAnchorElement(element)) {
      this.#observer.observe(element, {
        attributes: true,
        attributeFilter: ['disabled', 'loading'],
      });

      this.#updateAnchorElementState();
    }
  }

  disconnectedCallback(): void {
    this.#observer.disconnect();
  }
}

/* INTERNAL */

function isAnchorElement(element: Element): element is HTMLAnchorElement {
  return element.tagName === 'A';
}

function isElementDisabledOrLoading(element: Element): boolean {
  return isElementDisabled(element) || isElementLoading(element);
}

function isElementDisabled(element: Element): boolean {
  return (
    element.hasAttribute('disabled') ||
    (Reflect.has(element, 'disabled') && Reflect.get(element, 'disabled'))
  );
}

function isElementLoading(element: Element): boolean {
  return element.hasAttribute('loading');
}

function makeElementInertOnDownUpEvent(element: Element, eventName: string): void {
  // NOTE: make element _inert_ only when we **click** on it; NOT ALWAYS => this allows to have **hover** effects like tooltips.
  element.addEventListener(`${eventName}down`, (event: Event): void => {
    if (isElementDisabledOrLoading(element)) {
      event.preventDefault();
      event.stopPropagation();

      element.setAttribute('inert', '');

      window.addEventListener(
        `${eventName}up`,
        (): void => {
          element.removeAttribute('inert');
          if (
            element instanceof HTMLElement &&
            isElementLoading(element) &&
            !isElementDisabled(element)
          ) {
            element.focus();
          }
        },
        {
          once: true,
        },
      );
    }
  });
}
