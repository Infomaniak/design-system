import { join } from 'node:path';
import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import { designTokensCollectionTokenToCssVariableDeclaration } from '../../../../../../shared/dtcg/resolver/to/css/token/design-tokens-collection-token-to-css-variable-declaration.ts';
import { isColorDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/color/is-color-design-tokens-collection-token.ts';

export interface BuildMarkdownTokensOptions {
  readonly collection: DesignTokensCollection;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export async function buildMarkdownTokens({
  collection,
  outputDirectory,
  logger,
}: BuildMarkdownTokensOptions) {
  return logger.asyncTask('markdown', async (): Promise<void> => {
    const colorTable: string[] = [
      '| Color | Name | Description |',
      '|-------|------|-------------|',
    ];

    for (const token of collection.tokens()) {
      if (isColorDesignTokensCollectionToken(token)) {
        const { value, name, description } =
          designTokensCollectionTokenToCssVariableDeclaration(token);
        const colorBox = `<div style="border-radius: 4px; width: 100%; height: 75px; background: ${value}; border: 1px solid #ccc;"></div>\`${value}\``;
        colorTable.push(`| ${colorBox} | \`${name}\` | ${description ?? ''} |`);
      }
    }

    const colorFilePath = join(outputDirectory, 'markdown', 'colors.md');
    await writeFileSafe(colorFilePath, colorTable.join('\n'), { encoding: 'utf-8' });
  });
}
