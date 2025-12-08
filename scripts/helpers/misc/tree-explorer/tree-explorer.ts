export interface TreeExplorerPickReturn {
  readonly pickSelf?: boolean; // (default: true)
  readonly pickChildren?: boolean; // (default: true)
}

export interface TreeExplorerPickFunction<GInput, GNode> {
  (node: GNode, input: GInput): TreeExplorerPickReturn | void;
}

export interface TreeExplorerGetChildrenFunction<GInput, GNode> {
  (node: GNode, input: GInput): Iterable<GInput>;
}

export interface TreeExplorerMapFunction<GInput, GNode> {
  (input: GInput): GNode;
}

export class TreeExplorer<GInput, GNode = GInput> {
  readonly #getChildren: TreeExplorerGetChildrenFunction<GInput, GNode>;
  readonly #map: TreeExplorerMapFunction<GInput, GNode>;

  constructor(getChildren: TreeExplorerGetChildrenFunction<GInput, GInput>, map?: undefined);
  constructor(
    getChildren: TreeExplorerGetChildrenFunction<GInput, GNode>,
    map: TreeExplorerMapFunction<GInput, GNode>,
  );
  constructor(
    getChildren: TreeExplorerGetChildrenFunction<GInput, GNode>,
    map: TreeExplorerMapFunction<GInput, GNode> = (_) => _ as any,
  ) {
    this.#getChildren = getChildren;
    this.#map = map;
  }

  *explore(input: GInput, pick?: TreeExplorerPickFunction<GInput, GNode>): Generator<GNode> {
    const node: GNode = this.#map(input);

    const { pickSelf = true, pickChildren = true } = pick?.(node, input) ?? {};

    if (pickSelf) {
      yield node;
    }

    if (pickChildren) {
      for (const child of this.#getChildren(node, input)) {
        yield* this.explore(child, pick);
      }
    }
  }
}
