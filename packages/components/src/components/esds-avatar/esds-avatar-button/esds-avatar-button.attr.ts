/*
  POC (forward-port from PR #457, head 86ddd849): proves the headless-button behavior/look split on
  develop. #457 adopts the headless base on landing — reconcile then (and drop the local avatar
  token fallbacks below once the avatar t3-component tokens land).
*/

import type { CleanUpFunction } from '../../../helpers/.private/misc/clean-up-function.ts';
import { InjectableStyleSheet } from '../../../helpers/.private/style/injectable-style-sheet.ts';
import { AttributeRegistry } from '../../../helpers/custom-attribute/custom-attribute.ts';
import { EsdsHeadlessButtonAttr } from '../../esds-headless-button/esds-headless-button.attr.ts';

import style from './esds-avatar-button.attr.scss?inline';

const styleSheet = InjectableStyleSheet.parse(style);

export interface EsdsAvatarButtonAttrDefineOptions {
  readonly registry?: AttributeRegistry;
}

/**
 * A custom attribute turning a `<button>` or `<a>` element into an avatar button.
 *
 * The button behavior (semantics, keyboard activation, state sync) is inherited from
 * `EsdsHeadlessButtonAttr`; this class only adds the avatar-button look.
 *
 * @summary Avatar Button attribute
 * @element esds-avatar-button
 * @attr disabled - Disables the button
 * @attr loading - Pauses interactions and mirrors `aria-busy` while loading (no spinner on the avatar)
 */
export class EsdsAvatarButtonAttr extends EsdsHeadlessButtonAttr {
  static override define({
    registry = AttributeRegistry.root,
  }: EsdsAvatarButtonAttrDefineOptions = {}): void {
    registry.defineOptionally('esds-avatar-button', EsdsAvatarButtonAttr);

    EsdsHeadlessButtonAttr.define();
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
