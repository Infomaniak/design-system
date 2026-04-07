import {
  fetchFigmaJsonApi,
  type FetchFigmaJsonApiForConsumerOptions,
} from '../fetch-figma-json-api.ts';
import { type FigmaVariables } from './types/figma-variables.ts';

export interface GetFigmaPublishedVariablesOptions extends FetchFigmaJsonApiForConsumerOptions {
  readonly fileKey: string;
}

/**
 * Gets the published variables of a figma file.
 *
 * `GET /v1/files/{fileKey}/variables/published`
 *
 * **WARN:** This endpoint requires a "full seat" on "enterprise plan".
 *
 * @inheritDoc https://developers.figma.com/docs/rest-api/variables-endpoints/#get-published-variables-endpoint
 */
export async function getFigmaPublishedVariables({
  fileKey,
  ...options
}: GetFigmaPublishedVariablesOptions): Promise<FigmaVariables> {
  const data: FigmaVariables | number = await fetchFigmaJsonApi<FigmaVariables | number>({
    ...options,
    path: `/v1/files/${fileKey}/variables/published`,
  });

  if (typeof data === 'number') {
    throw new Error(`Error retrieving document from API: ${data}`);
  }

  return data;
}

/**
 * Plugins:
 * - https://www.figma.com/community/plugin/1345069854741911632/figma-token-exporter 16.6k users
 * - https://www.figma.com/community/plugin/1310888112326715990/figma-variable-explorer 7.6k users
 * - https://www.figma.com/community/plugin/1542466239735095281/tokenbridge
 *
 * - https://github.com/tokens-bruecke/figma-plugin => https://www.figma.com/community/plugin/1254538877056388290/tokensbrucke 1.6k users
 * - https://github.com/microsoft/figma-variables-import
 */
