import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as readJsonFileModule from '../file/read-json-file.ts';
import { updateMobileArtifactVersion } from './update-mobile-artifact-version.ts';

const TOKEN_SOURCE_COMMIT = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const SYMBOL_SOURCE_COMMIT = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
const PREVIOUS_TOKEN_SOURCE_COMMIT = 'cccccccccccccccccccccccccccccccccccccccc';

function formatJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

describe('updateMobileArtifactVersion', () => {
  let repositoryDirectory: string;
  let manifestPath: string;

  beforeEach(async () => {
    repositoryDirectory = await mkdtemp(join(tmpdir(), 'mobile-artifact-version-'));
    manifestPath = join(repositoryDirectory, 'artifact-versions.json');
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(repositoryDirectory, { recursive: true, force: true });
  });

  it('creates a missing manifest with only the published category', async () => {
    await updateMobileArtifactVersion({
      repositoryDirectory,
      category: 'tokens-core',
      version: '1.5.0',
      sourceCommit: TOKEN_SOURCE_COMMIT,
    });

    await expect(readFile(manifestPath, 'utf8')).resolves.toBe(
      formatJson({
        schemaVersion: 1,
        'tokens-core': {
          version: '1.5.0',
          sourceCommit: TOKEN_SOURCE_COMMIT,
        },
      }),
    );
  });

  it('updates an existing category while preserving every other category', async () => {
    await writeFile(
      manifestPath,
      JSON.stringify({
        schemaVersion: 1,
        'tokens-core': {
          version: '1.4.0',
          sourceCommit: PREVIOUS_TOKEN_SOURCE_COMMIT,
        },
        symbols: {
          version: '1.0.0',
          sourceCommit: SYMBOL_SOURCE_COMMIT,
        },
        illustrations: {
          version: '2.0.0',
          sourceCommit: SYMBOL_SOURCE_COMMIT,
        },
      }),
      'utf8',
    );

    await updateMobileArtifactVersion({
      repositoryDirectory,
      category: 'tokens-core',
      version: '1.5.0',
      sourceCommit: TOKEN_SOURCE_COMMIT,
    });

    await expect(readFile(manifestPath, 'utf8')).resolves.toBe(
      formatJson({
        schemaVersion: 1,
        'tokens-core': {
          version: '1.5.0',
          sourceCommit: TOKEN_SOURCE_COMMIT,
        },
        symbols: {
          version: '1.0.0',
          sourceCommit: SYMBOL_SOURCE_COMMIT,
        },
        illustrations: {
          version: '2.0.0',
          sourceCommit: SYMBOL_SOURCE_COMMIT,
        },
      }),
    );
  });

  it('adds the symbols category while preserving the token version', async () => {
    await writeFile(
      manifestPath,
      JSON.stringify({
        schemaVersion: 1,
        'tokens-core': {
          version: '1.5.0',
          sourceCommit: TOKEN_SOURCE_COMMIT,
        },
      }),
      'utf8',
    );

    await updateMobileArtifactVersion({
      repositoryDirectory,
      category: 'symbols',
      version: '1.0.0',
      sourceCommit: SYMBOL_SOURCE_COMMIT,
    });

    await expect(readFile(manifestPath, 'utf8')).resolves.toBe(
      formatJson({
        schemaVersion: 1,
        'tokens-core': {
          version: '1.5.0',
          sourceCommit: TOKEN_SOURCE_COMMIT,
        },
        symbols: {
          version: '1.0.0',
          sourceCommit: SYMBOL_SOURCE_COMMIT,
        },
      }),
    );
  });

  it('fails without overwriting malformed JSON', async () => {
    const malformedManifest = '{ "tokens-core": ';
    await writeFile(manifestPath, malformedManifest, 'utf8');

    await expect(
      updateMobileArtifactVersion({
        repositoryDirectory,
        category: 'tokens-core',
        version: '1.5.0',
        sourceCommit: TOKEN_SOURCE_COMMIT,
      }),
    ).rejects.toThrow(`Malformed JSON in ${manifestPath}.`);
    await expect(readFile(manifestPath, 'utf8')).resolves.toBe(malformedManifest);
  });

  it('reports unexpected read failures without writing a manifest', async () => {
    vi.spyOn(readJsonFileModule, 'readJsonFile').mockRejectedValueOnce(new Error('Read failed.'));

    await expect(
      updateMobileArtifactVersion({
        repositoryDirectory,
        category: 'tokens-core',
        version: '1.5.0',
        sourceCommit: TOKEN_SOURCE_COMMIT,
      }),
    ).rejects.toThrow(`Failed to read ${manifestPath}.`);
    await expect(readFile(manifestPath, 'utf8')).rejects.toThrow();
  });

  it.each([
    '[]',
    'null',
    `{ "tokens-core": { "version": "1.5.0", "sourceCommit": "${TOKEN_SOURCE_COMMIT}" } }`,
    '{ "schemaVersion": 1, "tokens-core": { "version": "1.5.0", "sourceCommit": "abc1234" } }',
    '{ "schemaVersion": 1, "tokens-core": { "version": "1.5.0", "sourceCommit": 1 } }',
  ])(
    'rejects an invalid manifest shape without overwriting it',
    async (invalidManifest: string) => {
      await writeFile(manifestPath, invalidManifest, 'utf8');

      await expect(
        updateMobileArtifactVersion({
          repositoryDirectory,
          category: 'tokens-core',
          version: '1.5.0',
          sourceCommit: TOKEN_SOURCE_COMMIT,
        }),
      ).rejects.toThrow(
        `${manifestPath} does not match artifact versions manifest schema version 1.`,
      );
      await expect(readFile(manifestPath, 'utf8')).resolves.toBe(invalidManifest);
    },
  );

  it.each([
    { version: '', sourceCommit: TOKEN_SOURCE_COMMIT },
    { version: '   ', sourceCommit: TOKEN_SOURCE_COMMIT },
    { version: '1.5.0', sourceCommit: 'abc1234' },
  ])('rejects an invalid artifact version before writing', async ({ version, sourceCommit }) => {
    await expect(
      updateMobileArtifactVersion({
        repositoryDirectory,
        category: 'tokens-core',
        version,
        sourceCommit,
      }),
    ).rejects.toThrow('Artifact version must have a non-empty version and a full Git commit.');
    await expect(readFile(manifestPath, 'utf8')).rejects.toThrow();
  });
});
