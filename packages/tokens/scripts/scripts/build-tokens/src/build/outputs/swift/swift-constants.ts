export const SWIFT_RAW_TOKENS_PREFIX = 'RawToken';
export const SWIFT_ENUM_PREFIX = 'Esds';
export const SWIFT_STRUCT_PREFIX = 'Esds';
export const SWIFT_MAIN_STRUCT = `${SWIFT_STRUCT_PREFIX}Theme`;

export const EXCLUDED_SWIFT_TOKEN_PREFIXES = ['font', 'shadow', 'text', 'border'];

export function isExcludedSwiftToken(token: { readonly name: readonly string[] }): boolean {
  const firstSegment = token.name[0];
  return (
    firstSegment !== undefined &&
    (EXCLUDED_SWIFT_TOKEN_PREFIXES as readonly string[]).includes(firstSegment)
  );
}
