import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { indent } from '../../../../../../../../../scripts/helpers/misc/string/indent/indent.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { SegmentsReference } from '../../../../../../shared/dtcg/design-token/reference/types/segments/segments-reference.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { CssVariableDeclaration } from '../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import { cssVariableDeclarationsToString } from '../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/css-variable-declarations-to-string.ts';
import { wrapCssVariableDeclarationsWithCssSelector } from '../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/wrap-css-variable-declarations-with-css-selector.ts';
import { segmentsReferenceToCssVariableReference } from '../../../../../../shared/dtcg/resolver/to/css/reference/segments-reference-to-css-variable-reference.ts';
import {
  designTokensCollectionTokenToCssVariableDeclaration,
  type DesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from '../../../../../../shared/dtcg/resolver/to/css/token/design-tokens-collection-token-to-css-variable-declaration.ts';
import { createCssVariableNameGenerator } from '../../../../../../shared/dtcg/resolver/to/css/token/name/create-css-variable-name-generator.ts';
import { DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION } from '../../../../../../shared/dtcg/resolver/to/css/token/name/default-generate-css-variable-name-function.ts';
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
  readonly logger: Logger;
}

export function buildCssTokens({
  baseCollection,
  modifiers,
  outputDirectory,
  logger,
}: BuildCssTokensOptions): Promise<void> {
  return logger.asyncTask('css', async (logger: Logger): Promise<void> => {
    outputDirectory = removeTrailingSlash(outputDirectory);
    const cssOutputDirectory: string = `${outputDirectory}/web/css`;

    const cssOptions: DesignTokensCollectionTokenToCssVariableDeclarationOptions = {
      generateCssVariableName: createCssVariableNameGenerator('esds'),
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
              await logger.asyncTask(context, async (_logger: Logger): Promise<void> => {
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

    // TAILWIND 4+
    // https://tailwindcss.com/docs/theme#theme-variable-namespaces
    // https://tailwindcss.com/docs/theme#default-theme-variable-reference
    await logger.asyncTask('tailwind', async (): Promise<void> => {
      const cssVariables: string = cssVariableDeclarationsToString([
        // ...[
        //   'color',
        //   'font',
        //   'text',
        //   'font-weight',
        //   'tracking',
        //   'leading',
        //   'breakpoint',
        //   'container',
        //   'spacing',
        //   'radius',
        //   'shadow',
        //   'inset-shadow',
        //   'drop-shadow',
        //   'blur',
        //   'perspective',
        //   'aspect',
        //   'ease',
        //   'animate',
        // ].map((tailwindNamespace: string): CssVariableDeclaration => {
        //   return {
        //     name: `--${tailwindNamespace}-*`,
        //     value: 'initial',
        //   };
        // }),
        {
          name: `--*`,
          value: 'initial',
        },
        ...baseCollection
          .tokens()
          .map((token: GenericDesignTokensCollectionToken): CssVariableDeclaration | undefined => {
            const tokenName: string = token.name.join('.');
            let tailwindTokenName: SegmentsReference | undefined;

            if (tokenName.startsWith('color')) {
              tailwindTokenName = ['color', ...token.name.slice(1)];
            } else if (tokenName.startsWith('font.family')) {
              tailwindTokenName = ['font', ...token.name.slice(2)];
            } else if (tokenName.startsWith('font.size')) {
              // TODO: seems to be a t2
              // tailwindTokenName = ['text', ...token.name.slice(2)];
            }

            return tailwindTokenName === undefined
              ? undefined
              : {
                  name: DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION(tailwindTokenName),
                  value: segmentsReferenceToCssVariableReference(token.name, cssOptions),
                  description: token.description,
                  deprecated: token.deprecated,
                };
          })
          .filter(
            (
              declaration: CssVariableDeclaration | undefined,
            ): declaration is CssVariableDeclaration => {
              return declaration !== undefined;
            },
          ),
        {
          name: '--spacing',
          value: '1px',
        },
      ]);

      await Promise.all([
        writeFileSafe(
          `${outputDirectory}/web/tailwind.css`,
          wrapCssVariableDeclarationsWithCssSelector(
            cssVariables,
            '@theme inline',
            CSS_AUTO_GENERATED_FILE_HEADER,
          ),
          {
            encoding: 'utf-8',
          },
        ),
      ]);
    });
  });
}
