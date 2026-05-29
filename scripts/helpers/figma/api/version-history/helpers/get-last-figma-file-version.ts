import { valid } from 'semver';
import {
  getFigmaFileVersionHistory,
  type GetFigmaFileVersionHistoryResponse,
} from '../get-figma-file-version-history.ts';
import type { FigmaFileVersion } from '../types/figma-file-version.ts';
import { isAutosaveFigmaFileVersion } from './is-autosave-figma-file-version.ts';

export interface GetLastFigmaFileVersionOptions {
  readonly figmaApiToken: string;
  readonly figmaFileKey: string;
}

/**
 * Returns the last version of a Figma file that is not an autosave version and follows the `semver` format.
 */
export async function getLastFigmaFileVersion({
  figmaApiToken,
  figmaFileKey,
}: GetLastFigmaFileVersionOptions): Promise<FigmaFileVersion | undefined> {
  const { versions }: GetFigmaFileVersionHistoryResponse = await getFigmaFileVersionHistory({
    token: figmaApiToken,
    file_key: figmaFileKey,
  });

  // DEBUG
  // console.log(JSON.stringify(versions, null, 2));

  return versions
    .filter((version: FigmaFileVersion): boolean => {
      return !isAutosaveFigmaFileVersion(version) && valid(version.label) !== null;
    })
    .at(0);
}
