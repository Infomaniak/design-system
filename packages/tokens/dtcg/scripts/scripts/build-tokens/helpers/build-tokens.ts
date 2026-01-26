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
import type { FigmaDesignTokensGroup } from '../../../shared/dtcg/resolver/to/figma/figma/group/figma-design-tokens-group.ts';
import type { GenericDesignTokensCollectionToken } from '../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { DESIGN_TOKEN_THEMES } from './constants/design-token-themes.ts';
import { DESIGN_TOKEN_TIERS } from './constants/design-token-tiers.ts';
import { DESIGN_TOKEN_VARIANTS } from './constants/design-token-variants.ts';

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

export async function buildTokens({
  sourceDirectory,
  outputDirectory,
  logger,
}: BuildTokensOptions): Promise<void> {
  sourceDirectory = removeTrailingSlash(sourceDirectory);
  outputDirectory = removeTrailingSlash(outputDirectory);

  const baseCollection: DesignTokensCollection = await new DesignTokensCollection().fromFiles(
    DESIGN_TOKEN_TIERS.map((tier: string): string => `${sourceDirectory}/${tier}/**/*.tokens.json`),
  );

  const tokens: readonly GenericDesignTokensCollectionToken[] = baseCollection.getMergedTokens();

  const getTokenValueByTheme = (
    token: GenericDesignTokensCollectionToken,
    theme: string,
  ): ValueOrCurlyReference<unknown> => {
    return (token.extensions?.['theme'] as any)?.[theme] ?? token.value;
  };

  const getTokenValueByVariant = (
    token: GenericDesignTokensCollectionToken,
    variant: string,
  ): ValueOrCurlyReference<unknown> | undefined => {
    return (token.extensions?.['variant'] as any)?.[variant];
  };

  // CSS
  await logger.asyncTask('css', async (logger: Logger): Promise<void> => {
    const cssOptions: DesignTokensCollectionTokenToCssVariableDeclarationOptions = {
      generateCssVariableName: createCssVariableNameGenerator('ikds'),
    };

    for (const theme of DESIGN_TOKEN_THEMES) {
      await logger.asyncTask(`theme: ${theme}`, async (): Promise<void> => {
        const cssVariables: string = cssVariableDeclarationsToString(
          tokens.map((token: GenericDesignTokensCollectionToken): CssVariableDeclaration => {
            return designTokensCollectionTokenToCssVariableDeclaration(
              {
                ...token,
                type: baseCollection.resolve(token).type,
                value: getTokenValueByTheme(token, theme),
              },
              cssOptions,
            );
          }),
        );

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
    }

    for (const variant of DESIGN_TOKEN_VARIANTS) {
      await logger.asyncTask(`variant: ${variant}`, async (): Promise<void> => {
        const cssVariables: string = cssVariableDeclarationsToString(
          tokens
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
                        type: baseCollection.resolve(token).type,
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
    }

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

  // FIGMA
  await logger.asyncTask('figma', async (): Promise<void> => {
    const figmaTokens: FigmaDesignTokensGroup = {};
  });
}
