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
 * @cssproperty --esds-link-content - Default link color
 * @cssproperty --esds-link-default-text-decoration - Default link text decoration
 * @cssproperty --esds-link-content-visited - Visited link color
 * @cssproperty --esds-link-visited-text-decoration - Visited link text decoration
 * @cssproperty --esds-link-content-hover - Hover link color
 * @cssproperty --esds-link-hover-text-decoration - Hover link text decoration
 * @cssproperty --esds-link-content-pressed - Pressed/active link color
 * @cssproperty --esds-link-pressed-text-decoration - Pressed/active link text decoration
 * @cssproperty --esds-link-content-visited-hover - Visited + hover link color
 * @cssproperty --esds-link-visited-hover-text-decoration - Visited + hover link decoration
 * @cssproperty --esds-link-content-visited-pressed - Visited + pressed link color
 * @cssproperty --esds-link-visited-pressed-text-decoration - Visited + pressed link decoration
 * @cssproperty --esds-link-focus - Focus ring style
 */
export class EsdsLinkAttr extends CustomAttribute implements CustomAttributeDefinition {
  static define({ registry = AttributeRegistry.root }: EsdsLinkAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-link', EsdsLinkAttr);
  }

  #undo: CleanUpFunction | undefined;

  constructor(attr: Attr) {
    if (attr.ownerElement?.tagName !== 'a') {
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
