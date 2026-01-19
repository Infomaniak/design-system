import { isObject } from '@vitest/utils/helpers';

export type FigmaTreeWithName = readonly [name: string, tree: unknown];

export function mergeFigmaTokensAsModes(trees: readonly FigmaTreeWithName[]): unknown {
  let type: 'token' | 'group' | undefined;

  for (const [, tree] of trees) {
    if (!isObject(tree)) {
      throw new Error('Expected an object.');
    }

    const treeType: 'token' | 'group' = Reflect.has(tree as object, '$value') ? 'token' : 'group';

    if (type === undefined) {
      type = treeType;
    } else if (type !== treeType) {
      throw new Error('Expected all tokens to be of the same type.');
    }
  }

  if (type === undefined) {
    throw new Error('Expected at least one token.');
  }

  if (type === 'token') {
    // tokens
    const [, token] = trees[0];
    return {
      ...(token as object),
      $extensions: {
        mode: Object.fromEntries(
          trees.map(([name, tree]: FigmaTreeWithName): [string, unknown] => {
            return [name, Reflect.get(tree as object, '$value')];
          }),
        ),
      },
    };
  }

  // groups

  return Object.fromEntries(
    Array.from(
      new Set(
        trees.flatMap(([, tree]: FigmaTreeWithName): string[] => Object.keys(tree as object)),
      ),
    ).map((key: string): [string, unknown] => {
      return [
        key,
        mergeFigmaTokensAsModes(
          trees.map(([name, tree]: FigmaTreeWithName): FigmaTreeWithName => {
            const child: unknown = Reflect.get(tree as object, key);
            if (child === undefined) {
              throw new Error(`Expected child "${key}" to exist.`);
            }
            return [name, child];
          }),
        ),
      ];
    }),
  );
}
