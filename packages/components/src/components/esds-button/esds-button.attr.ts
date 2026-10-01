import type { CleanUpFunction } from '../../helpers/.private/misc/clean-up-function.ts';
import { InjectableStyleSheet } from '../../helpers/.private/style/injectable-style-sheet.ts';
import {
  AttributeRegistry,
  CustomAttribute,
  type CustomAttributeDefinition,
} from '../../helpers/custom-attribute/custom-attribute.ts';

import style from './esds-button.attr.scss?inline';

const styleSheet = InjectableStyleSheet.parse(style);

export interface EsdsButtonAttrDefineOptions {
  readonly registry?: AttributeRegistry;
}

/**
 * A custom attribute for styling buttons while preserving native anchor behavior.
 *
 * @summary Button attribute
 * @element esds-button
 * @attr disabled - Disables the button
 * @attr loading - Displays a loading state on the button
 */
export class EsdsButtonAttr extends CustomAttribute implements CustomAttributeDefinition {
  static define({ registry = AttributeRegistry.root }: EsdsButtonAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-button', EsdsButtonAttr);
  }

  #cleanup: CleanUpFunction | undefined;

  readonly #observer: MutationObserver = new MutationObserver((): void => {
    this.#updateElementState();
  });

  #userDefinedTabIndexValue: string | null | undefined = undefined;

  constructor(attr: Attr) {
    if (attr.ownerElement?.tagName !== 'BUTTON' && attr.ownerElement?.tagName !== 'A') {
      throw new Error('esds-button attribute can only be used on <button> or <a> elements');
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

  #updateElementState(): void {
    const element: HTMLElement = this.ownerElement! as HTMLElement;

    if (isAnchorElement(element)) {
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
    }

    if (isElementLoading(element)) {
      element.setAttribute('aria-label', element.textContent.trim());
    } else {
      element.removeAttribute('aria-label');
    }
  }

  connectedCallback(): void {
    const element: Element = this.ownerElement!;

    this.#cleanup = styleSheet.injectFrom(element);

    if (isAnchorElement(element)) {
      this.#observer.observe(element, {
        attributes: true,
        attributeFilter: ['disabled', 'loading'],
      });

      this.#updateElementState();
    }
  }

  disconnectedCallback(): void {
    this.#cleanup?.();
    this.#cleanup = undefined;

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
