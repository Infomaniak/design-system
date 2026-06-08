import { signal, SignalWatcher } from '@lit-labs/signals';
import { html, LitElement, type TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { batch } from 'signal-utils/subtle/batched-effect';
import { onConnected } from '../helpers.private/component/on-connected.ts';
import type { CleanUpFunction } from '../helpers.private/misc/clean-up-function.ts';
import { componentEffect } from '../helpers.private/signal/component/component-effect/component-effect.ts';

import { signalProperty } from '../helpers.private/signal/component/signal-property/signal-property.ts';
import type { WritableSignal } from '../helpers.private/signal/signal/writable-signal.ts';
import style from './esds-icon.component.css?inline';
import { getApi } from './esds-icon.component.private.ts';

export type EsdsIconComponentStatus = 'loading' | 'rendered' | 'error';

/**
 * Web component for displaying icons from the Infomaniak Design System icon library.
 *
 * @summary Icon component
 * @element esds-icon-lit
 */
@customElement('esds-icon-lit') // TODO: change to `esds-icon` once we don't have a conflict with the other component
export class EsdsIconComponent extends SignalWatcher(LitElement) {
  static override styles = unsafeCSS(style);

  /* PUBLIC PROPERTIES */

  // NAME

  /**
   * Icon identifier in `prefix:name` format.
   *
   * @attr name
   */
  @property({ type: String })
  accessor name!: string;

  readonly #name: WritableSignal<string> = signalProperty(this, 'name');

  // INLINE

  /**
   * Adjusts vertical alignment for inline use (shifts by -0.125em).
   *
   * @attr inline
   * @reflect
   */
  @property({ type: Boolean, reflect: true })
  accessor inline: boolean = false;

  // STATUS

  readonly #status: WritableSignal<EsdsIconComponentStatus> =
    signal<EsdsIconComponentStatus>('loading');

  /**
   * Read-only loading state of the icon.
   *
   * @reactive
   */
  get status(): EsdsIconComponentStatus {
    return this.#status.get();
  }

  /* INTERNAL */

  constructor() {
    super();

    // VISIBLE

    onConnected(this, (): CleanUpFunction => {
      batch((): void => {
        this.#visible.set(false);
      });

      const observer = new IntersectionObserver(
        (entries: readonly IntersectionObserverEntry[]): void => {
          const intersecting: boolean = entries.some(
            (entry: IntersectionObserverEntry): boolean => entry.isIntersecting,
          );
          batch((): void => {
            this.#visible.set(intersecting);
          });
        },
      );

      observer.observe(this);

      return (): void => {
        if (observer !== undefined) {
          observer.disconnect();

          batch((): void => {
            this.#visible.set(false);
          });
        }
      };
    });

    // LOAD ICON

    componentEffect(this, (): CleanUpFunction => {
      const controller = new AbortController();

      this.#loadIcon(controller.signal);

      return (): void => {
        controller.abort();
      };
    });
  }

  // VISIBLE

  readonly #visible: WritableSignal<boolean> = signal<boolean>(false);

  // LOAD & RENDER ICON

  readonly #svgNode: WritableSignal<SVGSVGElement | null> = signal<SVGSVGElement | null>(null);

  override render(): TemplateResult {
    return html`${this.#svgNode.get()}`;
  }

  #loadIcon(signal: AbortSignal): void {
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
}
