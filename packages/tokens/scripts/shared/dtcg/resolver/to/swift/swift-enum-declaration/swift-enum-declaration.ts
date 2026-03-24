export interface SwiftEnumDeclaration {
  readonly name: string;
  readonly type: string;
  readonly value: string;
  readonly description?: string;
  readonly deprecated?: boolean | string;
}
