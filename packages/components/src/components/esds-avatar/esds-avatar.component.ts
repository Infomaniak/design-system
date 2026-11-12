import { signal, SignalWatcher } from '@lit-labs/signals';
import {
  html,
  LitElement,
  nothing,
  unsafeCSS,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { property } from 'lit/decorators.js';
import { batch } from 'signal-utils/subtle/batched-effect';
import { defineComponent } from '../../helpers/.private/component/define-component.ts';
import { hostAttribute } from '../../helpers/.private/signal/component/host-attribute/host-attribute.ts';
import { signalProperty } from '../../helpers/.private/signal/component/signal-property/signal-property.ts';
import type { WritableSignal } from '../../helpers/.private/signal/signal/writable-signal.ts';
import { EsdsIconComponent } from '../esds-icon/esds-icon.component.ts';

import style from './esds-avatar.component.css?inline';

export type EsdsAvatarComponentImageState = 'loading' | 'loaded' | 'error';

/**
 * EsdsAvatarComponent web component.
 *
 * @summary EsdsAvatarComponent component
 * @element esds-avatar
 * @attr {'circle' | 'square'} shape - Avatar's shape.
 * @attr {'loading' | 'loaded' | 'error'} data-image-state - Image loading state, absent when no image is provided.
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
  @property({ type: String, reflect: true })
  accessor image: string | undefined;

  readonly #image: WritableSignal<string | undefined> = signalProperty(this, 'image');

  // IMAGE STATE

  /**
   * Image loading state, reflected as the `data-image-state` attribute on the host.
   *
   * It is `undefined` while no image is provided, `'loading'` while the image is loading,
   * `'loaded'` once loaded, and `'error'` if loading failed. While the image is not loaded,
   * a fallback content is displayed instead (initials, icon or default user icon).
   */
  readonly #imageState: WritableSignal<EsdsAvatarComponentImageState | undefined> = signal<
    EsdsAvatarComponentImageState | undefined
  >(undefined);

  // ICON

  /**
   * Icon identifier in `prefix:name` format.
   *
   * @attr icon
   */
  @property({ type: String, reflect: true })
  accessor icon: string | undefined;

  readonly #icon: WritableSignal<string | undefined> = signalProperty(this, 'icon');

  // INITIALS

  /**
   * Initials to display.
   *
   * @attr initials
   */
  @property({ type: String, reflect: true })
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

  constructor() {
    super();

    hostAttribute(this, 'data-image-state', this.#imageState);
  }

  override render() {
    const image: string | undefined = this.#image.get();

    if (!image) {
      return this.#renderFallbackContent();
    }

    const label: string = this.#label.get() ?? 'avatar with image';
    const imageLoaded: boolean = this.#imageState.get() === 'loaded';

    return html`
      ${imageLoaded ? nothing : this.#renderFallbackContent()}
      <img
        src=${image}
        alt="${label}"
        ?hidden=${!imageLoaded}
        @load=${this.#onImageLoad}
        @error=${this.#onImageError}
      />
    `;
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('image')) {
      batch((): void => {
        this.#imageState.set(this.image ? 'loading' : undefined);
      });
    }
  }

  /* INTERNAL */

  readonly #onImageLoad = (): void => {
    batch((): void => {
      this.#imageState.set('loaded');
    });
  };

  readonly #onImageError = (): void => {
    batch((): void => {
      this.#imageState.set('error');
    });
  };

  /**
   * Renders the best available non-image content: the initials, the icon, or a default user icon.
   *
   * It is displayed as-is when no image is provided, and as a fallback while the image is
   * loading or when it failed to load.
   */
  #renderFallbackContent(): TemplateResult {
    if (this.#initials.get()) {
      return html`<div
        class="initials"
        role="img"
        aria-label="${this.#label.get() ?? `avatar with initials: ${this.#initials.get()}`}"
      >
        ${this.#initials.get()}
      </div>`;
    } else if (this.#icon.get()) {
      return html`<esds-icon
        role="img"
        name=${this.#icon.get()}
        aria-label="${this.#label.get() ?? 'avatar with icon'}"
      ></esds-icon>`;
    } else {
      return html`<esds-icon
        role="img"
        name="esds:user"
        aria-label="${this.#label.get() ?? 'avatar with icon'}"
      ></esds-icon>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'esds-avatar': EsdsAvatarComponent;
  }
}
