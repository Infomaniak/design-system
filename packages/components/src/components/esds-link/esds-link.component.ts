import { html, LitElement, nothing, type TemplateResult, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { defineComponent } from '../../helpers/.private/component/define-component.ts';
import style from './esds-link.component.css?inline';

/**
 * Web component for displaying a link with native anchor behavior.
 * Supports click interception via a cancelable custom event.
 *
 * @summary Link component
 * @element esds-link
 * @slot - Default slot for link content (text, icons, etc.)
 * @csspart base - The internal anchor element
 * @fires esds-link-click - Fired when the link is clicked, contains the original MouseEvent in detail. Always a MouseEvent (Enter key triggers native click synthesis)
 *
 * @cssproperty --esds-link-default-color - Default link color
 * @cssproperty --esds-link-default-text-decoration - Default link text decoration
 * @cssproperty --esds-link-visited-color - Visited link color
 * @cssproperty --esds-link-visited-text-decoration - Visited link text decoration
 * @cssproperty --esds-link-hover-color - Hover link color
 * @cssproperty --esds-link-hover-text-decoration - Hover link text decoration
 * @cssproperty --esds-link-pressed-color - Pressed/active link color
 * @cssproperty --esds-link-pressed-text-decoration - Pressed/active link text decoration
 * @cssproperty --esds-link-visited-hover-color - Visited + hover link color
 * @cssproperty --esds-link-visited-hover-text-decoration - Visited + hover link decoration
 * @cssproperty --esds-link-visited-pressed-color - Visited + pressed link color
 * @cssproperty --esds-link-visited-pressed-text-decoration - Visited + pressed link decoration
 * @cssproperty --esds-focus-ring - Focus ring style
 */
export class EsdsLinkComponent extends LitElement {
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static define() {
    defineComponent('esds-link', this);
  }

  static override styles = unsafeCSS(style);

  /**
   * URL to navigate to.
   * @attr href
   * @default ''
   */
  @property({ type: String, reflect: true })
  accessor href: string = '';

  /**
   * Where to display the linked resource.
   * @attr target
   * @default ''
   */
  @property({ type: String, reflect: true })
  accessor target: string = '';

  /**
   * Relationship between the current document and the linked resource.
   * When omitted (default `undefined`), the component auto-adds
   * `noopener noreferrer` when `target="_blank"` is used.
   * Set to a custom value (e.g. `'nofollow'`) to use that instead.
   * Set to `''` to explicitly opt out of the auto-add behavior.
   *
   * @attr rel
   * @default undefined
   */
  @property({ type: String, reflect: true })
  accessor rel: string | undefined = undefined;

  /**
   * Filename for download attribute.
   * @attr download
   * @default undefined
   */
  @property({ type: String, reflect: true })
  accessor download: string | undefined = undefined;

  /**
   * Advisory information for the link (shown as tooltip).
   * @attr title
   * @default ''
   */
  @property({ type: String, reflect: true })
  override accessor title: string = '';

  /**
   * Referrer policy for the link.
   * @attr referrerpolicy
   * @default ''
   */
  @property({ type: String, reflect: true, attribute: 'referrerpolicy' })
  accessor referrerPolicy: string = '';

  /**
   * Auto-adds `noopener noreferrer` when `target="_blank"` is used
   * and the `rel` property has not been explicitly set.
   */
  get #computedRel(): string | undefined {
    if (this.target === '_blank' && this.rel === undefined) {
      return 'noopener noreferrer';
    }
    return this.rel;
  }

  #dispatchLinkEvent(nativeEvent: Event): void {
    const customEvent = new CustomEvent('esds-link-click', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { nativeEvent },
    });

    this.dispatchEvent(customEvent);

    if (customEvent.defaultPrevented) {
      nativeEvent.preventDefault();
    }
  }

  #handleClick(event: MouseEvent): void {
    this.#dispatchLinkEvent(event);
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (changed.has('href') && !this.href) {
      console.warn(
        `[esds-link] Missing "href" attribute — the link will not be keyboard accessible.`,
      );
    }
  }

  override render(): TemplateResult {
    return html`
      <a
        part="base"
        href=${this.href || nothing}
        target=${this.target || nothing}
        rel=${this.#computedRel || nothing}
        download=${this.download ?? nothing}
        aria-label=${this.ariaLabel || nothing}
        aria-current=${this.ariaCurrent || nothing}
        title=${this.title || nothing}
        referrerpolicy=${this.referrerPolicy || nothing}
        @click=${this.#handleClick}
      >
        <slot></slot>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'esds-link': EsdsLinkComponent;
  }
}
