import { removeUndefinedProperties } from '../../../misc/object/remove-undefined-properties.ts';
import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../fetch-figma-json-api.ts';
import { type FigmaFile } from './types/figma-file.ts';

export interface GetFigmaFileOptions extends FetchFigmaJsonApiForConsumerOptions {
  readonly file_key: string;
  readonly depth?: number;
  readonly geometry?: 'paths';
  readonly branch_data?: boolean;
}

/**
 * Gets a figma file.
 *
 * `GET /v1/files/{fileKey}`
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-endpoints/#get-files-endpoint
 */
export async function getFigmaFile({
  file_key,
  depth,
  geometry,
  branch_data,
  ...options
}: GetFigmaFileOptions): Promise<FigmaFile> {
  const data: FigmaFile | number = await fetchFigmaJsonApi<FigmaFile | number>({
    ...options,
    path: `/v1/files/${file_key}`,
    searchParam: new URLSearchParams(
      removeUndefinedProperties({
        depth: depth === undefined ? undefined : String(depth),
        geometry,
        branch_data: branch_data === undefined || !branch_data ? undefined : 'true',
      }) as Record<string, string>,
    ),
  });

  if (typeof data === 'number') {
    throw new Error(`Error retrieving document from API: ${data}`);
  }

  return data;
}
