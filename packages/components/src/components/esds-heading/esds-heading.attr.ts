import type { CleanUpFunction } from '../../helpers/.private/misc/clean-up-function.ts';
import { InjectableStyleSheet } from '../../helpers/.private/style/injectable-style-sheet.ts';
import {
  AttributeRegistry,
  CustomAttribute,
  type CustomAttributeDefinition,
} from '../../helpers/custom-attribute/custom-attribute.ts';

import style from './esds-heading.attr.css?inline';

const styleSheet = InjectableStyleSheet.parse(style);

export interface EsdsHeadingAttrDefineOptions {
  readonly registry?: AttributeRegistry;
}

/**
 * A custom attribute for styling headings (h1..h6) while preserving native semantics.
 *
 * @summary EsdsHeadingAttr custom attribute
 * @element esds-heading
 * @cssproperty --esds-heading-margin-block The "block" margin to apply to the element (default: 0, only available for h1..h6).
 * @cssproperty --esds-heading-margin-inline The "inline" margin to apply to the element (default: 0, only available for h1..h6).
 */
export class EsdsHeadingAttr extends CustomAttribute implements CustomAttributeDefinition {
  static define({ registry = AttributeRegistry.root }: EsdsHeadingAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-heading', EsdsHeadingAttr);
  }

  #cleanup: CleanUpFunction | undefined;

  connectedCallback(): void {
    this.#cleanup = styleSheet.injectFrom(this.ownerElement!);
  }

  disconnectedCallback(): void {
    this.#cleanup?.();
    this.#cleanup = undefined;
  }
}
