import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import {
  makeImageVectorInternal,
  makeImageVectorsInternalInDirectory,
} from './make-image-vectors-internal.ts';

const SOURCE = `package p

public val EsdsIcons.Medium.Check: ImageVector
    get() = TODO()

private var _Check: ImageVector? = null
`;

describe('makeImageVectorInternal', () => {
  test('turns the public ImageVector property into an internal one', () => {
    expect(makeImageVectorInternal(SOURCE)).toBe(
      SOURCE.replace('public val EsdsIcons', 'internal val EsdsIcons'),
    );
  });

  test('throws when there is no public ImageVector property', () => {
    expect(() => makeImageVectorInternal('package p\n')).toThrow(
      'Expected the Kotlin source to declare a public ImageVector property.',
    );
  });
});

describe('makeImageVectorsInternalInDirectory', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'make-internal-'));
  });

  afterEach(async () => {
    await rm(directory, { force: true, recursive: true });
  });

  test('rewrites every Kotlin file and ignores other files', async () => {
    await writeFile(join(directory, 'Check.kt'), SOURCE, 'utf8');
    await writeFile(join(directory, 'notes.txt'), 'public val', 'utf8');

    await makeImageVectorsInternalInDirectory(directory);

    expect(await readFile(join(directory, 'Check.kt'), 'utf8')).toContain(
      'internal val EsdsIcons.Medium.Check',
    );
    expect(await readFile(join(directory, 'notes.txt'), 'utf8')).toBe('public val');
  });
});
