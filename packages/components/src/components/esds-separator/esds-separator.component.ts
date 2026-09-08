import { signal, SignalWatcher } from '@lit-labs/signals';
import { html, LitElement, unsafeCSS, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { defineComponent } from '../../helpers/.private/component/define-component.ts';
import type { WritableSignal } from '../../helpers/.private/signal/signal/writable-signal.ts';
import style from './esds-separator.component.css?inline';

export type EsdsSeparatorComponentOrientation = 'horizontal' | 'vertical';

/**
 * Separator component that divides content horizontally or vertically.
 *
 * Unlike the native `<hr>` element, it supports vertical orientation and can display
 * content (a label, an icon...) between its two lines via its default slot.
 *
 * Use this component for interface layouts (menus, toolbars, forms, card sections...).
 *
 * @summary Separator component
 * @element esds-separator
 * @slot - Content displayed between the two lines.
 * @attr orientation - Orientation of the separator ("horizontal" or "vertical").
 * @attr decorative - When present, removes the separator from the accessibility tree.
 * @default orientation 'horizontal'
 * @default decorative false
 */
export class EsdsSeparatorComponent extends SignalWatcher(LitElement) {
  static define(): void {
    defineComponent('esds-separator', this);
  }

  static override styles = unsafeCSS(style);

  /* PUBLIC PROPERTIES */

  /**
   * Orientation of the separator. Any value other than "vertical" is treated as horizontal.
   *
   * @attr orientation
   * @default 'horizontal'
   */
  @property({ type: String, reflect: true })
  accessor orientation: EsdsSeparatorComponentOrientation = 'horizontal';

  /**
   * When true, removes the separator from the accessibility tree.
   *
   * @attr decorative
   * @default false
   * @reflect
   */
  @property({ type: Boolean, reflect: true })
  accessor decorative: boolean = false;

  /* INTERNAL */

  readonly #hasContent: WritableSignal<boolean> = signal<boolean>(false);

  readonly #observer: MutationObserver = new MutationObserver(() => {
    this.#updateHasContent();
  });

  override connectedCallback(): void {
    super.connectedCallback();
    // Light DOM mutations are observed rather than relying on `slotchange`,
    // which is not fired on initial assignment in every environment.
    this.#observer.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    this.#updateHasContent();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#observer.disconnect();
  }

  protected override updated(): void {
    if (this.decorative) {
      this.setAttribute('role', 'presentation');
      this.removeAttribute('aria-orientation');
    } else {
      this.setAttribute('role', 'separator');
      this.setAttribute(
        'aria-orientation',
        this.orientation === 'vertical' ? 'vertical' : 'horizontal',
      );
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div class="separator">
        <span class="line"></span>
        <span
          class="content"
          ?hidden="${!this.#hasContent.get()}"
        >
          <slot></slot>
        </span>
        <span class="line"></span>
      </div>
    `;
  }

  #updateHasContent(): void {
    // Light DOM children are what the single default slot would assign, so they
    // can be inspected directly — including before the slot is first rendered.
    const hasContent: boolean = Array.from(this.childNodes).some((node: Node): boolean =>
      this.#hasVisibleContent(node),
    );

    this.#hasContent.set(hasContent);
  }

  #hasVisibleContent(node: Node): boolean {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').trim().length > 0;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }
    // Comments and other non-text, non-element nodes are never assigned to the
    // default slot, so they do not count as content.
    return false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'esds-separator': EsdsSeparatorComponent;
  }
}
