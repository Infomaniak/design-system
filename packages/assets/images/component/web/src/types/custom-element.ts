export interface CustomElement {
  connectedCallback?(): void;

  disconnectedCallback?(): void;

  adoptedCallback?(): void;

  attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
}
