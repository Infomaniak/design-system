/** Kotlin package of the Android `Icons` module, which owns the `EsdsIcons` icon pack object. */
export const ANDROID_ICONS_PACKAGE_NAME = 'com.infomaniak.designsystem.icons';
export const ANDROID_ICON_PACK_NAME = 'EsdsIcons';
/** Top-level `Dp` declared next to `EsdsIcons`, shared by every generated preview. */
export const ANDROID_PREVIEW_ICON_SIZE_NAME = 'PreviewIconSize';

export const ANDROID_IMAGE_VECTORS_DIRECTORY_NAME = 'imagevector';
export const ANDROID_IMAGE_VECTORS_PACKAGE_NAME = `${ANDROID_ICONS_PACKAGE_NAME}.${ANDROID_IMAGE_VECTORS_DIRECTORY_NAME}`;

export const ANDROID_SYMBOLS_DIRECTORY_NAME = 'symbols';
export const ANDROID_SYMBOLS_PACKAGE_NAME = `${ANDROID_ICONS_PACKAGE_NAME}.${ANDROID_SYMBOLS_DIRECTORY_NAME}`;
export const ANDROID_SYMBOL_INTERFACE_NAME = 'Symbol';
/** File of the hand-written `Symbol` interface, living next to the generated symbols and never overwritten. */
export const ANDROID_SYMBOL_INTERFACE_FILE_NAME = '_Symbol.kt';

export const ANDROID_ICONS_SVGS_DIRECTORY_NAME = 'svgs';
export const ANDROID_ICONS_KOTLIN_DIRECTORY_NAME = 'kt';

export const ANDROID_IMAGE_VECTORS_DESTINATION_PATH = `Icons/src/commonMain/kotlin/${ANDROID_IMAGE_VECTORS_PACKAGE_NAME.replaceAll('.', '/')}`;

export const ANDROID_SYMBOLS_DESTINATION_PATH = `Icons/src/commonMain/kotlin/${ANDROID_SYMBOLS_PACKAGE_NAME.replaceAll('.', '/')}`;

export interface AndroidIconSize {
  /** Name of the nested icon pack, e.g. `Medium` for `EsdsIcons.Medium.House`. */
  readonly name: string;
  /** Rendered size in dp, matching the `icon.size.*` tokens. */
  readonly size: number;
}

/** T-shirt sizes generated as nested icon packs, mirroring the `icon.size.*` tokens. */
export const ANDROID_ICON_SIZES: readonly AndroidIconSize[] = [
  { name: 'ExtraSmall', size: 16 },
  { name: 'Small', size: 20 },
  { name: 'Medium', size: 24 },
  { name: 'Large', size: 32 },
  { name: 'ExtraLarge', size: 40 },
];

/** Size of the `viewBox` of the source icons, in which the stroke width is expressed. */
export const ANDROID_ICON_VIEW_BOX_SIZE = 24;
