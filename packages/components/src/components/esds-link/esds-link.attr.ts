import type { CleanUpFunction } from '../../helpers/.private/misc/clean-up-function.ts';
import {
  AttributeRegistry,
  CustomAttribute,
  type CustomAttributeDefinition,
} from '../../helpers/custom-attribute/custom-attribute.ts';
import { InjectableStyleSheet } from '../../helpers/style/injectable-style-sheet.ts';

import style from './esds-link.attr.css?inline';

const styleSheet = InjectableStyleSheet.parse(style);

export interface EsdsLinkAttrDefineOptions {
  readonly registry?: AttributeRegistry;
}

/**
 * A custom attribute for displaying a link with native anchor behavior.
 * Supports click interception via a cancelable custom event.
 *
 * @summary Link attribute
 * @element esds-link
 *
 * @cssproperty --esds-link-focus - Focus ring style
 */
export class EsdsLinkAttr extends CustomAttribute implements CustomAttributeDefinition {
  static define({ registry = AttributeRegistry.root }: EsdsLinkAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-link', EsdsLinkAttr);
  }

  #undo: CleanUpFunction | undefined;

  constructor(attr: Attr) {
    if (attr.ownerElement?.tagName !== 'A') {
      throw new Error('esds-link attribute can only be used on <a> elements');
    }
    super(attr);
  }

  connectedCallback(): void {
    this.#undo = styleSheet.injectFrom(this.ownerElement!);
  }

  disconnectedCallback(): void {
    this.#undo?.();
    this.#undo = undefined;
  }
}
