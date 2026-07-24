export const SWIFT_PRIMITIVE_TOKENS = 'PrimitiveToken';
export const SWIFT_MAIN_STRUCT = `ESDSTheme`;

export const SWIFT_PACKAGE_NAME = 'ESDS';

export const SWIFT_SOURCES_DIR = 'Sources';
export const SWIFT_PRIMITIVE_TARGET_NAME = 'ESDSPrimitives';
export const SWIFT_PRIMITIVE_TARGET_DIR = `${SWIFT_SOURCES_DIR}/${SWIFT_PRIMITIVE_TARGET_NAME}`;
export const SWIFT_FOUNDATION_DIR = 'ESDSFoundation';
export const SWIFT_PRODUCTS_DIR = 'Products';

export const EXCLUDED_SWIFT_TOKEN_ROOTS = [
  'font',
  'shadow',
  'text',
  'border',
  'border-width',
  'blur',
  'opacity',
  'breakpoint',
  'ratio',
];

export function isExcludedSwiftToken(token: { readonly name: readonly string[] }): boolean {
  return (
    token.name[0] !== undefined &&
    (EXCLUDED_SWIFT_TOKEN_ROOTS as readonly string[]).includes(token.name[0])
  );
}
