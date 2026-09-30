import { LitElement, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { defineComponent } from '../../helpers/.private/component/define-component.ts';
import style from './esds-separator.component.css?inline';

export type EsdsSeparatorComponentOrientation = 'horizontal' | 'vertical';

/**
 * Separator component that divides content horizontally or vertically.
 *
 * Unlike the native `<hr>` element, it supports vertical orientation.
 *
 * Use this component for interface layouts (menus, toolbars, forms, card sections...).
 *
 * @summary Separator component
 * @element esds-separator
 * @attr orientation - Orientation of the separator ("horizontal" or "vertical").
 * @attr decorative - When present, removes the separator from the accessibility tree.
 * @default orientation 'horizontal'
 * @default decorative false
 */
export class EsdsSeparatorComponent extends LitElement {
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

  /* PRIVATE METHODS */

  /**
   * Sets the separator role once, unless the consumer already provided one.
   */
  public override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'separator');
    }
  }

  protected override updated(): void {
    this.toggleAttribute('aria-hidden', this.decorative);
    if (this.decorative) {
      this.removeAttribute('aria-orientation');
    } else {
      this.setAttribute(
        'aria-orientation',
        this.orientation === 'vertical' ? 'vertical' : 'horizontal',
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'esds-separator': EsdsSeparatorComponent;
  }
}
