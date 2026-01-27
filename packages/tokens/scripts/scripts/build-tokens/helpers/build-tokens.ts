import { writeFileSafe } from '../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { ValueOrCurlyReference } from '../../../shared/dtcg/design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import { isDesignToken } from '../../../shared/dtcg/design-token/token/is-design-token.ts';
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
import type { FigmaDesignTokensTree } from '../../../shared/dtcg/resolver/to/figma/figma/tree/figma-design-tokens-tree.ts';
import { designTokensCollectionTokenToFigmaDesignTokensTree } from '../../../shared/dtcg/resolver/to/figma/token/design-tokens-collection-token-to-figma-design-tokens-tree.ts';
import type { GenericDesignTokensCollectionToken } from '../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import {
  mergeFigmaDesignTokensTreesAsModes,
  type NamedFigmaTokens,
} from '../../../shared/figma/merge/merge-figma-design-tokens-trees-as-modes.ts';
import { DESIGN_TOKEN_THEMES } from './constants/design-token-themes.ts';
import {
  DESIGN_TOKEN_TIERS,
  T1_DIRNAME,
  T2_DIRNAME,
  T3_DIRNAME,
} from './constants/design-token-tiers.ts';
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

export function buildTokens({
  sourceDirectory,
  outputDirectory,
  logger,
}: BuildTokensOptions): Promise<void> {
  return logger.asyncTask('build-tokens', async (logger: Logger): Promise<void> => {
    sourceDirectory = removeTrailingSlash(sourceDirectory);
    outputDirectory = removeTrailingSlash(outputDirectory);

    const baseCollection: DesignTokensCollection = await new DesignTokensCollection().fromFiles(
      DESIGN_TOKEN_TIERS.map(
        (tier: string): string => `${sourceDirectory}/${tier}/**/*.tokens.json`,
      ),
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
              `${outputDirectory}/web/css/themes/${theme}.theme.css`,
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
              `${outputDirectory}/web/css/themes/${theme}.theme.attr.css`,
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
              `${outputDirectory}/web/css/variants/${variant}.variant.css`,
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
              `${outputDirectory}/web/css/variants/${variant}.variant.attr.css`,
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
            `${outputDirectory}/web/tailwind.css`,
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
      const t3FigmaCollectionName: string = 'Themes';

      // 1) group tokens by tiers (primitive, semantic, component)
      const figmaCollection: DesignTokensCollection = baseCollection.clone();

      for (const token of tokens) {
        const tier: string | undefined = DESIGN_TOKEN_TIERS.find((tier: string): boolean => {
          return token.files.some((path: string): boolean => path.includes(tier));
        });

        if (tier === undefined) {
          throw new Error(
            `Token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} does not belong to a tier.`,
          );
        }

        figmaCollection.rename(token.name, [
          tier === T3_DIRNAME ? t3FigmaCollectionName : tier,
          ...token.name,
        ]);
      }

      const figmaCollectionTokens: readonly GenericDesignTokensCollectionToken[] =
        figmaCollection.getMergedTokens();

      // 2) create figma tokens
      const figmaTokens: FigmaDesignTokensGroup = {};

      const insertFigmaDesignTokensTree = (
        name: ArrayDesignTokenName,
        value: FigmaDesignTokensTree,
      ): void => {
        if (name.length === 0) {
          throw new Error('Cannot set property on root');
        }

        let node: any = figmaTokens;

        for (let i: number = 0; i < name.length; i++) {
          const segment: PropertyKey = name[i];

          if (isDesignToken(node)) {
            const $root: any = { ...node };
            for (const key of Object.keys(node)) {
              Reflect.deleteProperty(node, key);
            }
            Reflect.set(node, 'root', $root);
          }

          if (i === name.length - 1) {
            Reflect.set(node, segment, value);
          } else {
            if (Reflect.has(node, segment)) {
              node = Reflect.get(node, segment);
            } else {
              const next: any = {};
              Reflect.set(node, segment, next);
              node = next;
            }
          }
        }
      };

      // 2.1) t1-primitive -> t1 tokens contain all the values, thus, they don't have alternative modes.
      for (const token of figmaCollectionTokens) {
        if (token.name.at(0) === T1_DIRNAME) {
          insertFigmaDesignTokensTree(
            token.name,
            designTokensCollectionTokenToFigmaDesignTokensTree(
              token,
              figmaCollection.resolve(token),
            ),
          );
        }
      }

      // 2.2) t2-semantic -> t2 tokens contain themes; thus, they need to be merged (as modes).
      Object.assign(
        figmaTokens,
        mergeFigmaDesignTokensTreesAsModes(
          DESIGN_TOKEN_THEMES.map((theme: string): NamedFigmaTokens => {
            const figmaTokens: FigmaDesignTokensGroup = {};

            for (const token of figmaCollectionTokens) {
              if (token.name.at(0) === T2_DIRNAME) {
                insertFigmaDesignTokensTree(
                  token.name,
                  designTokensCollectionTokenToFigmaDesignTokensTree(
                    {
                      ...token,
                      value: getTokenValueByTheme(token, theme),
                    },
                    figmaCollection.resolve(token),
                  ),
                );
              }
            }

            return [theme, figmaTokens];
          }),
        ),
      );

      // 2.3) t3-component -> t3 tokens contain variants; thus, they need to be merged (as modes).
      Object.assign(
        figmaTokens,
        mergeFigmaDesignTokensTreesAsModes(
          DESIGN_TOKEN_VARIANTS.map((variant: string): NamedFigmaTokens => {
            const figmaTokens: FigmaDesignTokensGroup = {};

            for (const token of figmaCollectionTokens) {
              if (token.name.at(0) === t3FigmaCollectionName) {
                insertFigmaDesignTokensTree(
                  token.name,
                  designTokensCollectionTokenToFigmaDesignTokensTree(
                    {
                      ...token,
                      value: getTokenValueByVariant(token, variant) ?? token.value,
                    },
                    figmaCollection.resolve(token),
                  ),
                );
              }
            }

            return [variant, figmaTokens];
          }),
        ),
      );

      // 3) write figma tokens to file
      await writeFileSafe(
        `${outputDirectory}/figma.tokens.json`,
        JSON.stringify(figmaTokens, null, 2),
      );
    });
  });
}
