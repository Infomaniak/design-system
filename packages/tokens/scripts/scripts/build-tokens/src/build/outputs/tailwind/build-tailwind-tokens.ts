import { glob } from 'node:fs/promises';
import { basename } from 'node:path';
import { readTextFile } from '../../../../../../../../../scripts/helpers/file/read-text-file.ts';
import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { block } from '../../../../../../../../../scripts/helpers/misc/block.ts';
import { toSnakeCase } from '../../../../../../../../../scripts/helpers/misc/case/to-snake-case/to-snake-case.ts';
import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { indent } from '../../../../../../../../../scripts/helpers/misc/string/indent/indent.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { SegmentsReference } from '../../../../../../shared/dtcg/design-token/reference/types/segments/segments-reference.ts';
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
*/`;

// NOTE: some numeric utilities are hardcoded in Tailwind's engine: bare values are
// accepted without any theme guard and editors always suggest them, so neither
// namespace resets (`--opacity-*: initial`) nor same-name `@utility` overrides
// (built-ins take precedence) can remove them.
// `@source not inline()` blocks the plain utilities' generation, while named tokens
// (`opacity-subtle`, `border-xs`, ...) and arbitrary values (`opacity-[0.33]`) keep
// working. Variant-prefixed forms (`hover:opacity-50`) still compile: the engine only
// matches the expanded candidate strings.
const NUMERIC_VALUE_GUARDS: readonly string[] = [
  // bare numeric opacity suggested by the engine (`opacity-0`..`opacity-100`, step 5)
  '@source not inline("opacity-{0..100..5}");',
  // bare numeric border widths suggested by the engine, every side
  // (`border-0`, `border-t-2`, `border-r-4`, ...)
  '@source not inline("border-{,x-,y-,t-,r-,b-,l-,s-,e-}{0,2,4,8}");',
];

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

      // list the state tokens
      const stateTokens: readonly GenericDesignTokensCollectionToken[] = Array.from(
        baseCollection.tokens().filter((token: GenericDesignTokensCollectionToken): boolean => {
          return token.name.join('.').startsWith('color.state');
        }),
      );

      const themeVariableDeclarations: readonly CssVariableDeclaration[] = [
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
          // 'spacing',
          'radius',
          'border-width',
          // 'shadow',
          // 'inset-shadow',
          // 'drop-shadow',
          'blur',
          // 'perspective',
          // 'aspect',
          // 'ease',
          // 'animate',
          'opacity',
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
        // reset all spacings
        {
          name: '--spacing',
          value: 'initial',
        },
        ...baseCollection
          .tokens()
          .flatMap(
            (token: GenericDesignTokensCollectionToken): readonly CssVariableDeclaration[] => {
              if (isTailwindToken(token)) {
                const tokenName: string = token.name.join('.');

                if (tokenName.startsWith('color')) {
                  // --color-*

                  return [
                    generateTailwindToken(
                      token,
                      DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION(
                        block((): SegmentsReference => {
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
                    ...block((): readonly CssVariableDeclaration[] => {
                      // generate the state tokens applied to the other color tokens
                      if (
                        tokenName.startsWith('color.background') ||
                        tokenName.startsWith('color.transparent')
                      ) {
                        return stateTokens.map(
                          (
                            stateToken: GenericDesignTokensCollectionToken,
                          ): CssVariableDeclaration => {
                            const sourceCssVariable: string =
                              segmentsReferenceToCssVariableReference(stateToken.name, cssOptions);

                            const sourceAlphaCssVariable: string =
                              segmentsReferenceToCssVariableReference(
                                [...stateToken.name, 'a'],
                                cssOptions,
                              );

                            const destinationCssVariable: string =
                              segmentsReferenceToCssVariableReference(token.name, cssOptions);

                            const destinationAlphaCssVariable: string =
                              segmentsReferenceToCssVariableReference(
                                [...token.name, 'a'],
                                cssOptions,
                              );

                            return {
                              name: DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION([
                                'background-color',
                                ...token.name.slice(2),
                                'state',
                                ...stateToken.name.slice(2),
                              ]),
                              value: dedent`
                                color-mix(
                                  in srgb,
                                  rgb(from ${sourceCssVariable} r g b / 100%) calc(${sourceAlphaCssVariable} * 100%),
                                  rgb(from ${destinationCssVariable} r g b / 100%)
                                    calc(${destinationAlphaCssVariable} * (1 - ${sourceAlphaCssVariable}) * 100%)
                                )
                              `,
                              description: `State effect ${JSON.stringify(sourceCssVariable)} applied to ${JSON.stringify(destinationCssVariable)}${stateToken.description === undefined ? '' : `: ${stateToken.description}`}`,
                              deprecated: token.deprecated || stateToken.deprecated,
                            };
                          },
                        );
                      }

                      return [];
                    }),
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
                } else if (tokenName.startsWith('icon.size')) {
                  // --text-* -> --text-icon-*
                  return [
                    generateTailwindToken(
                      token,
                      RAW_GENERATE_CSS_VARIABLE_NAME_FUNCTION([
                        'text',
                        'icon',
                        ...token.name.slice(2),
                      ]),
                    ),
                  ];
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
                } else if (tokenName.startsWith('border.') && tokenName.endsWith('.width')) {
                  // --border-width-* (t2 `border.{scale}.width` -> `--border-width-{scale}`)
                  return [
                    generateTailwindToken(
                      token,
                      RAW_GENERATE_CSS_VARIABLE_NAME_FUNCTION([
                        'border',
                        'width',
                        ...token.name.slice(1, -1),
                      ]),
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
                } else if (tokenName.startsWith('opacity')) {
                  // --opacity-*
                  return [
                    generateTailwindToken(
                      token,
                      RAW_GENERATE_CSS_VARIABLE_NAME_FUNCTION(['opacity', ...token.name.slice(1)]),
                    ),
                  ];
                } else if (tokenName.startsWith('spacing')) {
                  // --spacing-*
                  return [
                    generateTailwindToken(
                      token,
                      RAW_GENERATE_CSS_VARIABLE_NAME_FUNCTION(['spacing', ...token.name.slice(1)]),
                    ),
                  ];
                }
              }

              return [];
            },
          ),
      ];

      // NOTE: theme modifiers (dark/light) only swap `--esds-color-*`, so spacing, radius
      // and border width values are literals or references to theme-invariant variables.
      // They must NOT be inlined: `@theme inline` substitutes values in utilities and drops
      // the variables from the Theme object, hiding them from value-resolution tooling.
      const themeInvariantVariables: string = cssVariableDeclarationsToString(
        themeVariableDeclarations.filter((declaration: CssVariableDeclaration): boolean => {
          return isThemeInvariant(declaration);
        }),
      );

      const swappableVariables: string = cssVariableDeclarationsToString(
        themeVariableDeclarations.filter((declaration: CssVariableDeclaration): boolean => {
          return !isThemeInvariant(declaration);
        }),
      );

      return [
        wrapCssVariableDeclarationsWithCssSelector(themeInvariantVariables, '@theme'),
        wrapCssVariableDeclarationsWithCssSelector(swappableVariables, '@theme inline'),
      ].join('\n');
    });

    const components: string = await logger.asyncTask('components', async () => {
      let content: string = '';

      for await (const entry of glob(`${componentsSourceDirectory}/**/*.tailwind.css`)) {
        const componentName: string = basename(entry, '.tailwind.css');
        if (content !== '') {
          content += '\n';
        }
        content += dedent`
          /*
            ${toSnakeCase(componentName).toUpperCase()} 
          */
          
          ${await readTextFile(entry)}
        `;
      }

      return content;
    });

    await Promise.all([
      writeTextFileSafe(
        `${outputDirectory}/web/tailwind.css`,
        dedent`
          ${CSS_AUTO_GENERATED_FILE_HEADER}
          
          /*
            TOKENS
          */

          ${theme}
          
          /*
            NUMERIC VALUE GUARDS
          */
          
          ${NUMERIC_VALUE_GUARDS.join('\n')}
          
          /*
            COMPONENTS
          */
          
          ${components}
        `,
      ),
    ]);
  });
}

/* INTERNAL */

function isTailwindToken(token: GenericDesignTokensCollectionToken): boolean {
  return (
    token.files.every(
      (file: string): boolean => !file.includes(T1_DIRECTORY_NAME),
    ) /* not a T1 token */ || token.name.join('.').startsWith('color.transparent')
  );
}

function isThemeInvariant(declaration: CssVariableDeclaration): boolean {
  return (
    declaration.name.startsWith('--spacing') ||
    declaration.name.startsWith('--radius') ||
    declaration.name.startsWith('--border-width')
  );
}
