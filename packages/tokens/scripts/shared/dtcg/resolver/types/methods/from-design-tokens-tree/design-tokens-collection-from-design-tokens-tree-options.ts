export interface DesignTokensCollectionFromDesignTokensTreeOptions {
  readonly files?: readonly string[];
  readonly forEachTokenBehaviour?: DesignTokensCollectionFromDesignTokensTreeForEachTokenBehaviour;
}

export type DesignTokensCollectionFromDesignTokensTreeForEachTokenBehaviour =
  | 'merge'
  | 'only-new-token'
  | 'prevent-new-token';
