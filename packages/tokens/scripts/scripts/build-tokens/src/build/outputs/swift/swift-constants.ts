export const SWIFT_PRIMITIVE_TOKENS = 'PrimitiveToken';
export const SWIFT_STRUCT_PREFIX = 'Esds';
export const SWIFT_MAIN_STRUCT = `${SWIFT_STRUCT_PREFIX}Theme`;
export const SWIFT_SOURCES_DIR = 'Sources/DesignSystem';
export const SWIFT_RESOURCES_DIR = 'Resources';

export const EXCLUDED_SWIFT_TOKEN_PREFIXES = [
  'font',
  'shadow',
  'text',
  'border',
  'blur',
  'opacity',
];

export function isExcludedSwiftToken(token: { readonly name: readonly string[] }): boolean {
  const firstSegment = token.name[0];
  return (
    firstSegment !== undefined &&
    (EXCLUDED_SWIFT_TOKEN_PREFIXES as readonly string[]).includes(firstSegment)
  );
}
