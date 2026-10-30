import { EsdsIconComponent } from '@infomaniak-design-system/components';
import { SignalWatcher } from '@lit-labs/signals';
import { html, LitElement, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { defineComponent } from '../../helpers/.private/component/define-component.ts';
import { signalProperty } from '../../helpers/.private/signal/component/signal-property/signal-property.ts';
import type { WritableSignal } from '../../helpers/.private/signal/signal/writable-signal.ts';

import style from './esds-avatar.component.css?inline';

/**
 * EsdsAvatarComponent web component.
 *
 * @summary EsdsAvatarComponent component
 * @element esds-avatar
 */
export class EsdsAvatarComponent extends SignalWatcher(LitElement) {
  static define() {
    defineComponent('esds-avatar', this);

    EsdsIconComponent.define();
  }

  static override styles = unsafeCSS(style);

  /* PUBLIC PROPERTIES */

  // IMAGE

  /**
   * Image source url.
   *
   * @attr image
   */
  @property({ type: String })
  accessor image: string | undefined;

  readonly #image: WritableSignal<string | undefined> = signalProperty(this, 'image');

  // ICON

  /**
   * Icon identifier in `prefix:name` format.
   *
   * @attr icon
   */
  @property({ type: String })
  accessor icon: string | undefined;

  readonly #icon: WritableSignal<string | undefined> = signalProperty(this, 'icon');

  // INITIALS

  /**
   * Initials to display.
   *
   * @attr initials
   */
  @property({ type: String })
  accessor initials: string | undefined;

  readonly #initials: WritableSignal<string | undefined> = signalProperty(this, 'initials');

  // LABEL

  /**
   * Label for assistive technologies.
   *
   * @attr label
   */
  @property({ type: String })
  accessor label: string | undefined;

  readonly #label: WritableSignal<string | undefined> = signalProperty(this, 'label');

  override render() {
    if (this.#image.get()) {
      const label: string = this.#label.get() ?? 'avatar with image';

      return html`<img
        role="img"
        src=${this.#image.get()}
        alt="${label}"
        aria-label="${label}"
      />`;
    } else if (this.#icon.get()) {
      return html`<esds-icon name=${this.#icon.get()}></esds-icon>`;
    } else if (this.#initials.get()) {
      return html`<div
        class="initials"
        role="img"
        aria-label="${this.#label.get() ?? `avatar with initials: ${this.#initials.get()}`}"
      >
        ${this.#initials.get()}
      </div>`;
    } else {
      return html`<esds-icon name="esds:user"></esds-icon>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'esds-avatar': EsdsAvatarComponent;
  }
}
