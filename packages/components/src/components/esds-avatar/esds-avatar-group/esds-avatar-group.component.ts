import { SignalWatcher } from '@lit-labs/signals';
import { html, LitElement, unsafeCSS } from 'lit';
import { defineComponent } from '../../../helpers/.private/component/define-component.ts';

import style from './esds-avatar-group.component.css?inline';

/**
 * EsdsAvatarGroupComponent web component.
 *
 * @summary EsdsAvatarGroupComponent component
 * @element esds-avatar-group
 * @attr {'circle' | 'square'} shape - Avatar's shape.
 */
export class EsdsAvatarGroupComponent extends SignalWatcher(LitElement) {
  static define() {
    defineComponent('esds-avatar-group', this);
  }

  static override styles = unsafeCSS(style);

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'esds-avatar-group': EsdsAvatarGroupComponent;
  }
}
