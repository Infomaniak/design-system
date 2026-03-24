import type { BuildConfig } from '../../../../../../../scripts/helpers/build/build-config/build-config.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { ensureDesignTokenFilesContainsOnlyReferences } from '../../../../shared/dtcg/operations/validate/data/ensure-contains-only-references/files/ensure-design-token-files-contains-only-references.ts';
import { validateDesignTokenFilesSchema } from '../../../../shared/dtcg/operations/validate/schema/files/validate-design-token-files-schema.ts';
import { DesignTokensCollection } from '../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import {
  type DesignTokenModifiers,
  extractDesignTokenModifiers,
} from '../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import {
  DESIGN_TOKEN_TIERS,
  MATERIAL_DIRECTORY_NAME,
  MODIFIERS_DIRECTORY_NAME,
  T2_DIRECTORY_NAME,
  T3_DIRECTORY_NAME,
} from '../constants/design-token-tiers.ts';
import { buildCssTokens } from './outputs/css/build-css-tokens.ts';
import { buildFigmaTokens } from './outputs/figma/build-figma-tokens.ts';
import { buildKotlinTokens } from './outputs/kotlin/build-kotlin-tokens.ts';
import { buildMarkdownTokens } from './outputs/markdown/build-markdown-tokens.ts';
import { buildSwiftTokens } from './outputs/swift/build-swift-tokens.ts';
import { validateModifiers } from './validate/validate-modifiers.ts';

export interface BuildTokensOptions extends BuildConfig {
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

    // VALIDATE SCHEMA
    await logger.asyncTask('validate-schema', (): Promise<void> => {
      return validateDesignTokenFilesSchema([`${sourceDirectory}/**/*.tokens.json`]);
    });

    // VALIDATE that T2, T3 and MODIFIERS contains only references
    await logger.asyncTask('validate-tokens-contain-only-references', (): Promise<void> => {
      return ensureDesignTokenFilesContainsOnlyReferences([
        `${sourceDirectory}/${T2_DIRECTORY_NAME}/*.tokens.json`,
        `${sourceDirectory}/${T3_DIRECTORY_NAME}/*.tokens.json`,
        `${sourceDirectory}/${MODIFIERS_DIRECTORY_NAME}/*.tokens.json`,
      ]);
    });

    // IMPORT T1, T2, T3, TOKENS
    const baseCollection: DesignTokensCollection = await new DesignTokensCollection().fromFiles(
      DESIGN_TOKEN_TIERS.map(
        (tier: string): string => `${sourceDirectory}/${tier}/**/*.tokens.json`,
      ),
      {
        forEachTokenBehaviour: 'only-new-token',
      },
    );

    // IMPORT MODIFIERS
    const modifiers: DesignTokenModifiers = await extractDesignTokenModifiers({
      sourceDirectories: [`${sourceDirectory}/${MODIFIERS_DIRECTORY_NAME}`],
      baseCollection,
    });

    // VALIDATE MODIFIERS
    await logger.asyncTask('validate-modifiers', (): void => {
      validateModifiers(modifiers);
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
      baseCollection,
      modifiers,
      outputDirectory,
      logger,
    });

    // SWIFT
    await buildSwiftTokens({
      sourceDirectory,
      outputDirectory,
      logger,
    });

    // KOTLIN
    await buildKotlinTokens({
      collection: baseCollection,
      outputDirectory,
      logger,
    });

    // MATERIAL
    await logger.asyncTask('material', async (logger: Logger): Promise<void> => {
      // IMPORT MATERIAL TOKENS
      const materialCollection: DesignTokensCollection = await baseCollection
        .clone()
        .fromFiles([`${sourceDirectory}/${MATERIAL_DIRECTORY_NAME}/tokens/**/*.tokens.json`], {
          forEachTokenBehaviour: 'only-new-token',
        });

      // IMPORT MATERIAL MODIFIERS
      const materialModifiers: DesignTokenModifiers = await extractDesignTokenModifiers({
        sourceDirectories: [
          `${sourceDirectory}/${MODIFIERS_DIRECTORY_NAME}`,
          `${sourceDirectory}/${MATERIAL_DIRECTORY_NAME}/${MODIFIERS_DIRECTORY_NAME}`,
        ],
        baseCollection: materialCollection,
      });

      // CSS
      await buildCssTokens({
        baseCollection: materialCollection,
        modifiers: materialModifiers,
        outputDirectory,
        subDirectory: 'material',
        logger,
      });

      // MARKDOWN
      await buildMarkdownTokens({
        baseCollection: materialCollection,
        modifiers: materialModifiers,
        outputDirectory,
        logger,
      });
    });
  });
}
