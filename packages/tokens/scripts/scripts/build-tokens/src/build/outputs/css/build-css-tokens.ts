import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { indent } from '../../../../../../../../../scripts/helpers/misc/string/indent/indent.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { CssVariableDeclaration } from '../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import { cssVariableDeclarationsToString } from '../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/css-variable-declarations-to-string.ts';
import { wrapCssVariableDeclarationsWithCssSelector } from '../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/wrap-css-variable-declarations-with-css-selector.ts';
import {
  designTokensCollectionTokenToCssVariableDeclaration,
  type DesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from '../../../../../../shared/dtcg/resolver/to/css/token/design-tokens-collection-token-to-css-variable-declaration.ts';
import { createCssVariableNameGenerator } from '../../../../../../shared/dtcg/resolver/to/css/token/name/create-css-variable-name-generator.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../constants/auto-generated-file-header.ts';

const CSS_AUTO_GENERATED_FILE_HEADER = `/*
  ${indent(AUTO_GENERATED_FILE_HEADER)}
*/

`;

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
      const cssVariables: string = cssVariableDeclarationsToString(
        baseCollection
          .tokens()
          .map((token: GenericDesignTokensCollectionToken): CssVariableDeclaration => {
            return designTokensCollectionTokenToCssVariableDeclaration(
              {
                ...token,
                type: baseCollection.resolve(token).type,
              },
              cssOptions,
            );
          }),
      );

      await Promise.all([
        writeTextFileSafe(
          `${cssOutputDirectory}/tokens.root.css`,
          wrapCssVariableDeclarationsWithCssSelector(
            cssVariables,
            ':root,\n:host',
            CSS_AUTO_GENERATED_FILE_HEADER,
          ),
        ),
        writeTextFileSafe(
          `${cssOutputDirectory}/tokens.attr.css`,
          wrapCssVariableDeclarationsWithCssSelector(
            cssVariables,
            `[data-esds-tokens]`,
            CSS_AUTO_GENERATED_FILE_HEADER,
          ),
        ),
      ]);
    });

    await logger.asyncTask('modifier', async (logger: Logger): Promise<void> => {
      for (const [modifier, contexts] of modifiers.entries()) {
        await logger.asyncTask(modifier, async (logger: Logger): Promise<void> => {
          await logger.asyncTask('context', async (logger: Logger): Promise<void> => {
            for (const [context, collection] of contexts.entries()) {
              await logger.asyncTask(context, async (): Promise<void> => {
                const expectedPath: string = `${modifier}/${context}`;

                const toRedeclare: Set<string> = new Set();

                const declarations: CssVariableDeclaration[] = Array.from(
                  collection
                    .tokens()
                    .filter((token: GenericDesignTokensCollectionToken): boolean => {
                      return token.files.some((path: string): boolean =>
                        path.includes(expectedPath),
                      );
                    })
                    .map((token: GenericDesignTokensCollectionToken): CssVariableDeclaration => {
                      for (const referenced of collection.getTokensDirectlyReferencing(
                        token.name,
                      )) {
                        toRedeclare.add(JSON.stringify(referenced.name));
                      }

                      return designTokensCollectionTokenToCssVariableDeclaration(
                        {
                          ...token,
                          type: collection.resolve(token).type,
                        },
                        cssOptions,
                      );
                    }),
                );

                const declarationsToRedeclare: CssVariableDeclaration[] = Array.from(
                  toRedeclare.values().map((referenced: string): CssVariableDeclaration => {
                    const name: ArrayDesignTokenName = JSON.parse(referenced);
                    const token: GenericDesignTokensCollectionToken = collection.get(name);

                    return designTokensCollectionTokenToCssVariableDeclaration(
                      {
                        ...token,
                        type: collection.resolve(token).type,
                      },
                      cssOptions,
                    );
                  }),
                );

                let cssVariables: string = cssVariableDeclarationsToString(declarations);

                if (declarationsToRedeclare.length > 0) {
                  cssVariables += dedent`
                    /* REDECLARED */
                    ${cssVariableDeclarationsToString(declarationsToRedeclare)}
                  `;
                }

                const modifierOutputDirectory: string = `${cssOutputDirectory}/modifiers/${modifier}`;

                await Promise.all([
                  writeTextFileSafe(
                    `${modifierOutputDirectory}/${context}.root.css`,
                    wrapCssVariableDeclarationsWithCssSelector(
                      cssVariables,
                      ':root,\n:host',
                      CSS_AUTO_GENERATED_FILE_HEADER,
                    ),
                  ),
                  writeTextFileSafe(
                    `${modifierOutputDirectory}/${context}.attr.css`,
                    wrapCssVariableDeclarationsWithCssSelector(
                      cssVariables,
                      `[data-esds-${modifier}="${context}"]`,
                      CSS_AUTO_GENERATED_FILE_HEADER,
                    ),
                  ),
                ]);
              });
            }
          });
        });
      }
    });
  });
}
