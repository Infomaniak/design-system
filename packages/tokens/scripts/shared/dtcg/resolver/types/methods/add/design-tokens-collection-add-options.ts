export interface DesignTokensCollectionAddOptions {
  /**
   * If the token is added at the end of the collection.
   *
   * @default 'true'
   */
  readonly last?: boolean;

  /**
   * If an existing token is found, it will be patched instead of replaced.
   *
   * @default 'true'
   */
  readonly merge?: boolean;
}
