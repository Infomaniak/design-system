export function setObjectDeepProperty(
  root: unknown,
  path: readonly PropertyKey[],
  value: unknown,
): void {
  if (path.length === 0) {
    throw new Error('Cannot set property on root');
  }

  let node: any = root;
  const last: number = path.length - 1;

  for (let i: number = 0; i < last; i++) {
    const segment: PropertyKey = path[i];

    if (!Reflect.has(node, segment)) {
      Reflect.set(node, segment, {});
    }

    node = Reflect.get(node, segment);
  }

  Reflect.set(node, path[last], value);
}
