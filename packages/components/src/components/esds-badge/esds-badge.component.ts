import { SignalWatcher } from '@lit-labs/signals';
import { html, LitElement, unsafeCSS } from 'lit';
import { defineComponent } from '../../helpers/.private/component/define-component.ts';

import style from './esds-badge.component.css?inline';

/**
 * EsdsBadgeComponent web component.
 *
 * @summary EsdsBadgeComponent component
 * @element esds-badge
 * @slot - Contains the content of the badge.
 */
export class EsdsBadgeComponent extends SignalWatcher(LitElement) {
  static define() {
    defineComponent('esds-badge', this);
  }

  static override styles = unsafeCSS(style);

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'status');
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'esds-badge': EsdsBadgeComponent;
  }
}
