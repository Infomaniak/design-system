import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { pascalCaseToCamelCase } from '../../../../../../../../../scripts/helpers/misc/case/pascal-case-to-camel-case/pascal-case-to-camel-case.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { KotlinVariableDeclaration } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/kotlin-variable-declaration.ts';
import { kotlinVariableDeclarationsToDataClassKotlinTokenFileContent } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/data-class-kotlin-tokens-file/kotlin-variable-declarations-to-data-class-kotlin-token-file-content.ts';
import { kotlinVariableDeclarationsToRawKotlinTokenFileContent } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/raw-kotlin-tokens-file/kotlin-variable-declarations-to-raw-kotlin-token-file-content.ts';
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
import { T2_DIRECTORY_NAME, T3_DIRECTORY_NAME } from '../../../constants/design-token-tiers.ts';

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

    const prefix: string = 'esds';

    const kotlinOptions: DesignTokensCollectionTokenToKotlinVariableDeclarationOptions = {
      generateKotlinVariableName: createKotlinVariableNameGenerator({
        prefix,
      }),
    };

    await writeTextFileSafe(
      `${kotlinOutputDirectory}/tokens.kt`,
      kotlinVariableDeclarationsToRawKotlinTokenFileContent(
        baseCollection
          .tokens()
          .map((token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
            return resolveDesignTokensCollectionTokenToKotlinVariableDeclaration(
              baseCollection,
              token,
              kotlinOptions,
            );
          }),
      ),
    );

    await writeTextFileSafe(
      `${kotlinOutputDirectory}/tokens.class.kt`,
      kotlinVariableDeclarationsToDataClassKotlinTokenFileContent(
        baseCollection
          .tokens()
          .filter(filterT2T3Tokens)
          .map((token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
            return removePrefixFromKotlinVariableDeclaration(
              resolveDesignTokensCollectionTokenToKotlinVariableDeclaration(
                baseCollection,
                token,
                kotlinOptions,
              ),
              prefix,
            );
          }),
      ),
    );

    // for (const [modifier, contexts] of modifiers.entries()) {
    //   for (const [context, collection] of contexts.entries()) {
    //     await writeTextFileSafe(
    //       `${kotlinOutputDirectory}/modifiers/${modifier}/${context}.kt`,
    //       modifierKotlinVariableDeclarationsToDataClassKotlinTokenFileContent(
    //         dashCaseToCamelCase(`esds-${modifier}-${context}`),
    //         collection
    //           .tokens()
    //           .filter(filterT2T3Tokens)
    //           .map((token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
    //             return removePrefixFromKotlinVariableDeclaration(
    //               resolveDesignTokensCollectionTokenToKotlinVariableDeclaration(
    //                 baseCollection,
    //                 token,
    //                 kotlinOptions,
    //               ),
    //               prefix,
    //             );
    //           }),
    //       ),
    //     );
    //   }
    // }
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

function removePrefixFromKotlinVariableDeclaration(
  declaration: KotlinVariableDeclaration,
  prefix: string,
): KotlinVariableDeclaration {
  return declaration.name.startsWith(prefix)
    ? {
        ...declaration,
        name: pascalCaseToCamelCase(declaration.name.slice(prefix.length)),
      }
    : declaration;
}

function filterT2T3Tokens(token: GenericDesignTokensCollectionToken): boolean {
  return token.files.some((path: string): boolean => {
    return path.includes(T2_DIRECTORY_NAME) || path.includes(T3_DIRECTORY_NAME);
  });
}
