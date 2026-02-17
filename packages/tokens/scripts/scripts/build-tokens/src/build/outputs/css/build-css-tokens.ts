import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { indent } from '../../../../../../../../../scripts/helpers/misc/string/indent/indent.ts';
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
import {
  DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION,
  RAW_GENERATE_CSS_VARIABLE_NAME_FUNCTION,
} from '../../../../../../shared/dtcg/resolver/to/css/token/name/default-generate-css-variable-name-function.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { T1_DIRECTORY_NAME } from '../../../constants/design-token-tiers.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../constants/auto-generated-file-header .ts';

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

      await writeFileSafe(
        `${outputDirectory}/web/css/tokens.root.css`,
        wrapCssVariableDeclarationsWithCssSelector(
          cssVariables,
          ':root,\n:host',
          CSS_AUTO_GENERATED_FILE_HEADER,
        ),
        {
          encoding: 'utf-8',
        },
      );
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

                for (const referenced of toRedeclare) {
                  const name: ArrayDesignTokenName = JSON.parse(referenced);
                  const token: GenericDesignTokensCollectionToken = collection.get(name);

                  declarations.push(
                    designTokensCollectionTokenToCssVariableDeclaration(
                      {
                        ...token,
                        type: collection.resolve(token).type,
                      },
                      cssOptions,
                    ),
                  );
                }

                const cssVariables: string = cssVariableDeclarationsToString(declarations);

                const path: string = `${outputDirectory}/web/css/modifiers/${modifier}`;

                await Promise.all([
                  writeFileSafe(
                    `${path}/${context}.root.css`,
                    wrapCssVariableDeclarationsWithCssSelector(
                      cssVariables,
                      ':root,\n:host',
                      CSS_AUTO_GENERATED_FILE_HEADER,
                    ),
                    {
                      encoding: 'utf-8',
                    },
                  ),
                  writeFileSafe(
                    `${path}/${context}.attr.css`,
                    wrapCssVariableDeclarationsWithCssSelector(
                      cssVariables,
                      `[data-esds-${modifier}="${context}"]`,
                      CSS_AUTO_GENERATED_FILE_HEADER,
                    ),
                    {
                      encoding: 'utf-8',
                    },
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
      const generateTailwindToken = (
        token: GenericDesignTokensCollectionToken,
        tailwindTokenName: string,
      ): CssVariableDeclaration => {
        return {
          name: tailwindTokenName,
          value: segmentsReferenceToCssVariableReference(token.name, cssOptions),
          description: token.description,
          deprecated: token.deprecated,
        };
      };

      const cssVariables: string = cssVariableDeclarationsToString([
        // ...[
        //   'color', // ✅
        //   'font', // ✅
        //   'text', // ✅
        //   'font-weight', // ✅
        //   'tracking',
        //   'leading',
        //   'breakpoint',
        //   'container',
        //   'spacing', // ✅
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
          .flatMap(
            (token: GenericDesignTokensCollectionToken): readonly CssVariableDeclaration[] => {
              const tokenName: string = token.name.join('.');

              const isNotT1Token: boolean = token.files.every(
                (file: string): boolean => !file.includes(T1_DIRECTORY_NAME),
              );

              if (isNotT1Token) {
                if (tokenName.startsWith('color')) {
                  // --color-*
                  return [
                    generateTailwindToken(
                      token,
                      DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION([
                        'color',
                        ...token.name.slice(1),
                      ]),
                    ),
                  ];
                } else if (tokenName.startsWith('font.family')) {
                  // --font-*
                  return [
                    generateTailwindToken(
                      token,
                      DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION(['font', ...token.name.slice(2)]),
                    ),
                  ];
                } else if (tokenName.startsWith('text')) {
                  // --text-*
                  if (tokenName.endsWith('size')) {
                    return [
                      generateTailwindToken(
                        token,
                        RAW_GENERATE_CSS_VARIABLE_NAME_FUNCTION([
                          'text',
                          ...token.name.slice(1, -1),
                        ]),
                      ),
                    ];
                  } else if (tokenName.endsWith('line-height')) {
                    return [
                      generateTailwindToken(
                        token,
                        RAW_GENERATE_CSS_VARIABLE_NAME_FUNCTION([
                          'text',
                          ...token.name.slice(1, -1),
                          '',
                          'line-height',
                        ]),
                      ),
                    ];
                  }
                } else if (tokenName.startsWith('font.weight')) {
                  // --font-weight-*
                  return [
                    generateTailwindToken(
                      token,
                      DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION([
                        'font',
                        'weight',
                        ...token.name.slice(2),
                      ]),
                    ),
                  ];
                }
              }

              return [];
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
