export function defineComponent(tagName: string, ctor: CustomElementConstructor): void {
  const registry = globalThis.customElements;

  if (registry === undefined) {
    return;
  }

  if (!registry.get(tagName)) {
    registry.define(tagName, ctor);
  }
}
