import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../fetch-figma-json-api.ts';
import { type FigmaFile } from './types/figma-file.ts';

export interface GetFigmaFileOptions extends FetchFigmaJsonApiForConsumerOptions {
  readonly file_key: string;
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
  ...options
}: GetFigmaFileOptions): Promise<FigmaFile> {
  const data: FigmaFile | number = await fetchFigmaJsonApi<FigmaFile | number>({
    ...options,
    path: `/v1/files/${file_key}`,
  });

  if (typeof data === 'number') {
    throw new Error(`Error retrieving document from API: ${data}`);
  }

  return data;
}
