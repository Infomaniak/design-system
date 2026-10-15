import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import {
  addImageVectorPreview,
  addImageVectorPreviewsToDirectory,
  addKotlinImports,
  buildImageVectorPreviewFunction,
  removeKotlinImport,
} from './add-image-vector-preview.ts';

const VALKYRIE_SOURCE = `package com.infomaniak.designsystem.icons.imagevector.medium

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.infomaniak.designsystem.icons.imagevector.EsdsIcons

public val EsdsIcons.Medium.Check: ImageVector
    get() = TODO()
`;

const EXPECTED_PREVIEW_FUNCTION = `@Preview
@Composable
private fun Preview() {
    Box(modifier = Modifier.background(Color.White)) {
        Image(
            imageVector = EsdsIcons.Medium.Check,
            contentDescription = null,
            modifier = Modifier.size(previewIconSize),
        )
    }
}`;

describe('buildImageVectorPreviewFunction', () => {
  test('renders the nested pack icon in a white box sized with previewIconSize', () => {
    expect(buildImageVectorPreviewFunction('Check', 'Medium')).toBe(EXPECTED_PREVIEW_FUNCTION);
  });
});

describe('addKotlinImports', () => {
  test('merges the imports into the import block, sorted and without duplicates', () => {
    const source = `package a

import b.Z
import b.A

val x = 1
`;

    expect(addKotlinImports(source, ['b.M', 'b.A'])).toBe(`package a

import b.A
import b.M
import b.Z

val x = 1
`);
  });

  test('throws when the source has no import block', () => {
    expect(() => addKotlinImports('package a\n\nval x = 1\n', ['b.A'])).toThrow(
      'Expected the Kotlin source to contain an import block.',
    );
  });
});

describe('removeKotlinImport', () => {
  test('removes the import line', () => {
    expect(removeKotlinImport('import b.A\nimport b.B\n\nval x = 1\n', 'b.A')).toBe(
      'import b.B\n\nval x = 1\n',
    );
  });

  test('keeps the source unchanged when the import is missing', () => {
    expect(removeKotlinImport('import b.B\n', 'b.A')).toBe('import b.B\n');
  });
});

describe('addImageVectorPreview', () => {
  test('fixes the icon pack import, adds the preview imports and appends the preview function', () => {
    expect(addImageVectorPreview(VALKYRIE_SOURCE, 'Check', 'Medium'))
      .toBe(`package com.infomaniak.designsystem.icons.imagevector.medium

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.infomaniak.designsystem.icons.EsdsIcons
import com.infomaniak.designsystem.icons.previewIconSize

public val EsdsIcons.Medium.Check: ImageVector
    get() = TODO()

${EXPECTED_PREVIEW_FUNCTION}
`);
  });
});

describe('addImageVectorPreviewsToDirectory', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'add-image-vector-preview-'));
  });

  afterEach(async () => {
    await rm(tempDir, { force: true, recursive: true });
  });

  test('adds a preview to every Kotlin file and returns the sorted icon names', async () => {
    await writeFile(join(tempDir, 'Check.kt'), VALKYRIE_SOURCE, 'utf8');
    await writeFile(join(tempDir, 'AlarmClock.kt'), VALKYRIE_SOURCE, 'utf8');
    await writeFile(join(tempDir, 'notes.txt'), 'ignored', 'utf8');

    expect(await addImageVectorPreviewsToDirectory(tempDir, 'Medium')).toEqual([
      'AlarmClock',
      'Check',
    ]);
    expect(await readFile(join(tempDir, 'Check.kt'), 'utf8')).toBe(
      addImageVectorPreview(VALKYRIE_SOURCE, 'Check', 'Medium'),
    );
    expect(await readFile(join(tempDir, 'AlarmClock.kt'), 'utf8')).toContain(
      'imageVector = EsdsIcons.Medium.AlarmClock,',
    );
    expect(await readFile(join(tempDir, 'notes.txt'), 'utf8')).toBe('ignored');
  });
});
