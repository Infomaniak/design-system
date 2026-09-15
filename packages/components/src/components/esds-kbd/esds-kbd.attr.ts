import type { CleanUpFunction } from '../../helpers/.private/misc/clean-up-function.ts';
import { InjectableStyleSheet } from '../../helpers/.private/style/injectable-style-sheet.ts';
import {
  AttributeRegistry,
  CustomAttribute,
  type CustomAttributeDefinition,
} from '../../helpers/custom-attribute/custom-attribute.ts';

import style from './esds-kbd.attr.css?inline';

const styleSheet = InjectableStyleSheet.parse(style);

export interface EsdsKbdAttrDefineOptions {
  readonly registry?: AttributeRegistry;
}

/**
 * A custom attribute for styling keyboard keys while preserving native semantics.
 *
 * @summary Kbd attribute
 * @element esds-kbd
 */
export class EsdsKbdAttr extends CustomAttribute implements CustomAttributeDefinition {
  static define({ registry = AttributeRegistry.root }: EsdsKbdAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-kbd', EsdsKbdAttr);
  }

  #cleanup: CleanUpFunction | undefined;

  constructor(attr: Attr) {
    if (attr.ownerElement?.tagName !== 'KBD') {
      throw new Error('esds-kbd attribute can only be used on <kbd> elements');
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
