import type { Stats } from 'fs';
import { glob, mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative } from 'node:path';

import { Logger } from '../../log/logger.ts';
import { execCommandInherit } from '../../misc/exec-command.ts';
import { githubRequest } from '../api/github-request.ts';
import type { GithubRelease } from '../api/types.ts';
import { uploadGithubReleaseAsset } from './upload-github-release-asset.ts';

export interface CreateGithubReleaseOptions {
  readonly owner: string;
  readonly repository: string;
  readonly authToken: string;
  readonly tagName: string;
  readonly name: string;
  readonly body?: string;
  readonly targetCommitish?: string;
  readonly draft?: boolean;
  readonly prerelease?: boolean;
  readonly generateReleaseNotes?: boolean;
  /**
   * Directory whose files are uploaded as release assets (recursively).
   */
  readonly assetsDirectory: string;
  /**
   * Zips the assets directory content into a single archive before uploading it.
   */
  readonly zip?: boolean;
  /**
   * Name of the uploaded zip archive.
   * @default `${basename(assetsDirectory)}.zip`
   */
  readonly zipFileName?: string;
  /**
   * @default Logger.never()
   */
  readonly logger?: Logger;
}

/**
 * Creates a GitHub release using the GitHub REST API and uploads every file
 * found in `assetsDirectory` (recursively) as release assets, or a single zip
 * archive of that content when `zip` is enabled.
 */
export async function createGithubRelease({
  owner,
  repository,
  authToken,
  tagName,
  name,
  body,
  targetCommitish,
  draft = false,
  prerelease = false,
  generateReleaseNotes = false,
  assetsDirectory,
  zip = false,
  zipFileName = `${basename(assetsDirectory)}.zip`,
  logger = Logger.never(),
}: CreateGithubReleaseOptions): Promise<GithubRelease> {
  const assetFiles: readonly GithubReleaseAssetFile[] = await listAssetFiles(assetsDirectory);
  const assetsZipPath: string | undefined =
    zip && assetFiles.length > 0
      ? await createAssetsZip(logger, assetsDirectory, assetFiles)
      : undefined;

  try {
    const release: GithubRelease = await githubRequest<GithubRelease>({
      method: 'POST',
      path: `/repos/${owner}/${repository}/releases`,
      token: authToken,
      body: {
        tag_name: tagName,
        name,
        body,
        target_commitish: targetCommitish,
        draft,
        prerelease,
        generate_release_notes: generateReleaseNotes,
      },
    });

    if (assetsZipPath === undefined) {
      for (const { path, name: assetFileName } of assetFiles) {
        await uploadGithubReleaseAsset({
          owner,
          repository,
          releaseId: release.id,
          authToken,
          name: assetFileName,
          data: await readFile(path),
        });
      }
    } else {
      await uploadGithubReleaseAsset({
        owner,
        repository,
        releaseId: release.id,
        authToken,
        name: zipFileName,
        data: await readFile(assetsZipPath),
      });
    }

    return release;
  } finally {
    if (assetsZipPath !== undefined) {
      await rm(dirname(assetsZipPath), { recursive: true, force: true });
    }
  }
}

/*---*/

interface GithubReleaseAssetFile {
  readonly path: string;
  readonly relativePath: string;
  readonly name: string;
}

async function listAssetFiles(directory: string): Promise<readonly GithubReleaseAssetFile[]> {
  const stats: Stats = await stat(directory);

  if (!stats.isDirectory()) {
    throw new Error(`Assets directory is not a directory: ${directory}`);
  }

  const files: GithubReleaseAssetFile[] = [];

  for await (const entry of glob('**/*', { cwd: directory, withFileTypes: true })) {
    if (entry.isFile()) {
      const path: string = join(entry.parentPath, entry.name);
      files.push({ path, relativePath: relative(directory, path), name: entry.name });
    }
  }

  return files.sort(
    (a: GithubReleaseAssetFile, b: GithubReleaseAssetFile): number =>
      a.name.localeCompare(b.name) || a.path.localeCompare(b.path),
  );
}

async function createAssetsZip(
  logger: Logger,
  assetsDirectory: string,
  assetFiles: readonly GithubReleaseAssetFile[],
): Promise<string> {
  const tempDirectory: string = await mkdtemp(join(tmpdir(), 'github-release-'));
  const zipFilePath: string = join(tempDirectory, 'assets.zip');

  try {
    await execCommandInherit(
      logger,
      'zip',
      [
        '-r',
        '-X',
        zipFilePath,
        '--',
        ...assetFiles.map(({ relativePath }): string => relativePath),
      ],
      {
        cwd: assetsDirectory,
      },
    );
  } catch (error: unknown) {
    await rm(tempDirectory, { recursive: true, force: true });
    throw error;
  }

  return zipFilePath;
}
