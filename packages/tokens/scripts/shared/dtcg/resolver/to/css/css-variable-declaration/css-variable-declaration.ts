export interface CssVariableDeclaration {
  readonly name: string;
  readonly value: string;
  readonly description?: string;
  readonly deprecated?: boolean | string;
  /**
   * A list of derived CSS variables from this declaration.
   */
  readonly derived?: readonly CssVariableDeclaration[];
}
