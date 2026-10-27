import { readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { readTextFile } from '../../../../../../../scripts/helpers/file/read-text-file.ts';
import { writeTextFileSafe } from '../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import {
  ANDROID_ICON_PACK_NAME,
  ANDROID_ICONS_PACKAGE_NAME,
  ANDROID_IMAGE_VECTORS_PACKAGE_NAME,
  ANDROID_PREVIEW_ICON_SIZE_NAME,
  KOTLIN_FILE_EXTENSION,
} from './android-icons-config.ts';

const KOTLIN_IMPORT_KEYWORD = 'import ';
/** Consecutive `import …` lines, as emitted by Valkyrie right after the `package` statement. */
const KOTLIN_IMPORT_BLOCK_PATTERN: RegExp = /^(?:import .+\n)+/m;

/** Valkyrie expects the icon pack in the generated package, but `EsdsIcons` lives in its parent. */
const VALKYRIE_ICON_PACK_IMPORT = `${ANDROID_IMAGE_VECTORS_PACKAGE_NAME}.${ANDROID_ICON_PACK_NAME}`;

const IMAGE_VECTOR_PREVIEW_IMPORTS: readonly string[] = [
  'androidx.compose.foundation.Image',
  'androidx.compose.foundation.background',
  'androidx.compose.foundation.layout.Box',
  'androidx.compose.foundation.layout.size',
  'androidx.compose.runtime.Composable',
  'androidx.compose.ui.Modifier',
  'androidx.compose.ui.graphics.Color',
  'androidx.compose.ui.tooling.preview.Preview',
  `${ANDROID_ICONS_PACKAGE_NAME}.${ANDROID_ICON_PACK_NAME}`,
  `${ANDROID_ICONS_PACKAGE_NAME}.${ANDROID_PREVIEW_ICON_SIZE_NAME}`,
];

/**
 * Adds the preview to every generated `<IconName>.kt` file of the nested icon pack directory.
 *
 * @returns the sorted list of icon names (the file names without extension).
 */
export async function addImageVectorPreviewsToDirectory(
  directory: string,
  nestedPackName: string,
): Promise<readonly string[]> {
  const fileNames: readonly string[] = (await readdir(directory))
    .filter((fileName: string): boolean => fileName.endsWith(KOTLIN_FILE_EXTENSION))
    .sort();

  await Promise.all(
    fileNames.map((fileName: string): Promise<void> => {
      return addImageVectorPreviewToFile(join(directory, fileName), nestedPackName);
    }),
  );

  return fileNames.map((fileName: string): string => basename(fileName, KOTLIN_FILE_EXTENSION));
}

async function addImageVectorPreviewToFile(
  filePath: string,
  nestedPackName: string,
): Promise<void> {
  const iconName: string = basename(filePath, KOTLIN_FILE_EXTENSION);
  const source: string = await readTextFile(filePath);

  await writeTextFileSafe(filePath, addImageVectorPreview(source, iconName, nestedPackName));
}

/**
 * Fixes the icon pack import, then adds the imports and the private `Preview` composable rendering
 * `EsdsIcons.<nestedPackName>.<iconName>`.
 */
export function addImageVectorPreview(
  source: string,
  iconName: string,
  nestedPackName: string,
): string {
  return appendKotlinDeclaration(
    addKotlinImports(
      removeKotlinImport(source, VALKYRIE_ICON_PACK_IMPORT),
      IMAGE_VECTOR_PREVIEW_IMPORTS,
    ),
    buildImageVectorPreviewFunction(iconName, nestedPackName),
  );
}

export function buildImageVectorPreviewFunction(iconName: string, nestedPackName: string): string {
  return `@Preview
@Composable
private fun Preview() {
    Box(modifier = Modifier.background(Color.White)) {
        Image(
            imageVector = ${ANDROID_ICON_PACK_NAME}.${nestedPackName}.${iconName},
            contentDescription = null,
            modifier = Modifier.size(${ANDROID_PREVIEW_ICON_SIZE_NAME}),
        )
    }
}`;
}

/** Merges the imports into the existing import block, without duplicates and sorted. */
export function addKotlinImports(source: string, imports: readonly string[]): string {
  const importBlock: RegExpExecArray | null = KOTLIN_IMPORT_BLOCK_PATTERN.exec(source);

  if (importBlock === null) {
    throw new Error('Expected the Kotlin source to contain an import block.');
  }

  const existingImports: readonly string[] = importBlock[0]
    .trimEnd()
    .split('\n')
    .map((line: string): string => line.slice(KOTLIN_IMPORT_KEYWORD.length));

  const mergedImportBlock: string = [...new Set([...existingImports, ...imports])]
    .sort()
    .map((kotlinImport: string): string => `${KOTLIN_IMPORT_KEYWORD}${kotlinImport}\n`)
    .join('');

  return (
    source.slice(0, importBlock.index) +
    mergedImportBlock +
    source.slice(importBlock.index + importBlock[0].length)
  );
}

export function removeKotlinImport(source: string, kotlinImport: string): string {
  return source.replace(`${KOTLIN_IMPORT_KEYWORD}${kotlinImport}\n`, '');
}

function appendKotlinDeclaration(source: string, declaration: string): string {
  return `${source.trimEnd()}\n\n${declaration}\n`;
}
