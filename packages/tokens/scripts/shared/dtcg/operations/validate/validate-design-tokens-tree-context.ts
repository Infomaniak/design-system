export interface ValidateDesignTokensTreeContext {
  readonly file: string;
  readonly name: readonly string[]; // the token's name
  readonly type: string | undefined;
}
