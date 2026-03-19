import { IconifyApi } from '../api/iconify-api.ts';
import { type CustomElement } from '../types/custom-element.ts';
import style from './esds-svg.component.css?inline';

const sheet: CSSStyleSheet = new CSSStyleSheet();
sheet.replaceSync(style);

export type EsdsSVGComponentMode = 'svg' | 'bg' | 'mask';
export type EsdsSVGComponentStatus = 'loading' | 'rendered' | 'error';

type AttributeValue = string | null;

/**
 * A WebComponent to display SVGs loaded from an Iconify server.
 */
export class EsdsSVGComponent extends HTMLElement implements CustomElement {
  static api: IconifyApi;

  /**
   * Initializes the WebComponent.
   */
  static init(api: IconifyApi = new IconifyApi()): void {
    if (this.api !== undefined) {
      throw new Error('EsdsSVGComponent already initialized.');
    }
    this.api = api;
    // INFO custom-element is defined AFTER initializing the API, else the "default" API is used too early.
    customElements.define('esds-svg', EsdsSVGComponent);
  }

  static get observedAttributes(): readonly string[] {
    return ['name', 'mode', 'inline', 'nolazy'];
  }

  readonly #shadowRoot: ShadowRoot;

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({
      mode: 'open',
    });

    this.#shadowRoot.adoptedStyleSheets = [sheet];

    this.#startObserver();
  }

  // NAME

  #prefix: string = '';
  #name: string = '';

  /**
   * The name of the icon/illustration to display.
   */
  get name(): string {
    return `${this.#prefix}:${this.#name}`;
  }

  set name(input: string) {
    if (input !== this.name) {
      const index: number = input.indexOf(':');

      if (index === -1) {
        throw new Error(
          'Invalid `name`: missing separator `:` between <prefix> and <name> (`name="<prefix>:<name>"`).',
        );
      }

      this.#prefix = input.slice(0, index);
      this.#name = input.slice(index + 1);

      this.setAttribute('name', this.name);

      this.#queueUpdate();
    }
  }

  #nameAttributeChange(value: AttributeValue): void {
    if (value === null) {
      throw new Error('Missing `name` attribute.');
    }

    this.name = value;
  }

  // MODE

  #mode: EsdsSVGComponentMode = 'svg';

  /**
   * The `mode` to apply:
   *
   * - `svg`: injects the svg as direct <svg> child of this component.
   * - `bg`: uses the svg as "background-image" of this component.
   * - `mask`: injects the svg as "mask-image" of this component: this is useful to apply color to the svg.
   */
  get mode(): EsdsSVGComponentMode {
    return this.#mode;
  }

  set mode(input: EsdsSVGComponentMode) {
    if (input !== this.#mode) {
      if (!['svg', 'bg', 'mask'].includes(input)) {
        throw new Error(`Invalid mode: ${input}. Expected 'svg', 'bg', or 'mask'.`);
      }

      this.#mode = input;

      this.setAttribute('mode', this.#mode);

      this.#queueUpdate();
    }
  }

  #modeAttributeChange(value: AttributeValue): void {
    this.mode = value === null ? 'svg' : (value as EsdsSVGComponentMode);
  }

  // INLINE

  #inline: boolean = false;

  /**
   * Adding `inline` property to the icon component is identical to setting `style="vertical-align: -0.125em"`.
   *
   * This is useful to correct ths icon's alignment.
   */
  get inline(): boolean {
    return this.#inline;
  }

  set inline(input: boolean) {
    if (input !== this.#inline) {
      this.#inline = input;
      setBooleanAttribute(this, 'inline', this.#inline);
    }
  }

  #inlineAttributeChange(value: AttributeValue): void {
    this.inline = attributeValueToBoolean('inline', value);
  }

  // OBSERVER

  #nolazy: boolean = false;
  #visible: boolean = true;
  #observer: IntersectionObserver | undefined;

  /**
   * By default, icons are rendered only when visible to the visitor.
   *
   * You can opt out of this behavior by adding the `nolazy` attribute.
   */
  get nolazy(): boolean {
    return this.#nolazy;
  }

  set nolazy(input: boolean) {
    if (input !== this.#nolazy) {
      this.#nolazy = input;
      setBooleanAttribute(this, 'nolazy', this.#nolazy);
      if (this.#nolazy) {
        this.#stopObserver();
      } else {
        this.#startObserver();
      }
    }
  }

  #nolazyAttributeChange(value: AttributeValue): void {
    this.nolazy = attributeValueToBoolean('nolazy', value);
  }

  /**
   * Starts an IntersectionObserver to have the icon loaded only when visible.
   */
  #startObserver(): void {
    if (this.#observer === undefined) {
      this.#visible = false;
      this.#observer = new IntersectionObserver(
        (entries: readonly IntersectionObserverEntry[]): void => {
          const intersecting: boolean = entries.some(
            (entry: IntersectionObserverEntry): boolean => entry.isIntersecting,
          );
          if (intersecting !== this.#visible) {
            this.#visible = intersecting;
            this.#queueUpdate();
          }
        },
      );
      this.#observer.observe(this);
    }
  }

  /**
   * Stops the IntersectionObserver, and assumes that te icon is always visible.
   */
  #stopObserver(): void {
    if (this.#observer !== undefined) {
      this.#observer.disconnect();
      this.#observer = undefined;
      this.#visible = true;
      this.#queueUpdate();
    }
  }

  // CUSTOM ELEMENT

  /**
   * Connected to DOM
   *
   * @protected
   * @ignore
   */
  connectedCallback() {
    if (!this.#nolazy) {
      this.#startObserver();
    }
  }

  /**
   * Disconnected from DOM
   *
   * @protected
   * @ignore
   */
  disconnectedCallback() {
    this.#stopObserver();
  }

  /**
   * When an attribute changes.
   *
   * @protected
   * @ignore
   */
  attributeChangedCallback(name: string, oldValue: AttributeValue, newValue: AttributeValue): void {
    if (name === 'name') {
      this.#nameAttributeChange(newValue);
    } else if (name === 'mode') {
      this.#modeAttributeChange(newValue);
    } else if (name === 'inline') {
      this.#inlineAttributeChange(newValue);
    } else if (name === 'nolazy') {
      this.#nolazyAttributeChange(newValue);
    } else {
      console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}.`);
    }
  }

  // UPDATE

  #loadSVGController: AbortController | undefined;
  #updateQueued: boolean = false;
  #status: EsdsSVGComponentStatus = 'loading';

  /**
   * Returns the "loading" status of the icon:
   *
   * - `loading`: the icon is currently loading
   * - `rendered`: the icon is rendered
   * - `error`: the icon failed to load
   */
  get status(): EsdsSVGComponentStatus {
    return this.#status;
  }

  /**
   * Queues multiple updates.
   */
  #queueUpdate(): void {
    if (!this.#updateQueued) {
      this.#updateQueued = true;
      queueMicrotask((): void => {
        this.#updateQueued = false;
        this.#update();
      });
    }
  }

  /**
   * Updates the icon:
   *
   * - cancels the previous/pending update (if any)
   * - loads (in batch) the icon
   * - renders it in this WebComponent
   */
  #update(): void {
    if (this.#loadSVGController !== undefined) {
      this.#loadSVGController.abort();
      this.#loadSVGController = undefined;
    }

    if (!this.#visible || !this.isConnected) {
      return;
    }

    this.#loadSVGController = new AbortController();
    const signal: AbortSignal = this.#loadSVGController.signal;
    this.#status = 'loading';

    EsdsSVGComponent.api
      .getSVGOptimized({
        prefix: this.#prefix,
        name: this.#name,
        signal,
      })
      .then((svgContent: string): void => {
        if (!signal.aborted) {
          this.#status = 'rendered';
          if (this.#mode === 'svg') {
            this.style.removeProperty('--svg');
            const document: Document = new DOMParser().parseFromString(svgContent, 'image/svg+xml');
            if (this.#shadowRoot.firstChild === null) {
              this.#shadowRoot.append(document.documentElement);
            } else {
              this.#shadowRoot.firstChild.replaceWith(document.documentElement);
            }
          } else if (this.#mode === 'bg' || this.#mode === 'mask') {
            this.#shadowRoot.firstChild?.remove();
            this.style.setProperty('--svg', `url('data:image/svg+xml;base64,${btoa(svgContent)}')`);
          }
        }
      })
      .catch((error: unknown): void => {
        if (!signal.aborted) {
          this.#status = 'error';
          console.error(`Failed to load icon: "${this.name}"`, error);
        }
      });
  }
}

/*----------*/

/**
 * Converts a "boolean" attribute into a `boolean`.
 */
function attributeValueToBoolean(name: string, value: AttributeValue): boolean {
  if (value === null || value === 'false') {
    return false;
  } else if (value === '' || value === 'true') {
    return true;
  } else {
    throw new Error(`Invalid "${name}" attribute.`);
  }
}

function setBooleanAttribute(element: Element, name: string, value: boolean): void {
  if (value) {
    element.setAttribute(name, '');
  } else {
    element.removeAttribute(name);
  }
}
