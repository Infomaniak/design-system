export const NOT_FOUND = Symbol('NOT_FOUND');

export function getObjectDeepProperty(root: unknown, path: readonly PropertyKey[]): unknown {
  let node: any = root;

  for (let i: number = 0; i < path.length; i++) {
    const segment: PropertyKey = path[i];

    if (!Reflect.has(node, segment)) {
      return NOT_FOUND;
    }

    node = Reflect.get(node, segment);
  }

  return node;
}
