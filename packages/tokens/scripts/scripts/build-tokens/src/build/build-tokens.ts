import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import {
  type DesignTokenModifiers,
  extractDesignTokenModifiers,
} from '../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import { DESIGN_TOKEN_TIERS } from '../constants/design-token-tiers.ts';
import { buildCssTokens } from './outputs/css/build-css-tokens.ts';
import { buildFigmaTokens } from './outputs/figma/build-figma-tokens.ts';
import { buildMarkdownTokens } from './outputs/markdown/build-markdown-tokens.ts';
import { buildSwiftTokens } from './outputs/swift/build-swift-tokens.ts';

export interface BuildTokensOptions {
  readonly sourceDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export function buildTokens({
  sourceDirectory,
  outputDirectory,
  logger,
}: BuildTokensOptions): Promise<void> {
  return logger.asyncTask('build-tokens', async (logger: Logger): Promise<void> => {
    sourceDirectory = removeTrailingSlash(sourceDirectory);
    outputDirectory = removeTrailingSlash(outputDirectory);

    const baseCollection: DesignTokensCollection = await new DesignTokensCollection().fromFiles(
      DESIGN_TOKEN_TIERS.map(
        (tier: string): string => `${sourceDirectory}/${tier}/**/*.tokens.json`,
      ),
      {
        forEachTokenBehaviour: 'only-new-token',
      },
    );

    // MODIFIERS
    const modifiers: DesignTokenModifiers = await extractDesignTokenModifiers({
      sourceDirectory: `${sourceDirectory}/modifiers`,
      baseCollection,
    });

    // CSS
    await buildCssTokens({
      baseCollection,
      modifiers,
      outputDirectory,
      logger,
    });

    // FIGMA
    await buildFigmaTokens({
      collection: baseCollection,
      outputDirectory,
      logger,
    });

    // SWIFT
    await buildSwiftTokens({
      collection: baseCollection,
      outputDirectory,
      logger,
    });

    // Markdown
    await buildMarkdownTokens({
      collection,
      outputDirectory,
      logger,
    });
  });
}
