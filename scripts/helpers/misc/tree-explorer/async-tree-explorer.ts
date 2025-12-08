import { type TreeExplorerPickFunction } from './tree-explorer.ts';

export interface AsyncTreeExplorerGetChildrenFunction<GInput, GNode> {
  (node: GNode, input: GInput): AsyncIterable<GInput>;
}

export interface AsyncTreeExplorerMapFunction<GInput, GNode> {
  (input: GInput): Promise<GNode> | GNode;
}

export class AsyncTreeExplorer<GInput, GNode = GInput> {
  readonly #getChildren: AsyncTreeExplorerGetChildrenFunction<GInput, GNode>;
  readonly #map: AsyncTreeExplorerMapFunction<GInput, GNode>;

  constructor(getChildren: AsyncTreeExplorerGetChildrenFunction<GInput, GInput>, map?: undefined);
  constructor(
    getChildren: AsyncTreeExplorerGetChildrenFunction<GInput, GNode>,
    map: AsyncTreeExplorerMapFunction<GInput, GNode>,
  );
  constructor(
    getChildren: AsyncTreeExplorerGetChildrenFunction<GInput, GNode>,
    map: AsyncTreeExplorerMapFunction<GInput, GNode> = (_) => _ as any,
  ) {
    this.#getChildren = getChildren;
    this.#map = map;
  }

  async *explore(
    input: GInput,
    pick?: TreeExplorerPickFunction<GInput, GNode>,
  ): AsyncGenerator<GNode> {
    const node: GNode = await this.#map(input);

    const { pickSelf = true, pickChildren = true } = pick?.(node, input) ?? {};

    if (pickSelf) {
      yield node;
    }

    if (pickChildren) {
      for await (const child of this.#getChildren(node, input)) {
        yield* this.explore(child, pick);
      }
    }
  }
}
