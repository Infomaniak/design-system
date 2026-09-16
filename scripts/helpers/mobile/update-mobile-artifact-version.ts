import { join } from 'node:path';
import { readJsonFile } from '../file/read-json-file.ts';
import { writeJsonFileSafe } from '../file/write-json-file-safe.ts';
import { isFullGitCommitHash } from '../git/is-full-git-commit-hash.ts';

const VERSIONS_MANIFEST_FILE_NAME = 'versions.json';
const VERSIONS_MANIFEST_SCHEMA_VERSION = 1;

export type MobileArtifactVersionCategory = 'tokens-core' | 'symbols';

export interface UpdateMobileArtifactVersionOptions {
  readonly repositoryDirectory: string;
  readonly category: MobileArtifactVersionCategory;
  readonly version: string;
  readonly sourceCommit: string;
}

interface ArtifactVersion {
  readonly version: string;
  readonly sourceCommit: string;
}

interface VersionsManifest {
  readonly schemaVersion: typeof VERSIONS_MANIFEST_SCHEMA_VERSION;
  readonly [category: string]: typeof VERSIONS_MANIFEST_SCHEMA_VERSION | ArtifactVersion;
}

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function isArtifactVersion(value: unknown): value is ArtifactVersion {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'version' in value &&
    typeof value.version === 'string' &&
    value.version.trim() !== '' &&
    'sourceCommit' in value &&
    isFullGitCommitHash(value.sourceCommit) &&
    Object.keys(value).every((key: string): boolean => ['version', 'sourceCommit'].includes(key))
  );
}

function isVersionsManifest(value: unknown): value is VersionsManifest {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'schemaVersion' in value &&
    value.schemaVersion === VERSIONS_MANIFEST_SCHEMA_VERSION &&
    Object.entries(value).every(
      ([category, artifactVersion]: [string, unknown]): boolean =>
        category === 'schemaVersion' || isArtifactVersion(artifactVersion),
    )
  );
}

async function readVersionsManifest(manifestPath: string): Promise<VersionsManifest> {
  let manifest: unknown;

  try {
    manifest = await readJsonFile<unknown>(manifestPath);
  } catch (error: unknown) {
    if (isMissingFileError(error)) {
      return { schemaVersion: VERSIONS_MANIFEST_SCHEMA_VERSION };
    }

    if (error instanceof SyntaxError) {
      throw new SyntaxError(`Malformed JSON in ${manifestPath}.`, { cause: error });
    }

    throw new Error(`Failed to read ${manifestPath}.`, { cause: error });
  }

  if (!isVersionsManifest(manifest)) {
    throw new TypeError(`${manifestPath} does not match versions manifest schema version 1.`);
  }

  return manifest;
}

export async function updateMobileArtifactVersion({
  repositoryDirectory,
  category,
  version,
  sourceCommit,
}: UpdateMobileArtifactVersionOptions): Promise<void> {
  const manifestPath: string = join(repositoryDirectory, VERSIONS_MANIFEST_FILE_NAME);
  const manifest: VersionsManifest = await readVersionsManifest(manifestPath);
  const artifactVersion: ArtifactVersion = { version, sourceCommit };

  if (!isArtifactVersion(artifactVersion)) {
    throw new TypeError('Artifact version must have a non-empty version and a full Git commit.');
  }

  const { schemaVersion, ...artifactVersions } = manifest;

  await writeJsonFileSafe(manifestPath, {
    schemaVersion,
    ...artifactVersions,
    [category]: artifactVersion,
  });
}
