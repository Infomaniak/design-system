import type { CleanUpFunction } from '../../helpers/.private/misc/clean-up-function.ts';
import { InjectableStyleSheet } from '../../helpers/.private/style/injectable-style-sheet.ts';
import { AttributeRegistry } from '../../helpers/custom-attribute/custom-attribute.ts';
import { EsdsHeadlessButtonAttr } from '../esds-headless-button/esds-headless-button.attr.ts';

import style from './esds-button.attr.scss?inline';

const styleSheet = InjectableStyleSheet.parse(style);

export interface EsdsButtonAttrDefineOptions {
  readonly registry?: AttributeRegistry;
}

/**
 * A custom attribute for styling buttons while preserving native anchor behavior.
 *
 * The button behavior (semantics, keyboard activation, state sync) is inherited from
 * `EsdsHeadlessButtonAttr`; this class only adds the design-system look.
 *
 * @summary Button attribute
 * @element esds-button
 * @attr disabled - Disables the button
 * @attr loading - Displays a loading state on the button
 */
export class EsdsButtonAttr extends EsdsHeadlessButtonAttr {
  static override define({
    registry = AttributeRegistry.root,
  }: EsdsButtonAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-button', EsdsButtonAttr);
  }

  #cleanup: CleanUpFunction | undefined;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#cleanup = styleSheet.injectFrom(this.ownerElement!);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#cleanup?.();
    this.#cleanup = undefined;
  }
}
