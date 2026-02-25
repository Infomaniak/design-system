import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { isCurlyReference } from '../../../../../../shared/dtcg/design-token/reference/types/curly/is-curly-reference.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericDesignTokensCollectionTokenWithType } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/color/is-color-design-tokens-collection-token.ts';
import { createSwiftColorEnum } from './ColorTokens/create-swift-color-enum.ts';
import { processColorToken } from './ColorTokens/process-color-token.ts';
import { defaultXCAssets } from './ColorTokens/XCAssetsIntefaces.ts';

export interface BuildSwiftTokensOptions {
  readonly collection: DesignTokensCollection;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export async function buildSwiftTokens({
  collection,
  outputDirectory,
  logger,
}: BuildSwiftTokensOptions) {
  return logger.asyncTask('swift', async (): Promise<void> => {
    const filesToWrite: { path: string; content: string }[] = [];
    const colorsByFolder: Record<string, string[]> = {};
    const rootContentsJson = {
      info: defaultXCAssets,
    };

    filesToWrite.push({
      path: `${outputDirectory}/ios/Colors.xcassets/Contents.json`,
      content: JSON.stringify(rootContentsJson, null, 2),
    });

    for (const token of collection.tokens()) {
      const resolvedToken: GenericDesignTokensCollectionTokenWithType = {
        ...token,
        type: collection.resolve(token).type,
      };

      if (isColorDesignTokensCollectionToken(resolvedToken)) {
        if (isCurlyReference(resolvedToken.value)) {
          continue;
        }
        const file = processColorToken(resolvedToken, outputDirectory, colorsByFolder);
        filesToWrite.push(file);
      } else {
        console.log(resolvedToken);
      }
    }

    const swiftEnumContent = createSwiftColorEnum(colorsByFolder);
    filesToWrite.push({
      path: `${outputDirectory}/ios/EsdsColorRawTokens.swift`,
      content: swiftEnumContent,
    });

    const writePromises: Promise<void>[] = filesToWrite.map(
      (file: { readonly path: string; readonly content: string }) => {
        return writeFileSafe(file.path, file.content, { encoding: 'utf-8' });
      },
    );

    await Promise.all(writePromises);
  });
}
