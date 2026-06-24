export function defineComponent(tagName: string, ctor: CustomElementConstructor): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ctor);
  }
}
