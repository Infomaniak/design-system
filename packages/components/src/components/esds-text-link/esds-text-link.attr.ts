import type { CleanUpFunction } from '../../helpers/.private/misc/clean-up-function.ts';
import {
  AttributeRegistry,
  CustomAttribute,
  type CustomAttributeDefinition,
} from '../../helpers/custom-attribute/custom-attribute.ts';
import { InjectableStyleSheet } from '../../helpers/style/injectable-style-sheet.ts';

import style from './esds-text-link.attr.css?inline';

const styleSheet = InjectableStyleSheet.parse(style);

export interface EsdsLinkAttrDefineOptions {
  readonly registry?: AttributeRegistry;
}

/**
 * A custom attribute for displaying a link with native anchor behavior.
 * Supports click interception via a cancelable custom event.
 *
 * @summary Link attribute
 * @element esds-text-link
 */
export class EsdsTextLinkAttr extends CustomAttribute implements CustomAttributeDefinition {
  static define({ registry = AttributeRegistry.root }: EsdsLinkAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-text-link', EsdsTextLinkAttr);
  }

  #cleanup: CleanUpFunction | undefined;

  constructor(attr: Attr) {
    if (attr.ownerElement?.tagName !== 'A') {
      throw new Error('esds-text-link attribute can only be used on <a> elements');
    }
    super(attr);
  }

  connectedCallback(): void {
    this.#cleanup = styleSheet.injectFrom(this.ownerElement!);
  }

  disconnectedCallback(): void {
    this.#cleanup?.();
    this.#cleanup = undefined;
  }
}
