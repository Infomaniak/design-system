export interface TypedKotlinVariableDeclarationValue<GType extends string> {
  readonly type: GType;
  readonly value: string;
}
