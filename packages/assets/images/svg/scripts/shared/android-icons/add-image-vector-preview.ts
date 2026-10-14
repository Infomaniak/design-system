import { readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { readTextFile } from '../../../../../../../scripts/helpers/file/read-text-file.ts';
import { writeTextFileSafe } from '../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import {
  ANDROID_ICON_PACK_NAME,
  ANDROID_ICONS_PACKAGE_NAME,
  ANDROID_PREVIEW_ICON_SIZE_NAME,
} from './android-icons-config.ts';

const KOTLIN_FILE_EXTENSION = '.kt';
const KOTLIN_IMPORT_KEYWORD = 'import ';
/** Consecutive `import …` lines, as emitted by Valkyrie right after the `package` statement. */
const KOTLIN_IMPORT_BLOCK_PATTERN: RegExp = /^(?:import .+\n)+/m;

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
 * Adds the preview to every generated `<IconName>.kt` file of the directory.
 *
 * @returns the sorted list of icon names (the file names without extension).
 */
export async function addImageVectorPreviewsToDirectory(
  directory: string,
): Promise<readonly string[]> {
  const fileNames: readonly string[] = (await readdir(directory))
    .filter((fileName: string): boolean => fileName.endsWith(KOTLIN_FILE_EXTENSION))
    .sort();

  await Promise.all(
    fileNames.map((fileName: string): Promise<void> => {
      return addImageVectorPreviewToFile(join(directory, fileName));
    }),
  );

  return fileNames.map((fileName: string): string => basename(fileName, KOTLIN_FILE_EXTENSION));
}

async function addImageVectorPreviewToFile(filePath: string): Promise<void> {
  const iconName: string = basename(filePath, KOTLIN_FILE_EXTENSION);
  const source: string = await readTextFile(filePath);

  await writeTextFileSafe(filePath, addImageVectorPreview(source, iconName));
}

/** Adds the imports and the private `preview` composable rendering `EsdsIcons.<iconName>`. */
export function addImageVectorPreview(source: string, iconName: string): string {
  return appendKotlinDeclaration(
    addKotlinImports(source, IMAGE_VECTOR_PREVIEW_IMPORTS),
    buildImageVectorPreviewFunction(iconName),
  );
}

export function buildImageVectorPreviewFunction(iconName: string): string {
  return `@Preview
@Composable
private fun Preview() {
    Box(modifier = Modifier.background(Color.White)) {
        Image(
            imageVector = ${ANDROID_ICON_PACK_NAME}.${iconName},
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

function appendKotlinDeclaration(source: string, declaration: string): string {
  return `${source.trimEnd()}\n\n${declaration}\n`;
}
