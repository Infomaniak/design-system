export interface SwiftEnumBase<Type extends string> {
  readonly $type: Type;
}

export type GenericSwiftEnumBase = SwiftEnumBase<string>;

export interface SwiftEnumDeclaration extends SwiftEnumBase<'declaration'> {
  readonly name: string;
  readonly type: string;
  readonly value: string;
  readonly description?: string;
  readonly deprecated?: boolean | string;
  readonly rawLine?: string;
}

export function isSwiftEnumDeclaration(input: GenericSwiftEnumBase): input is SwiftEnumDeclaration {
  return input.$type === 'declaration';
}

export interface SwiftEnumMark extends SwiftEnumBase<'mark'> {
  readonly name: string;
}

export function isSwiftEnumMark(input: GenericSwiftEnumBase): input is SwiftEnumMark {
  return input.$type === 'mark';
}
