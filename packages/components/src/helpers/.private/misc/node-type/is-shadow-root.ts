export function isShadowRoot(input: Node): input is ShadowRoot {
  return input instanceof ShadowRoot;
}
