import { signal, SignalWatcher } from '@lit-labs/signals';
import { html, LitElement, type PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import style from './draft-component.component.css?inline';

/**
 * DraftComponentComponent web component.
 * @summary DraftComponentComponent component
 * @element draft-component
 * @slot - Default slot. Falls back to the `label` property when empty.
 */
@customElement('draft-component')
export class DraftComponentComponent extends SignalWatcher(LitElement) {
  static override styles = unsafeCSS(style);

  /**
   * Text label displayed when the default slot is empty.
   * @attr label
   */
  @property({ type: String })
  accessor label: string = '';

  readonly #label = signal<string>('');

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('label')) {
      this.#label.set(this.label);
    }
  }

  override render() {
    return html`<slot>${this.#label.get()}</slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'draft-component': DraftComponentComponent;
  }
}
