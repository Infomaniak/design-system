import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { indent } from '../../../../../../../../../scripts/helpers/misc/string/indent/indent.ts';
import type { ValueOrCurlyReference } from '../../../../../../shared/dtcg/design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { SegmentsReference } from '../../../../../../shared/dtcg/design-token/reference/types/segments/segments-reference.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
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
import { DESIGN_TOKEN_THEMES } from '../../../constants/design-token-themes.ts';
import { DESIGN_TOKEN_VARIANTS } from '../../../constants/design-token-variants.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../constants/auto-generated-file-header .ts';
import { AUTO_GENERATED_VARIANT_FILE_HEADER } from '../../constants/auto-generated-variant-file-header .ts';
import { getTokenValueByTheme } from '../../helpers/get-token-value-by-theme.ts';
import { getTokenValueByVariant } from '../../helpers/get-token-value-by-variant.ts';

const CSS_THEME_FILE_HEADER = `/*
  ${indent(AUTO_GENERATED_FILE_HEADER)}
*/

`;
const CSS_VARIANT_FILE_HEADER = `/*
  ${indent(AUTO_GENERATED_VARIANT_FILE_HEADER)}
*/

`;

export interface BuildCssTokensOptions {
  readonly collection: DesignTokensCollection;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export function buildCssTokens({
  collection,
  outputDirectory,
  logger,
}: BuildCssTokensOptions): Promise<void> {
  return logger.asyncTask('css', async (logger: Logger): Promise<void> => {
    const cssOptions: DesignTokensCollectionTokenToCssVariableDeclarationOptions = {
      generateCssVariableName: createCssVariableNameGenerator('esds'),
    };

    for (const theme of DESIGN_TOKEN_THEMES) {
      await logger.asyncTask(`theme: ${theme}`, async (): Promise<void> => {
        const cssVariables: string = cssVariableDeclarationsToString(
          collection
            .tokens()
            .map((token: GenericDesignTokensCollectionToken): CssVariableDeclaration => {
              return designTokensCollectionTokenToCssVariableDeclaration(
                {
                  ...token,
                  type: collection.resolve(token).type,
                  value: getTokenValueByTheme(token, theme),
                },
                cssOptions,
              );
            }),
        );

        await Promise.all([
          writeFileSafe(
            `${outputDirectory}/web/css/themes/${theme}.theme.css`,
            wrapCssVariableDeclarationsWithCssSelector(
              cssVariables,
              ':root,\n:host',
              CSS_THEME_FILE_HEADER,
            ),
            {
              encoding: 'utf-8',
            },
          ),
          writeFileSafe(
            `${outputDirectory}/web/css/themes/${theme}.theme.attr.css`,
            wrapCssVariableDeclarationsWithCssSelector(
              cssVariables,
              `[data-theme="${theme}"]`,
              CSS_THEME_FILE_HEADER,
            ),
            {
              encoding: 'utf-8',
            },
          ),
        ]);
      });
    }

    for (const variant of DESIGN_TOKEN_VARIANTS) {
      await logger.asyncTask(`variant: ${variant}`, async (): Promise<void> => {
        const cssVariables: string = cssVariableDeclarationsToString(
          collection
            .tokens()
            .map(
              (token: GenericDesignTokensCollectionToken): CssVariableDeclaration | undefined => {
                const value: ValueOrCurlyReference<unknown> | undefined = getTokenValueByVariant(
                  token,
                  variant,
                );

                return value === undefined
                  ? undefined
                  : designTokensCollectionTokenToCssVariableDeclaration(
                      {
                        ...token,
                        type: collection.resolve(token).type,
                        value,
                      },
                      cssOptions,
                    );
              },
            )
            .filter(
              (item: CssVariableDeclaration | undefined): item is CssVariableDeclaration =>
                item !== undefined,
            ),
        );

        await Promise.all([
          writeFileSafe(
            `${outputDirectory}/web/css/variants/${variant}.variant.css`,
            wrapCssVariableDeclarationsWithCssSelector(
              cssVariables,
              ':root,\n:host',
              CSS_VARIANT_FILE_HEADER,
            ),
            {
              encoding: 'utf-8',
            },
          ),
          writeFileSafe(
            `${outputDirectory}/web/css/variants/${variant}.variant.attr.css`,
            wrapCssVariableDeclarationsWithCssSelector(
              cssVariables,
              `[data-variant~="${variant}"]`,
              CSS_VARIANT_FILE_HEADER,
            ),
            {
              encoding: 'utf-8',
            },
          ),
        ]);
      });
    }

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
        ...collection
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
            CSS_THEME_FILE_HEADER,
          ),
          {
            encoding: 'utf-8',
          },
        ),
      ]);
    });
  });
}
