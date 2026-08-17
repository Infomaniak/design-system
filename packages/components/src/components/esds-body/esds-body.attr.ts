import type { CleanUpFunction } from '../../helpers/.private/misc/clean-up-function.ts';
import { InjectableStyleSheet } from '../../helpers/.private/style/injectable-style-sheet.ts';
import {
  AttributeRegistry,
  CustomAttribute,
  type CustomAttributeDefinition,
} from '../../helpers/custom-attribute/custom-attribute.ts';

import style from './esds-body.attr.css?inline';

const styleSheet = InjectableStyleSheet.parse(style);

export interface EsdsBodyAttrDefineOptions {
  readonly registry?: AttributeRegistry;
}

/**
 * A custom attribute for styling text contents (p, div, span) while preserving native semantic.
 *
 * @summary EsdsBodyAttr custom attribute
 * @element esds-body
 * @cssproperty --esds-body-margin-block The "block" margin to apply to the element (only available for p).
 * @cssproperty --esds-body-margin-inline The "inline" margin to apply to the element (only available for p).
 */
export class EsdsBodyAttr extends CustomAttribute implements CustomAttributeDefinition {
  static define({ registry = AttributeRegistry.root }: EsdsBodyAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-body', EsdsBodyAttr);
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
