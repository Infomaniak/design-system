/** Kotlin package of the Android `Icons` module, which owns the `EsdsIcons` icon pack object. */
export const ANDROID_ICONS_PACKAGE_NAME = 'com.infomaniak.designsystem.icons';
export const ANDROID_ICON_PACK_NAME = 'EsdsIcons';
/** Top-level `Dp` declared next to `EsdsIcons`, shared by every generated preview. */
export const ANDROID_PREVIEW_ICON_SIZE_NAME = 'previewIconSize';

export const ANDROID_IMAGE_VECTORS_DIRECTORY_NAME = 'imagevector';
export const ANDROID_IMAGE_VECTORS_PACKAGE_NAME = `${ANDROID_ICONS_PACKAGE_NAME}.${ANDROID_IMAGE_VECTORS_DIRECTORY_NAME}`;

export const ANDROID_ICONS_SVGS_DIRECTORY_NAME = 'svgs';
export const ANDROID_ICONS_KOTLIN_DIRECTORY_NAME = 'kt';

export const ANDROID_IMAGE_VECTORS_DESTINATION_PATH = `Icons/src/commonMain/kotlin/${ANDROID_IMAGE_VECTORS_PACKAGE_NAME.replaceAll('.', '/')}`;
