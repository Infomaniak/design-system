import type { CleanUpFunction } from '../../../helpers/.private/misc/clean-up-function.ts';
import { InjectableStyleSheet } from '../../../helpers/.private/style/injectable-style-sheet.ts';
import { AttributeRegistry } from '../../../helpers/custom-attribute/custom-attribute.ts';
import { EsdsButtonAttr } from '../../esds-button/esds-button.attr.ts';

import style from './esds-avatar-button.attr.scss?inline';

const styleSheet = InjectableStyleSheet.parse(style);

export interface EsdsAvatarButtonAttrDefineOptions {
  readonly registry?: AttributeRegistry;
}

/**
 * A custom attribute for styling avatar buttons while preserving native anchor behavior.
 *
 * @summary Avatar Button attribute
 * @element esds-avatar-button
 * @attr disabled - Disables the button
 * @attr loading - No loading state
 */
export class EsdsAvatarButtonAttr extends EsdsButtonAttr {
  static override define({
    registry = AttributeRegistry.root,
  }: EsdsAvatarButtonAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-avatar-button', EsdsAvatarButtonAttr);

    EsdsButtonAttr.define();
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
