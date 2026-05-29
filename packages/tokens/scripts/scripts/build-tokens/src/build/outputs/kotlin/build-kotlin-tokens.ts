import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { toCamelCase } from '../../../../../../../../../scripts/helpers/misc/case/to-camel-case/to-camel-case.ts';
import { toPascalCase } from '../../../../../../../../../scripts/helpers/misc/case/to-pascal-case/to-pascal-case.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type {
  DesignTokenContexts,
  DesignTokenModifiers,
} from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { KotlinVariableDeclaration } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/kotlin-variable-declaration.ts';
import { kotlinVariableDeclarationsToFoundationKotlinTokenFileContent } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/foundation-kotlin-tokens-file/kotlin-variable-declarations-to-foundation-kotlin-token-file-content.ts';
import { kotlinVariableDeclarationsToInternalObjectKotlinTokenFileContent } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/internal-object-kotlin-tokens-file/kotlin-variable-declarations-to-internal-object-kotlin-token-file-content.ts';
import { kotlinVariableDeclarationsToPrimitiveKotlinTokenFileContent } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/primitive-kotlin-tokens-file/kotlin-variable-declarations-to-primitive-kotlin-token-file-content.ts';
import { kotlinVariableDeclarationsToThemeInstanceKotlinTokenFileContent } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/theme-instance-kotlin-tokens-file/kotlin-variable-declarations-to-theme-instance-kotlin-token-file-content.ts';
import { isKotlinVariableDeclarationRefValue } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/value/built-in/ref/kotlin-variable-declaration-reference-value.ts';
import {
  designTokensCollectionTokenToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from '../../../../../../shared/dtcg/resolver/to/kotlin/token/design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import { createKotlinVariableNameGenerator } from '../../../../../../shared/dtcg/resolver/to/kotlin/token/name/create-kotlin-variable-name-generator.ts';
import type {
  GenericDesignTokensCollectionToken,
  GenericResolvedDesignTokensCollectionToken,
} from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import {
  T1_DIRECTORY_NAME,
  T2_DIRECTORY_NAME,
  T3_DIRECTORY_NAME,
} from '../../../constants/design-token-tiers.ts';

export interface BuildKotlinTokensOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly modifiers: DesignTokenModifiers;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export function buildKotlinTokens({
  baseCollection,
  modifiers,
  outputDirectory,
  logger,
}: BuildKotlinTokensOptions): Promise<void> {
  return logger.asyncTask('kotlin', async (): Promise<void> => {
    outputDirectory = removeTrailingSlash(outputDirectory);
    const kotlinOutputDirectory: string = `${outputDirectory}/kotlin`;

    const kotlinOptions: DesignTokensCollectionTokenToKotlinVariableDeclarationOptions = {
      generateKotlinVariableName: createKotlinVariableNameGenerator({
        textCase: 'pascal',
      }),
    };

    const designSystemPackageName: string = 'com.infomaniak.designsystem';
    const primitiveTokensPackageName: string = `${designSystemPackageName}.primitivetokens`;
    const foundationTokensPackageName: string = `${designSystemPackageName}.core.tokens`;

    await logger.asyncTask('PrimitiveTokens', async (): Promise<void> => {
      const grouped = groupTokensByPrefixes(baseCollection.tokens().filter(filterT1Tokens));

      for (const [prefix, tokens] of Object.entries(grouped)) {
        const fileName: string = `${toPascalCase(prefix)}PrimitiveTokens`;

        await writeTextFileSafe(
          `${kotlinOutputDirectory}/PrimitiveTokens/src/main/kotlin/com/infomaniak/designsystem/primitivetokens/${fileName}.kt`,
          kotlinVariableDeclarationsToPrimitiveKotlinTokenFileContent({
            packageName: primitiveTokensPackageName,
            declarations: tokens.map(
              (token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
                return resolveDesignTokensCollectionTokenToKotlinVariableDeclaration(
                  baseCollection,
                  token,
                  kotlinOptions,
                );
              },
            ),
          }),
        );
      }
    });

    await logger.asyncTask('Foundation', async (): Promise<void> => {
      const grouped: GroupedTokensByPrefix = groupTokensByPrefixes(
        baseCollection.tokens().filter(filterT2T3Tokens),
      );

      for (const [prefix, tokens] of Object.entries(grouped)) {
        const fileName: string = `${toPascalCase(prefix)}Tokens`;

        await writeTextFileSafe(
          `${kotlinOutputDirectory}/Foundation/src/main/kotlin/com/infomaniak/designsystem/core/tokens/${fileName}.kt`,
          kotlinVariableDeclarationsToFoundationKotlinTokenFileContent({
            packageName: foundationTokensPackageName,
            className: fileName,
            declarations: tokens.map(
              (token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
                return removePrefixFromKotlinVariableDeclaration(
                  resolveDesignTokensCollectionTokenToKotlinVariableDeclaration(
                    baseCollection,
                    token,
                    kotlinOptions,
                  ),
                  prefix,
                );
              },
            ),
          }),
        );
      }
    });

    await logger.asyncTask('Modifiers', async (logger: Logger): Promise<void> => {
      const androidModifiers: ReadonlySet<string> = new Set(['theme', 'product']);

      const composedModifiers = composeModifiers(
        Array.from(
          modifiers.entries().filter(([modifier]: [string, DesignTokenContexts]): boolean => {
            return androidModifiers.has(modifier);
          }),
        ),
      );

      for (const entry of composedModifiers) {
        let theme!: string;
        let product!: string;

        for (const { modifier, context } of entry.path) {
          if (modifier === 'theme') {
            theme = context;
          } else if (modifier === 'product') {
            product = context;
          } else {
            throw new Error(`Unknown modifier: ${JSON.stringify(modifier)}`);
          }
        }

        if (theme === undefined || product === undefined) {
          throw new Error('Missing theme or product');
        }

        await logger.asyncTask(`${theme}/${product}`, async (logger: Logger): Promise<void> => {
          const packageRootDirectoryName: string = `Theme${toPascalCase(product)}`;

          const internalTokensPackageName: string = `${designSystemPackageName}.${product}.internal`;
          const internalTokensFileName: string = `Intermediate${toPascalCase(theme)}`;

          await logger.asyncTask('internal', async (): Promise<void> => {
            await writeTextFileSafe(
              `${kotlinOutputDirectory}/${packageRootDirectoryName}/src/main/kotlin/com/infomaniak/designsystem/${product}/internal/${internalTokensFileName}.kt`,
              kotlinVariableDeclarationsToInternalObjectKotlinTokenFileContent({
                packageName: internalTokensPackageName,
                primitiveTokensPackageName,
                objectName: internalTokensFileName,
                declarations: entry.collection
                  .tokens()
                  .filter(filterT2T3Tokens)
                  .map((token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
                    return resolveDesignTokensCollectionTokenToKotlinVariableDeclaration(
                      baseCollection,
                      token,
                      kotlinOptions,
                    );
                  }),
              }),
            );
          });

          await logger.asyncTask('public', async (): Promise<void> => {
            const publicTokensPackageName: string = `${designSystemPackageName}.${product}`;

            const grouped: GroupedTokensByPrefix = groupTokensByPrefixes(
              entry.collection.tokens().filter(filterT2T3Tokens),
            );

            for (const [prefix, tokens] of Object.entries(grouped)) {
              const className: string = `${toPascalCase(prefix)}Tokens`;
              const fileName: string = `${toPascalCase(product)}${toPascalCase(theme)}${className}`;

              await writeTextFileSafe(
                `${kotlinOutputDirectory}/${packageRootDirectoryName}/src/main/kotlin/com/infomaniak/designsystem/${product}/${fileName}.kt`,
                kotlinVariableDeclarationsToThemeInstanceKotlinTokenFileContent({
                  packageName: publicTokensPackageName,
                  foundationTokensPackageName,
                  internalTokensPackageName: `${internalTokensPackageName}.${internalTokensFileName}`,
                  instanceName: fileName,
                  className,
                  declarations: tokens.map(
                    (token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
                      return removePrefixFromKotlinVariableDeclaration(
                        updateKotlinVariableDeclarationRefValue(
                          resolveDesignTokensCollectionTokenToKotlinVariableDeclaration(
                            baseCollection,
                            token,
                            kotlinOptions,
                          ),
                          (declaration: KotlinVariableDeclaration): string => {
                            return `${internalTokensFileName}.${declaration.name}`;
                          },
                        ),
                        prefix,
                      );
                    },
                  ),
                }),
              );
            }
          });
        });
      }
    });
  });
}

/* INTERNAL */

function resolveDesignTokensCollectionTokenToKotlinVariableDeclaration(
  collection: DesignTokensCollection,
  token: GenericDesignTokensCollectionToken,
  options: DesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
): KotlinVariableDeclaration {
  const resolved: GenericResolvedDesignTokensCollectionToken = collection.resolve(token);

  const declaration: KotlinVariableDeclaration =
    designTokensCollectionTokenToKotlinVariableDeclaration(
      {
        ...token,
        type: resolved.type,
      },
      options,
    );

  if (isKotlinVariableDeclarationRefValue(declaration.value)) {
    return {
      ...declaration,
      value: {
        type: 'ref',
        value: declaration.value.value,
        valueType: designTokensCollectionTokenToKotlinVariableDeclaration(resolved, options).value
          .type,
      },
    };
  }

  return declaration;
}

function updateKotlinVariableDeclarationRefValue(
  declaration: KotlinVariableDeclaration,
  update: (reference: KotlinVariableDeclaration) => string,
): KotlinVariableDeclaration {
  if (isKotlinVariableDeclarationRefValue(declaration.value)) {
    return {
      ...declaration,
      value: {
        ...declaration.value,
        type: 'ref',
        value: update(declaration),
      },
    };
  }

  return declaration;
}

function removePrefixFromKotlinVariableDeclaration(
  declaration: KotlinVariableDeclaration,
  prefix: string,
): KotlinVariableDeclaration {
  return declaration.name.toLowerCase().startsWith(prefix.toLowerCase())
    ? {
        ...declaration,
        name: toCamelCase(declaration.name.slice(prefix.length)),
      }
    : declaration;
}

function filterT1Tokens(token: GenericDesignTokensCollectionToken): boolean {
  return token.files.some((path: string): boolean => {
    return path.includes(T1_DIRECTORY_NAME);
  });
}

function filterT2T3Tokens(token: GenericDesignTokensCollectionToken): boolean {
  return token.files.some((path: string): boolean => {
    return path.includes(T2_DIRECTORY_NAME) || path.includes(T3_DIRECTORY_NAME);
  });
}

type GroupedTokensByPrefix = Record<string, GenericDesignTokensCollectionToken[]>;

function groupTokensByPrefixes(
  tokens: Iterable<GenericDesignTokensCollectionToken>,
): GroupedTokensByPrefix {
  return Object.groupBy(tokens, (token: GenericDesignTokensCollectionToken): string => {
    return token.name[0];
  }) as GroupedTokensByPrefix;
}

interface ModifierAndContext {
  readonly modifier: string;
  readonly context: string;
}

interface ComposedModifiersEntry {
  readonly path: readonly ModifierAndContext[];
  readonly collection: DesignTokensCollection;
}

function* composeModifiers(
  modifiers: readonly [string, DesignTokenContexts][],
  modifierIndex: number = 0,
  composedEntry?: ComposedModifiersEntry,
): Generator<ComposedModifiersEntry> {
  if (modifierIndex === modifiers.length) {
    if (composedEntry !== undefined) {
      yield composedEntry;
    }

    return;
  }

  const [modifier, contexts]: [string, DesignTokenContexts] = modifiers[modifierIndex];

  for (const [context, collection] of contexts.entries()) {
    let subEntry: ComposedModifiersEntry;

    if (composedEntry === undefined) {
      subEntry = {
        path: [
          {
            modifier,
            context,
          },
        ],
        collection: collection.clone(),
      };
    } else {
      subEntry = {
        path: [
          ...composedEntry.path,
          {
            modifier,
            context,
          },
        ],
        collection: composedEntry.collection.clone(),
      };

      const expectedPath: string = `${modifier}/${context}`;

      for (const token of collection
        .tokens()
        .filter((token: GenericDesignTokensCollectionToken): boolean => {
          return token.files.some((path: string): boolean => path.includes(expectedPath));
        })) {
        subEntry.collection.set(token);
      }
    }

    yield* composeModifiers(modifiers, modifierIndex + 1, subEntry);
  }
}
