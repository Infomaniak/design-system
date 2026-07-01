import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { toCamelCase } from '../../../../../../../../../scripts/helpers/misc/case/to-camel-case/to-camel-case.ts';
import { toPascalCase } from '../../../../../../../../../scripts/helpers/misc/case/to-pascal-case/to-pascal-case.ts';
import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type {
  DesignTokenContexts,
  DesignTokenModifiers,
} from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { KotlinVariableDeclaration } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/kotlin-variable-declaration.ts';
import { kotlinVariableDeclarationsToFoundationKotlinTokenFileContent } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/foundation-kotlin-tokens-file/kotlin-variable-declarations-to-foundation-kotlin-token-file-content.ts';
import {
  kotlinVariableDeclarationsToInternalObjectKotlinTokenFileContent,
  type KotlinVariableDeclarationsToInternalObjectKotlinTokenFileContentOptions,
} from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/internal-object-kotlin-tokens-file/kotlin-variable-declarations-to-internal-object-kotlin-token-file-content.ts';
import { kotlinVariableDeclarationsToPrimitiveKotlinTokenFileContent } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/primitive-kotlin-tokens-file/kotlin-variable-declarations-to-primitive-kotlin-token-file-content.ts';
import {
  kotlinVariableDeclarationsToThemeInstanceKotlinTokenFileContent,
  type KotlinVariableDeclarationsToThemeInstanceKotlinTokenFileContentOptions,
} from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/theme-instance-kotlin-tokens-file/kotlin-variable-declarations-to-theme-instance-kotlin-token-file-content.ts';
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
import { sortDesignTokensCollectionTokensByDependencies } from '../../../../../../shared/dtcg/resolver/token/operations/sort/by-dependencies/sort-design-tokens-collection-tokens-by-dependencies.ts';
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

    const kotlinTokensCollectionOptions: DesignTokensCollectionTokenToKotlinVariableDeclarationOptions =
      {
        generateKotlinVariableName: createKotlinVariableNameGenerator({
          textCase: 'pascal',
        }),
      };

    const designSystemPackageName: string = 'com.infomaniak.designsystem';
    const primitiveTokensPackageName: string = `${designSystemPackageName}.primitivetokens`;
    const foundationTokensPackageName: string = `${designSystemPackageName}.core.tokens`;

    await logger.asyncTask('PrimitiveTokens', async (): Promise<void> => {
      const grouped: GroupedTokensByPrefix = groupTokensByPrefixes(
        baseCollection.tokens().filter(filterT1Tokens),
      );

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
                  kotlinTokensCollectionOptions,
                );
              },
            ),
          }),
        );
      }
    });

    await logger.asyncTask('Foundation', async (logger: Logger): Promise<void> => {
      const foundationCoreDirectory: string = `${kotlinOutputDirectory}/Foundation/src/main/kotlin/com/infomaniak/designsystem/core`;

      await logger.asyncTask('tokens', async (): Promise<void> => {
        const grouped: GroupedTokensByPrefix = groupTokensByPrefixes(
          baseCollection.tokens().filter(filterT2T3Tokens),
        );

        for (const [prefix, tokens] of Object.entries(grouped)) {
          const fileName: string = `${toPascalCase(prefix)}Tokens`;

          await writeTextFileSafe(
            `${foundationCoreDirectory}/tokens/${fileName}.kt`,
            kotlinVariableDeclarationsToFoundationKotlinTokenFileContent({
              packageName: foundationTokensPackageName,
              className: fileName,
              declarations: tokens.map(
                (token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
                  return removePrefixFromKotlinVariableDeclaration(
                    resolveDesignTokensCollectionTokenToKotlinVariableDeclaration(
                      baseCollection,
                      token,
                      kotlinTokensCollectionOptions,
                    ),
                    prefix,
                  );
                },
              ),
            }),
          );
        }
      });

      await logger.asyncTask('default-values', async (): Promise<void> => {
        await createKotlinPublicClassInstancesWithInternalFiles({
          outputDirectory: `${foundationCoreDirectory}/defaultvalues`,
          packageName: `${designSystemPackageName}.core.defaultvalues`,
          prefix: 'Default',
          collection: baseCollection,
          primitiveTokensPackageName,
          foundationTokensPackageName,
          toDeclarationsOptions: kotlinTokensCollectionOptions,
        });
      });
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

        await logger.asyncTask(`${theme}/${product}`, async (): Promise<void> => {
          const packageRootDirectory: string = `${kotlinOutputDirectory}/Theme${toPascalCase(product)}`;
          const packageName: string = `${designSystemPackageName}.${product}`;

          await createKotlinGradleFile({
            outputDirectory: packageRootDirectory,
            designSystemPackageName,
            packageName,
          });

          await createKotlinPublicClassInstancesWithInternalFiles({
            outputDirectory: `${packageRootDirectory}/src/main/kotlin/com/infomaniak/designsystem/${product}`,
            packageName,
            prefix: `${toPascalCase(product)}${toPascalCase(theme)}`,
            collection: entry.collection,
            primitiveTokensPackageName,
            foundationTokensPackageName,
            toDeclarationsOptions: kotlinTokensCollectionOptions,
          });
        });
      }
    });
  });
}

/* INTERNAL */

interface CreateKotlinInternalObjectFileOptions extends Omit<
  KotlinVariableDeclarationsToInternalObjectKotlinTokenFileContentOptions,
  'declarations'
> {
  readonly outputDirectory: string;
  readonly collection: DesignTokensCollection;
  readonly toDeclarationsOptions: DesignTokensCollectionTokenToKotlinVariableDeclarationOptions;
}

function createKotlinInternalObjectFile({
  outputDirectory,
  collection,
  objectName,
  toDeclarationsOptions,
  ...options
}: CreateKotlinInternalObjectFileOptions): Promise<void> {
  outputDirectory = removeTrailingSlash(outputDirectory);

  return writeTextFileSafe(
    `${outputDirectory}/${objectName}.kt`,
    kotlinVariableDeclarationsToInternalObjectKotlinTokenFileContent({
      ...options,
      objectName,
      declarations: sortDesignTokensCollectionTokensByDependencies(
        collection,
        collection.tokens().filter(filterT2T3Tokens),
      ).map((token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
        return resolveDesignTokensCollectionTokenToKotlinVariableDeclaration(
          collection,
          token,
          toDeclarationsOptions,
        );
      }),
    }),
  );
}

/*--*/

interface CreateKotlinPublicClassInstancesFilesOptions extends Omit<
  KotlinVariableDeclarationsToThemeInstanceKotlinTokenFileContentOptions,
  'internalTokensPackageName' | 'instanceName' | 'className' | 'declarations'
> {
  readonly outputDirectory: string;
  readonly collection: DesignTokensCollection;
  readonly prefix: string;
  readonly internalTokensPackageName: string;
  readonly internalTokensObjectName: string;
  readonly toDeclarationsOptions: DesignTokensCollectionTokenToKotlinVariableDeclarationOptions;
}

async function createKotlinPublicClassInstancesFiles({
  outputDirectory,
  collection,
  prefix,
  internalTokensPackageName,
  internalTokensObjectName,
  toDeclarationsOptions,
  ...options
}: CreateKotlinPublicClassInstancesFilesOptions): Promise<void> {
  outputDirectory = removeTrailingSlash(outputDirectory);

  const grouped: GroupedTokensByPrefix = groupTokensByPrefixes(
    collection.tokens().filter(filterT2T3Tokens),
  );

  for (const [tokenPrefix, tokens] of Object.entries(grouped)) {
    const className: string = `${toPascalCase(tokenPrefix)}Tokens`;
    const instanceName: string = `${prefix}${className}`;

    await writeTextFileSafe(
      `${outputDirectory}/${instanceName}.kt`,
      kotlinVariableDeclarationsToThemeInstanceKotlinTokenFileContent({
        ...options,
        internalTokensPackageName: `${internalTokensPackageName}.${internalTokensObjectName}`,
        instanceName,
        className,
        declarations: tokens.map(
          (token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
            return removePrefixFromKotlinVariableDeclaration(
              updateKotlinVariableDeclarationValue(
                resolveDesignTokensCollectionTokenToKotlinVariableDeclaration(
                  collection,
                  token,
                  toDeclarationsOptions,
                ),
                (declaration: KotlinVariableDeclaration): string => {
                  return `${internalTokensObjectName}.${declaration.name}`;
                },
              ),
              tokenPrefix,
            );
          },
        ),
      }),
    );
  }
}

/*--*/

interface CreateKotlinPublicClassInstancesWithInternalFilesOptions {
  readonly outputDirectory: string;
  readonly packageName: string;
  readonly prefix: string;
  readonly collection: DesignTokensCollection;
  readonly primitiveTokensPackageName: string;
  readonly foundationTokensPackageName: string;
  readonly toDeclarationsOptions: DesignTokensCollectionTokenToKotlinVariableDeclarationOptions;
}

async function createKotlinPublicClassInstancesWithInternalFiles({
  outputDirectory,
  packageName,
  prefix,
  collection,
  primitiveTokensPackageName,
  foundationTokensPackageName,
  toDeclarationsOptions,
}: CreateKotlinPublicClassInstancesWithInternalFilesOptions): Promise<void> {
  outputDirectory = removeTrailingSlash(outputDirectory);

  const internalTokensPackageName: string = `${packageName}.internal`;
  const internalTokensObjectName: string = `Intermediate${prefix}`;

  await createKotlinInternalObjectFile({
    outputDirectory: `${outputDirectory}/internal`,
    collection,
    toDeclarationsOptions,
    packageName: internalTokensPackageName,
    primitiveTokensPackageName,
    objectName: internalTokensObjectName,
  });

  await createKotlinPublicClassInstancesFiles({
    outputDirectory,
    collection,
    prefix,
    internalTokensPackageName,
    internalTokensObjectName,
    toDeclarationsOptions,
    packageName,
    foundationTokensPackageName,
  });
}

/*--*/

interface CreateKotlinGradleFileOptions {
  readonly outputDirectory: string;
  readonly designSystemPackageName: string;
  readonly packageName: string;
}

async function createKotlinGradleFile({
  outputDirectory,
  designSystemPackageName,
  packageName,
}: CreateKotlinGradleFileOptions): Promise<void> {
  outputDirectory = removeTrailingSlash(outputDirectory);

  await writeTextFileSafe(
    `${outputDirectory}/build.gradle.kts`,
    dedent`
      plugins {
          id("${designSystemPackageName}.convention.theme")
      }
      
      android {
          namespace = "${packageName}"
      }
    `,
  );
}

/*--*/

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

function updateKotlinVariableDeclarationValue(
  declaration: KotlinVariableDeclaration,
  update: (reference: KotlinVariableDeclaration) => string,
): KotlinVariableDeclaration {
  return {
    ...declaration,
    value: {
      ...declaration.value,
      value: update(declaration),
    },
  };
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
  return (
    token.files.some((path: string): boolean => {
      return path.includes(T1_DIRECTORY_NAME);
    }) && !isExcludedToken(token)
  );
}

function filterT2T3Tokens(token: GenericDesignTokensCollectionToken): boolean {
  return (
    token.files.some((path: string): boolean => {
      return path.includes(T2_DIRECTORY_NAME) || path.includes(T3_DIRECTORY_NAME);
    }) && !isExcludedToken(token)
  );
}

//  TODO: Kotlin does not support more than 248 properties, thus, we skip the colors -> remove in the future
function isExcludedToken(token: GenericDesignTokensCollectionToken): boolean {
  return token.name.at(0) === 'color';
}

/*--*/

type GroupedTokensByPrefix = Record<string, GenericDesignTokensCollectionToken[]>;

function groupTokensByPrefixes(
  tokens: Iterable<GenericDesignTokensCollectionToken>,
): GroupedTokensByPrefix {
  return Object.groupBy(tokens, (token: GenericDesignTokensCollectionToken): string => {
    return token.name[0];
  }) as GroupedTokensByPrefix;
}

/*--*/

interface ModifierAndContext {
  readonly modifier: string;
  readonly context: string;
}

interface ComposedModifiersEntry {
  readonly path: readonly ModifierAndContext[];
  readonly collection: DesignTokensCollection;
}

/**
 * Composes modifiers by traversing through all possible combinations of modifiers and their associated contexts.
 * It returns a Generator that yields objects representing the composed modifiers and their corresponding collections.
 *
 * @param {readonly [string, DesignTokenContexts][]} modifiers An array of tuples, where each tuple
 * consists of a modifier name and its associated contexts mapping.
 * @param {number} [modifierIndex=0] The current index of the modifier being processed in the `modifiers` array.
 * @param {ComposedModifiersEntry} [composedEntry] An optional parameter representing the current state
 * of the composed modifier entry being built.
 * @returns {Generator<ComposedModifiersEntry>} A generator yielding composed modifiers entries, where each entry
 * contains the path of modifiers and contexts, along with a corresponding collection of tokens.
 */
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
