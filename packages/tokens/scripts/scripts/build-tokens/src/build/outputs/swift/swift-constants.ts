export const SWIFT_PRIMITIVE_TOKENS = 'PrimitiveToken';
export const SWIFT_MAIN_STRUCT = `ESDSTheme`;
export const SWIFT_SOURCES_DIR = 'Sources/DesignSystem';
export const SWIFT_RESOURCES_DIR = 'Sources/ESDSResources';

export const EXCLUDED_SWIFT_TOKEN_ROOTS = ['font', 'shadow', 'text', 'border', 'blur', 'opacity'];

export const EXCLUDED_SWIFT_TOKEN_SEGMENTS = ['dataviz'];

export function isExcludedSwiftToken(token: { readonly name: readonly string[] }): boolean {
  return (
    (token.name[0] !== undefined &&
      (EXCLUDED_SWIFT_TOKEN_ROOTS as readonly string[]).includes(token.name[0])) ||
    token.name.some((segment) =>
      (EXCLUDED_SWIFT_TOKEN_SEGMENTS as readonly string[]).includes(segment),
    )
  );
}
