import { IconifyApi } from '@infomaniak-design-system/esds-icon';
import { signal, SignalWatcher } from '@lit-labs/signals';
import { html, LitElement, type TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { batch } from 'signal-utils/subtle/batched-effect';
import { componentEffect } from '../helpers.private/signal/component/component-effect/component-effect.ts';

import { signalProperty } from '../helpers.private/signal/component/signal-property/signal-property.ts';
import type { WritableSignal } from '../helpers.private/signal/signal/writable-signal.ts';
import style from './esds-icon.component.css?inline';

export type EsdsIconComponentStatus = 'loading' | 'rendered' | 'error';

const _apiCache = new Map<string, IconifyApi>();

/** @internal for testing only */
export function _clearApiCache(): void {
  _apiCache.clear();
}

/** @internal for testing only */
export function _getApiCacheSize(): number {
  return _apiCache.size;
}

function getApi(endpoint: string = 'https://iconify.infomaniak.com'): IconifyApi {
  if (!_apiCache.has(endpoint)) {
    _apiCache.set(endpoint, new IconifyApi({ resources: [endpoint] }));
  }
  return _apiCache.get(endpoint)!;
}

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
  accessor name!: string;

  readonly #name: WritableSignal<string> = signalProperty(this, 'name');

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

    componentEffect(this, (): void => {
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
    this.#abortPendingFetch();

    if (!this.#visible.get() || !this.isConnected) {
      return;
    }

    const name: string = this.#name.get();
    const prefixToNameSeparatorIndex: number = name.indexOf(':');

    if (prefixToNameSeparatorIndex === -1) {
      throw new Error(
        'Invalid `name`: missing separator `:` between <prefix> and <name> (`name="<prefix>:<name>"`).',
      );
    }

    this.#abortController = new AbortController();
    const signal: AbortSignal = this.#abortController.signal;

    batch((): void => {
      this.#status.set('loading');
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

          this.#svgNode.set(
            new DOMParser().parseFromString(svgContent, 'image/svg+xml')
              .documentElement as Element as SVGSVGElement,
          );
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

        console.error(`Failed to load icon: "${this.#name.get()}"`, error);
      });
  }

  #abortPendingFetch(): void {
    if (this.#abortController !== undefined) {
      this.#abortController.abort();
      this.#abortController = undefined;
    }
  }
}
