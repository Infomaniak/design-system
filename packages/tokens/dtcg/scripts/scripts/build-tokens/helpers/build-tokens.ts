import { writeFileSafe } from '../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { ValueOrCurlyReference } from '../../../shared/dtcg/design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import { DesignTokensCollection } from '../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { CssVariableDeclaration } from '../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import { cssVariableDeclarationsToString } from '../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/css-variable-declarations-to-string.ts';
import { wrapCssVariableDeclarationsWithCssSelector } from '../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/wrap-css-variable-declarations-with-css-selector.ts';
import { segmentsReferenceToCssVariableReference } from '../../../shared/dtcg/resolver/to/css/reference/segments-reference-to-css-variable-reference.ts';
import {
  designTokensCollectionTokenToCssVariableDeclaration,
  type DesignTokensCollectionTokenToCssVariableDeclarationOptions,
} from '../../../shared/dtcg/resolver/to/css/token/design-tokens-collection-token-to-css-variable-declaration.ts';
import { createCssVariableNameGenerator } from '../../../shared/dtcg/resolver/to/css/token/name/create-css-variable-name-generator.ts';
import { DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION } from '../../../shared/dtcg/resolver/to/css/token/name/default-generate-css-variable-name-function.ts';
import type { GenericDesignTokensCollectionToken } from '../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { DESIGN_TOKEN_TIERS } from './design-token-tiers.ts';

export interface BuildTokensOptions {
  readonly sourceDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

const AUTO_GENERATED_COMMENT = 'Do not edit directly, this file was auto-generated.';

const THEME_FILE_HEADER = `/*
  ${AUTO_GENERATED_COMMENT}
*/

`;

const VARIANT_FILE_HEADER = `/*
  ${AUTO_GENERATED_COMMENT}
  This is a "variant" file: it requires a "base" theme to work properly.
*/

`;

export function buildTokens({
  sourceDirectory,
  outputDirectory,
  logger,
}: BuildTokensOptions): Promise<void> {
  return logger.asyncTask('tokens', async (logger: Logger): Promise<void> => {
    sourceDirectory = removeTrailingSlash(sourceDirectory);
    outputDirectory = removeTrailingSlash(outputDirectory);

    const baseCollection: DesignTokensCollection = await new DesignTokensCollection().fromFiles(
      DESIGN_TOKEN_TIERS.map(
        (tier: string): string => `${sourceDirectory}/base/${tier}/**/*.tokens.json`,
      ),
    );

    const tokens: readonly GenericDesignTokensCollectionToken[] = baseCollection.getMergedTokens();

    const cssOptions: DesignTokensCollectionTokenToCssVariableDeclarationOptions = {
      generateCssVariableName: createCssVariableNameGenerator('ikds'),
    };

    // 1) generate themes
    await logger.asyncTask('theme', async (logger: Logger): Promise<void> => {
      const themes: readonly string[] = ['light', 'dark'];

      for (const theme of themes) {
        await logger.asyncTask(theme, async (logger: Logger): Promise<void> => {
          // CSS
          const cssVariableDeclarations: CssVariableDeclaration[] = [];

          for (const token of tokens) {
            const value: ValueOrCurlyReference<unknown> =
              (token.extensions?.['theme'] as any)?.[theme] ?? token.value;

            // CSS
            cssVariableDeclarations.push(
              designTokensCollectionTokenToCssVariableDeclaration(
                {
                  ...token,
                  type: baseCollection.resolve(token).type,
                  value,
                },
                cssOptions,
              ),
            );
          }

          // CSS
          await logger.asyncTask('css', async (): Promise<void> => {
            const cssVariables: string = cssVariableDeclarationsToString(cssVariableDeclarations);

            await Promise.all([
              writeFileSafe(
                `${outputDirectory}/css/themes/${theme}.theme.css`,
                wrapCssVariableDeclarationsWithCssSelector(
                  cssVariables,
                  ':root,\n:host',
                  THEME_FILE_HEADER,
                ),
                {
                  encoding: 'utf-8',
                },
              ),
              writeFileSafe(
                `${outputDirectory}/css/themes/${theme}.theme.attr.css`,
                wrapCssVariableDeclarationsWithCssSelector(
                  cssVariables,
                  `[data-theme="${theme}"]`,
                  THEME_FILE_HEADER,
                ),
                {
                  encoding: 'utf-8',
                },
              ),
            ]);
          });
        });
      }
    });

    // 2) generate variants
    await logger.asyncTask('variant', async (logger: Logger): Promise<void> => {
      const variants: readonly string[] = ['mail'];

      for (const variant of variants) {
        await logger.asyncTask(variant, async (logger: Logger): Promise<void> => {
          const cssVariableDeclarations: CssVariableDeclaration[] = [];

          for (const token of tokens) {
            const value: ValueOrCurlyReference<unknown> | undefined = (
              token.extensions?.['variant'] as any
            )?.[variant];

            if (value === undefined) {
              continue;
            }

            // CSS
            cssVariableDeclarations.push(
              designTokensCollectionTokenToCssVariableDeclaration(
                {
                  ...token,
                  type: baseCollection.resolve(token).type,
                  value,
                },
                cssOptions,
              ),
            );
          }

          // CSS
          await logger.asyncTask('css', async (): Promise<void> => {
            const cssVariables: string = cssVariableDeclarationsToString(cssVariableDeclarations);

            await Promise.all([
              writeFileSafe(
                `${outputDirectory}/css/variants/${variant}.variant.css`,
                wrapCssVariableDeclarationsWithCssSelector(
                  cssVariables,
                  ':root,\n:host',
                  VARIANT_FILE_HEADER,
                ),
                {
                  encoding: 'utf-8',
                },
              ),
              writeFileSafe(
                `${outputDirectory}/css/variants/${variant}.variant.attr.css`,
                wrapCssVariableDeclarationsWithCssSelector(
                  cssVariables,
                  `[data-variant~="${variant}"]`,
                  VARIANT_FILE_HEADER,
                ),
                {
                  encoding: 'utf-8',
                },
              ),
            ]);
          });
        });
      }
    });

    // TAILWIND 4+ => https://tailwindcss.com/docs/theme#theme-variable-namespaces
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
        ...tokens.map((token: GenericDesignTokensCollectionToken): CssVariableDeclaration => {
          return {
            name: DEFAULT_GENERATE_CSS_VARIABLE_NAME_FUNCTION(token.name),
            value: segmentsReferenceToCssVariableReference(token.name, cssOptions),
            description: token.description,
            deprecated: token.deprecated,
          };
        }),
      ]);

      await Promise.all([
        writeFileSafe(
          `${outputDirectory}/tailwind/tailwind.css`,
          wrapCssVariableDeclarationsWithCssSelector(
            cssVariables,
            '@theme inline',
            THEME_FILE_HEADER,
          ),
          {
            encoding: 'utf-8',
          },
        ),
      ]);
    });
  });
}
