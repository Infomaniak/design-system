import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { CssVariableDeclaration } from '../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import {
  designTokensCollectionTokenToCssVariableDeclaration,
  type DesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from '../../../../../../shared/dtcg/resolver/to/css/token/design-tokens-collection-token-to-css-variable-declaration.ts';
import { createCssVariableNameGenerator } from '../../../../../../shared/dtcg/resolver/to/css/token/name/create-css-variable-name-generator.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { buildBaseTokensCssFiles } from './helpers/build-base-tokens-css-files.ts';
import {
  buildModifierContextCssFiles,
  type ModifierContextCssFiles,
} from './helpers/build-modifier-context-css-files.ts';
import { CSS_AUTO_GENERATED_FILE_HEADER } from './helpers/css-variable-declarations-to-two-block-string.ts';

export interface BuildCssTokensOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly modifiers: DesignTokenModifiers;
  readonly outputDirectory: string;
  readonly subDirectory?: string;
  readonly logger: Logger;
}

export function buildCssTokens({
  baseCollection,
  modifiers,
  outputDirectory,
  subDirectory = '',
  logger,
}: BuildCssTokensOptions): Promise<void> {
  return logger.asyncTask('css', async (logger: Logger): Promise<void> => {
    outputDirectory = removeTrailingSlash(outputDirectory);
    subDirectory = removeTrailingSlash(subDirectory);
    const cssOutputDirectory: string = `${outputDirectory}/web/css${subDirectory === '' ? '' : `/${subDirectory}`}`;

    const cssOptions: DesignTokensCollectionTokenToCssVariableDeclarationOptions = {
      generateCssVariableName: createCssVariableNameGenerator({
        prefix: 'esds',
      }),
    };

    await logger.asyncTask('main', async (): Promise<void> => {
      const declarations: CssVariableDeclaration[] = Array.from(
        baseCollection.tokens(),
        (token: GenericDesignTokensCollectionToken): CssVariableDeclaration =>
          designTokensCollectionTokenToCssVariableDeclaration(
            {
              ...token,
              type: baseCollection.resolve(token).type,
            },
            cssOptions,
          ),
      );

      const files: BaseTokensCssFiles = buildBaseTokensCssFiles(declarations);

      await Promise.all([
        writeTextFileSafe(`${cssOutputDirectory}/tokens.root.css`, files['tokens.root.css']),
        writeTextFileSafe(`${cssOutputDirectory}/tokens.attr.css`, files['tokens.attr.css']),
      ]);
    });

    await logger.asyncTask('modifier', async (logger: Logger): Promise<void> => {
      const modifiersOutputDirectory: string = `${cssOutputDirectory}/modifiers`;

      const baseDeclarations: CssVariableDeclaration[] = Array.from(
        baseCollection.tokens(),
        (token: GenericDesignTokensCollectionToken): CssVariableDeclaration =>
          designTokensCollectionTokenToCssVariableDeclaration(
            {
              ...token,
              type: baseCollection.resolve(token).type,
            },
            cssOptions,
          ),
      );

      for (const [modifier, contexts] of modifiers.entries()) {
        await logger.asyncTask(modifier, async (logger: Logger): Promise<void> => {
          const modifierOutputDirectory: string = `${modifiersOutputDirectory}/${modifier}`;

          await logger.asyncTask('context', async (logger: Logger): Promise<void> => {
            for (const [context, collection] of contexts.entries()) {
              await logger.asyncTask(context, async (): Promise<void> => {
                const declarations: CssVariableDeclaration[] = Array.from(
                  collection.tokens(),
                  (token: GenericDesignTokensCollectionToken): CssVariableDeclaration =>
                    designTokensCollectionTokenToCssVariableDeclaration(
                      {
                        ...token,
                        type: collection.resolve(token).type,
                      },
                      cssOptions,
                    ),
                );

                const files: ModifierContextCssFiles = buildModifierContextCssFiles({
                  modifier,
                  context,
                  declarations,
                  baseDeclarations,
                });

                await Promise.all([
                  writeTextFileSafe(`${modifierOutputDirectory}/${context}.root.css`, files.root),
                  writeTextFileSafe(`${modifierOutputDirectory}/${context}.attr.css`, files.attr),
                ]);
              });
            }
          });

          await writeTextFileSafe(
            `${modifierOutputDirectory}/all.attr.css`,
            dedent`
              ${CSS_AUTO_GENERATED_FILE_HEADER}
              ${Array.from(
                contexts.keys().map((context: string): string => {
                  return `@import "./${context}.attr.css";`;
                }),
              ).join('\n')}
            `,
          );
        });
      }

      await writeTextFileSafe(
        `${modifiersOutputDirectory}/all.attr.css`,
        dedent`
          ${CSS_AUTO_GENERATED_FILE_HEADER}
          ${Array.from(modifiers.keys())
            .sort(sortModifiersByPriority)
            .map((modifier: string): string => {
              return `@import "./${modifier}/all.attr.css";`;
            })
            .join('\n')}
        `,
      );
    });
  });
}

/* INTERNAL */

const MODIFIERS_PRIORITY = ['theme', 'product'];

function sortModifiersByPriority(modifierA: string, modifierB: string): number {
  const indexA: number = MODIFIERS_PRIORITY.indexOf(modifierA);
  const indexB: number = MODIFIERS_PRIORITY.indexOf(modifierB);

  if (indexA === indexB) {
    return 0;
  } else if (indexA === -1) {
    // B before A
    return 1;
  } else if (indexB === -1) {
    // A before B
    return -1;
  } else {
    // modifier with lower index first
    return indexA - indexB;
  }
}
