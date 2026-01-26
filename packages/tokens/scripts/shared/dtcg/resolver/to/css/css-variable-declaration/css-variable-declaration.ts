export interface CssVariableDeclaration {
  readonly name: string;
  readonly value: string;
  readonly description?: string;
  readonly deprecated?: boolean | string;
}
