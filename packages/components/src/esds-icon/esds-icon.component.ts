import { signal, SignalWatcher } from '@lit-labs/signals';
import { html, LitElement, type TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { batch, batchedEffect } from 'signal-utils/subtle/batched-effect';

import { signalProperty } from '../helpers.private/signal/signal-property.ts';
import type { WritableSignal } from '../helpers.private/signal/writable-signal.ts';
import style from './esds-icon.component.css?inline';
import { getApi } from './esds-icon.component.private.ts';

export type EsdsIconComponentMode = 'svg' | 'bg' | 'mask';
export type EsdsIconComponentStatus = 'loading' | 'rendered' | 'error';

/**
 * Web component for displaying icons from the Infomaniak Design System icon library.
 * @summary Icon component
 * @element esds-icon-lit
 */
@customElement('esds-icon-lit') // TODO: change to `esds-icon` once we don't have a conflict with the other component
export class EsdsIconComponent extends SignalWatcher(LitElement) {
  static override styles = unsafeCSS(style);

  /* PROPERTIES */

  /**
   * Icon identifier in `prefix:name` format.
   * @attr name
   */
  @property({ type: String })
  accessor name: string = '';

  readonly #name: WritableSignal<string> = signalProperty(this, 'name');

  /**
   * The rendering mode to apply.
   * - `svg`: Renders SVG inline inside the component.
   * - `bg`: Uses CSS `background-image` with the SVG encoded as a data URL.
   * - `mask`: Uses CSS `mask-image` for current-color icon rendering.
   * @attr mode
   * @default 'svg'
   */
  @property({
    type: String,
    reflect: true,
    converter: (input: string | null): EsdsIconComponentMode => {
      if (input === null) {
        return 'svg';
      }

      if (!['svg', 'bg', 'mask'].includes(input)) {
        throw new Error(`Invalid mode: ${input}. Expected 'svg', 'bg', or 'mask'.`);
      }

      return input as EsdsIconComponentMode;
    },
  })
  accessor mode: EsdsIconComponentMode = 'svg';

  /**
   * Adjusts vertical alignment for inline use (shifts by -0.125em).
   * @attr inline
   * @reflect
   */
  @property({ type: Boolean, reflect: true })
  accessor inline: boolean = false;

  readonly #status: WritableSignal<EsdsIconComponentStatus> =
    signal<EsdsIconComponentStatus>('loading');

  /**
   * Read-only loading state of the icon.
   */
  get status(): EsdsIconComponentStatus {
    return this.#status.get();
  }

  /* INTERNAL */

  constructor() {
    super();

    batchedEffect((): void => {
      this.#loadIcon();
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#startObserver();
  }

  override disconnectedCallback(): void {
    this.#stopObserver();
    super.disconnectedCallback();
  }

  readonly #svgNode: WritableSignal<SVGSVGElement | null> = signal<SVGSVGElement | null>(null);

  override render(): TemplateResult {
    console.log('render');
    return html`${this.#svgNode.get()}`;
  }

  // OBSERVER

  readonly #visible: WritableSignal<boolean> = signal<boolean>(false);

  #observer: IntersectionObserver | undefined;

  /**
   * Starts an IntersectionObserver to have the icon loaded only when visible.
   */
  #startObserver(): void {
    if (this.#observer === undefined) {
      batch((): void => {
        this.#visible.set(false);
      });
      this.#observer = new IntersectionObserver(
        (entries: readonly IntersectionObserverEntry[]): void => {
          const intersecting: boolean = entries.some(
            (entry: IntersectionObserverEntry): boolean => entry.isIntersecting,
          );
          batch((): void => {
            this.#visible.set(intersecting);
          });
        },
      );
      this.#observer.observe(this);
    }
  }

  /**
   * Stops the IntersectionObserver, and assumes that te icon is no more visible.
   */
  #stopObserver(): void {
    if (this.#observer !== undefined) {
      this.#observer.disconnect();
      this.#observer = undefined;
      this.#visible.set(false);
    }
  }

  // LOAD ICON

  #abortController: AbortController | undefined;

  #loadIcon(): void {
    console.log('#loadIcon');
    this.#abortPendingFetch();

    if (!this.#visible.get() || !this.isConnected) {
      return;
    }

    const name: string = this.#name.get();
    const prefixToNameSeparatorIndex: number = name.indexOf(':');

    if (prefixToNameSeparatorIndex === -1) {
      return;
      // throw new Error(
      //   'Invalid `name`: missing separator `:` between <prefix> and <name> (`name="<prefix>:<name>"`).',
      // );
    }

    this.#abortController = new AbortController();
    const signal: AbortSignal = this.#abortController.signal;

    batch((): void => {
      this.#status.set('loading');
      // this.#svgNode.set(null);
    });

    getApi()
      .getSVG({
        prefix: name.slice(0, prefixToNameSeparatorIndex),
        name: name.slice(prefixToNameSeparatorIndex + 1),
        signal,
      })
      .then((svgContent: string): void => {
        if (signal.aborted) {
          return;
        }

        batch((): void => {
          this.#status.set('rendered');

          if (this.mode === 'svg') {
            this.style.removeProperty('--svg');
            this.#svgNode.set(
              new DOMParser().parseFromString(svgContent, 'image/svg+xml')
                .documentElement as Element as SVGSVGElement,
            );
          } else {
            this.#svgNode.set(null);
            this.style.setProperty('--svg', `url('data:image/svg+xml;base64,${btoa(svgContent)}')`);
          }
        });
      })
      .catch((error: unknown): void => {
        if (signal.aborted) {
          return;
        }

        batch((): void => {
          this.#status.set('error');
          this.#svgNode.set(null);
        });

        this.style.removeProperty('--svg');
        console.error(`Failed to load icon: "${this.#name.get()}"`, error);
      });
  }

  #abortPendingFetch(): void {
    if (this.#abortController !== undefined) {
      this.#abortController.abort();
      this.#abortController = undefined;
    }
  }

  // override willUpdate(changedProperties: PropertyValues<this>): void {
  //   super.willUpdate(changedProperties);
  //
  //   if (changedProperties.has('name')) {
  //     if (this.name && !this.name.includes(':')) {
  //       throw new Error(
  //         'Invalid `name`: missing separator `:` between <prefix> and <name> (`name="<prefix>:<name>"`).',
  //       );
  //     }
  //     this._parseName();
  //     this.#abortPendingFetch();
  //   }
  //
  //   if (changedProperties.has('mode')) {
  //     if (!this.mode) {
  //       this.mode = 'svg';
  //     }
  //     if (!['svg', 'bg', 'mask'].includes(this.mode)) {
  //       throw new Error(`Invalid mode: ${this.mode}. Expected 'svg', 'bg', or 'mask'.`);
  //     }
  //     if (this.mode !== 'svg') {
  //       this._svgNode = null;
  //     } else {
  //       this.style.removeProperty('--svg');
  //     }
  //   }
  //
  //   if (this._visible && (changedProperties.has('name') || changedProperties.has('mode'))) {
  //     this.#loadIcon();
  //   }
  // }
  //
  // /** @internal */
  // private _parseName(): void {
  //   if (this.name && this.name.includes(':')) {
  //     const index = this.name.indexOf(':');
  //     this._prefix = this.name.slice(0, index);
  //     this._iconName = this.name.slice(index + 1);
  //   } else {
  //     this._prefix = '';
  //     this._iconName = '';
  //   }
  // }
  //
  // /** @internal */
  // private _parseSvgToDom(svgString: string): SVGSVGElement {
  //   const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  //   const svg = doc.querySelector('svg');
  //
  //   if (!svg) {
  //     throw new Error('Sanitized SVG contains no <svg> element');
  //   }
  //
  //   return svg.cloneNode(true) as SVGSVGElement;
  // }
}
