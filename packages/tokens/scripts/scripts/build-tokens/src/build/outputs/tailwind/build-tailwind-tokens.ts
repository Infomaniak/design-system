import { glob } from 'node:fs/promises';
import { readTextFile } from '../../../../../../../../../scripts/helpers/file/read-text-file.ts';
import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { block } from '../../../../../../../../../scripts/helpers/misc/block.ts';
import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { indent } from '../../../../../../../../../scripts/helpers/misc/string/indent/indent.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { CssVariableDeclaration } from '../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import { cssVariableDeclarationsToString } from '../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/css-variable-declarations-to-string.ts';
import { wrapCssVariableDeclarationsWithCssSelector } from '../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/wrap-css-variable-declarations-with-css-selector.ts';
import { segmentsReferenceToCssVariableReference } from '../../../../../../shared/dtcg/resolver/to/css/reference/segments-reference-to-css-variable-reference.ts';
import type { DesignTokensCollectionTokenToCssVariableDeclarationOptions } from '../../../../../../shared/dtcg/resolver/to/css/token/design-tokens-collection-token-to-css-variable-declaration.ts';
import { createCssVariableNameGenerator } from '../../../../../../shared/dtcg/resolver/to/css/token/name/create-css-variable-name-generator.ts';
import {
  DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION,
  RAW_GENERATE_CSS_VARIABLE_NAME_FUNCTION,
} from '../../../../../../shared/dtcg/resolver/to/css/token/name/default-generate-css-variable-name-function.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { T1_DIRECTORY_NAME } from '../../../constants/design-token-tiers.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../constants/auto-generated-file-header.ts';

// TAILWIND 4+
// https://tailwindcss.com/docs/theme#theme-variable-namespaces
// https://tailwindcss.com/docs/theme#default-theme-variable-reference

const CSS_AUTO_GENERATED_FILE_HEADER = `/*
  ${indent(AUTO_GENERATED_FILE_HEADER)}
*/
`;

export interface BuildTailwindTokensOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly componentsSourceDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export function buildTailwindTokens({
  baseCollection,
  componentsSourceDirectory,
  outputDirectory,
  logger,
}: BuildTailwindTokensOptions): Promise<void> {
  return logger.asyncTask('tailwind', async (logger: Logger): Promise<void> => {
    outputDirectory = removeTrailingSlash(outputDirectory);
    componentsSourceDirectory = removeTrailingSlash(componentsSourceDirectory);

    const theme: string = block((): string => {
      const cssOptions: DesignTokensCollectionTokenToCssVariableDeclarationOptions = {
        generateCssVariableName: createCssVariableNameGenerator({
          prefix: 'esds',
        }),
      };

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
        // NOTE: when all namespaces will be bound, we'll swap to `--*: initial`
        ...[
          'color',
          'font',
          'text',
          'font-weight',
          'tracking',
          // 'leading',
          // 'breakpoint',
          // 'container',
          'spacing',
          'radius',
          // 'shadow',
          // 'inset-shadow',
          // 'drop-shadow',
          'blur',
          // 'perspective',
          // 'aspect',
          // 'ease',
          // 'animate',
        ].map((tailwindNamespace: string): CssVariableDeclaration => {
          return {
            name: `--${tailwindNamespace}-*`,
            value: 'initial',
          };
        }),
        // NOTE: reset all to initial (example)
        // {
        //   name: `--*`,
        //   value: 'initial',
        // },
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
                      DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION(
                        block((): string[] => {
                          // NOTE: https://github.com/tailwindlabs/tailwindcss/blob/90f8ff41c8e2a4d17bc76921e23e9d672123da76/packages/tailwindcss/src/utilities.ts#L2952
                          //  not in the documentation, but we may associate color tokens to specific tailwind utilities.
                          if (tokenName.startsWith('color.background')) {
                            return ['background-color', ...token.name.slice(2)];
                          } else if (tokenName.startsWith('color.border')) {
                            return ['border-color', ...token.name.slice(2)];
                          } else if (tokenName.startsWith('color.content')) {
                            return ['text-color', ...token.name.slice(2)];
                          } else {
                            return ['color', ...token.name.slice(1)];
                          }
                        }),
                      ),
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
                } else if (tokenName.startsWith('text.')) {
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
                } else if (tokenName.startsWith('font.letter-spacing')) {
                  // --tracking-*
                  return [
                    generateTailwindToken(
                      token,
                      DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION([
                        'tracking',
                        ...token.name.slice(2),
                      ]),
                    ),
                  ];
                } else if (tokenName.startsWith('radius')) {
                  // --radius-*
                  return [
                    generateTailwindToken(
                      token,
                      RAW_GENERATE_CSS_VARIABLE_NAME_FUNCTION(['radius', ...token.name.slice(1)]),
                    ),
                  ];
                } else if (tokenName.startsWith('blur')) {
                  // --blur-*
                  return [
                    generateTailwindToken(
                      token,
                      RAW_GENERATE_CSS_VARIABLE_NAME_FUNCTION(['blur', ...token.name.slice(1)]),
                    ),
                  ];
                }
              }

              return [];
            },
          ),
        {
          name: '--spacing',
          value: '0.25rem',
        },
      ]);

      return wrapCssVariableDeclarationsWithCssSelector(cssVariables, '@theme inline');
    });

    const components: string = await logger.asyncTask('components', async () => {
      let content: string = '';

      for await (const entry of glob(`${componentsSourceDirectory}/**/*.tailwind.css`)) {
        content += await readTextFile(entry);
      }

      return content;
    });

    await Promise.all([
      writeTextFileSafe(
        `${outputDirectory}/web/tailwind.css`,
        dedent`
          ${CSS_AUTO_GENERATED_FILE_HEADER}
          ${theme}
          ${components}
        `,
      ),
    ]);
  });
}
