import { loadEnvFile } from '../../../../scripts/helpers/env/load-env-file.ts';
import { getFigmaFile } from '../../../../scripts/helpers/figma/api/files/get-figma-file.ts';
import { getEnvFigmaApiToken } from '../../../../scripts/helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaTokensFileKey } from '../../../../scripts/helpers/figma/env/get-env-figma-tokens-file-key.ts';

/**
 * TODO work-in-progress
 */

export async function importFromFigma(): Promise<void> {
  loadEnvFile();

  const result = await getFigmaFile({
    fileKey: getEnvFigmaTokensFileKey(),
    token: getEnvFigmaApiToken(),
  });
  // await writeFile('test.json', JSON.stringify(result, null, 2));

  // const result = await getFigmaPublishedVariables({
  //   fileKey: getEnvFigmaTokensFileKey(),
  //   token: getEnvFigmaApiToken(),
  // });

  console.log(result);
}

importFromFigma();
