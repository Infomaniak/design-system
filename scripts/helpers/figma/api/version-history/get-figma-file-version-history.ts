import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../fetch-figma-json-api.ts';
import type { FigmaPagination } from '../shared/types/figma-pagination.ts';
import type { FigmaFileVersion } from './types/figma-file-version.ts';

export interface GetFigmaFileVersionHistoryOptions extends FetchFigmaJsonApiForConsumerOptions {
  readonly file_key: string;
}

export interface GetFigmaFileVersionHistoryResponse {
  readonly versions: readonly FigmaFileVersion[];
  readonly pagination: FigmaPagination;
}

/**
 * Gets a figma file.
 *
 * `GET /v1/files/:key/versions`
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/version-history-endpoints/#get-file-versions-endpoint
 */
export async function getFigmaFileVersionHistory({
  file_key,
  ...options
}: GetFigmaFileVersionHistoryOptions): Promise<GetFigmaFileVersionHistoryResponse> {
  return fetchFigmaJsonApi<GetFigmaFileVersionHistoryResponse>({
    ...options,
    path: `/v1/files/${file_key}/versions`,
  });
}
