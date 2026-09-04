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
 */
export class EsdsButtonAttr extends CustomAttribute implements CustomAttributeDefinition {
  static define({ registry = AttributeRegistry.root }: EsdsButtonAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-button', EsdsButtonAttr);
  }

  #cleanup: CleanUpFunction | undefined;

  constructor(attr: Attr) {
    if (attr.ownerElement?.tagName !== 'BUTTON' && attr.ownerElement?.tagName !== 'A') {
      throw new Error('esds-button attribute can only be used on <button> or <a> elements');
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
