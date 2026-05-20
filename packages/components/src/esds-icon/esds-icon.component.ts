import { LitElement, css, html, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import DOMPurify from 'dompurify';
import { getApi } from '../configure.ts';

export type EsdsIconComponentMode = 'svg' | 'bg' | 'mask';
export type EsdsIconComponentStatus = 'loading' | 'rendered' | 'error';

@customElement('esds-icon')
export class EsdsIconComponent extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      vertical-align: 0;
    }

    :host([mode='bg']),
    :host([mode='mask']) {
      width: 1em;
      height: 1em;
    }

    :host([mode='bg']) {
      background-color: transparent;
      background-image: var(--svg);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    :host([mode='mask']) {
      background-color: currentcolor;
      -webkit-mask-image: var(--svg);
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-size: 100% 100%;
      mask-image: var(--svg);
      mask-repeat: no-repeat;
      mask-size: 100% 100%;
    }

    :host([inline]),
    :host([inline='']),
    :host([inline='true']) {
      vertical-align: -0.125em;
    }

    svg {
      display: block;
      margin: auto;
    }
  `;

  @property({ type: String })
  accessor name = '';

  @property({ type: String })
  accessor mode: EsdsIconComponentMode = 'svg';

  @property({ type: Boolean, reflect: true })
  accessor inline = false;

  @property({ type: Boolean, reflect: true })
  accessor nolazy = false;

  @state()
  private accessor _status: EsdsIconComponentStatus = 'loading';

  @state()
  private accessor _svgNode: SVGSVGElement | null = null;

  private _prefix = '';
  private _iconName = '';
  private _visible = false;
  private _observer: IntersectionObserver | undefined;
  private _abortController: AbortController | undefined;

  get status(): EsdsIconComponentStatus {
    return this._status;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.nolazy) {
      this._visible = true;
    } else {
      this._startObserver();
    }
  }

  override disconnectedCallback(): void {
    this._stopObserver();
    this._abortPendingFetch();
    super.disconnectedCallback();
  }

  override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('name')) {
      if (this.name && !this.name.includes(':')) {
        throw new Error(
          'Invalid `name`: missing separator `:` between <prefix> and <name> (`name="<prefix>:<name>"`).',
        );
      }
      this._parseName();
      this._abortPendingFetch();
    }

    if (changedProperties.has('mode')) {
      if (!['svg', 'bg', 'mask'].includes(this.mode)) {
        throw new Error(`Invalid mode: ${this.mode}. Expected 'svg', 'bg', or 'mask'.`);
      }
      if (this.mode !== 'svg') {
        this._svgNode = null;
      } else {
        this.style.removeProperty('--svg');
      }
    }

    if (changedProperties.has('nolazy')) {
      if (this.nolazy) {
        this._stopObserver();
        this._visible = true;
      } else {
        this._startObserver();
      }
    }

    if (
      this._visible &&
      (changedProperties.has('name') ||
        changedProperties.has('mode') ||
        changedProperties.has('nolazy'))
    ) {
      this._loadIcon();
    }
  }

  override render() {
    if (this.mode === 'svg' && this._svgNode) {
      return html`${this._svgNode}`;
    }
    return html``;
  }

  private _parseName(): void {
    if (this.name && this.name.includes(':')) {
      const index = this.name.indexOf(':');
      this._prefix = this.name.slice(0, index);
      this._iconName = this.name.slice(index + 1);
    } else {
      this._prefix = '';
      this._iconName = '';
    }
  }

  private _startObserver(): void {
    if (this._observer === undefined) {
      this._visible = false;
      this._observer = new IntersectionObserver(
        (entries: readonly IntersectionObserverEntry[]): void => {
          const intersecting = entries.some(
            (entry: IntersectionObserverEntry): boolean => entry.isIntersecting,
          );
          if (intersecting) {
            this._visible = true;
            this._stopObserver();
            this._loadIcon();
          }
        },
      );
      this._observer.observe(this);
    }
  }

  private _stopObserver(): void {
    if (this._observer !== undefined) {
      this._observer.disconnect();
      this._observer = undefined;
    }
  }

  private _loadIcon(): void {
    this._abortPendingFetch();

    if (!this._visible || !this.isConnected || !this._prefix || !this._iconName) {
      return;
    }

    this._abortController = new AbortController();
    const signal = this._abortController.signal;
    this._status = 'loading';
    this._svgNode = null;

    getApi()
      .getSVG({
        prefix: this._prefix,
        name: this._iconName,
        signal,
      })
      .then((svgContent: string): void => {
        if (signal.aborted) {
          return;
        }

        this._status = 'rendered';
        if (this.mode === 'svg') {
          this.style.removeProperty('--svg');
          this._svgNode = this._parseSvgToDom(svgContent);
        } else {
          this._svgNode = null;
          this.style.setProperty(
            '--svg',
            `url('data:image/svg+xml;base64,${btoa(svgContent)}')`,
          );
        }
      })
      .catch((error: unknown): void => {
        if (signal.aborted) {
          return;
        }

        this._status = 'error';
        this._svgNode = null;
        this.style.removeProperty('--svg');
        console.error(`Failed to load icon: "${this.name}"`, error);
      });
  }

  private _abortPendingFetch(): void {
    if (this._abortController !== undefined) {
      this._abortController.abort();
      this._abortController = undefined;
    }
  }

  private _parseSvgToDom(svgString: string): SVGSVGElement | null {
    const sanitized = DOMPurify.sanitize(svgString, {
      USE_PROFILES: { svg: true },
    });
    const doc = new DOMParser().parseFromString(sanitized, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    return svg ? (svg.cloneNode(true) as SVGSVGElement) : null;
  }
}
