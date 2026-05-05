import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { KotlinVariableDeclaration } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/kotlin-variable-declaration.ts';
import { kotlinVariableDeclarationsToRawKotlinTokenFileContent } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/raw-kotlin-tokens-file/kotlin-variable-declarations-to-raw-kotlin-token-file-content.ts';
import {
  designTokensCollectionTokenToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from '../../../../../../shared/dtcg/resolver/to/kotlin/token/design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import { createKotlinVariableNameGenerator } from '../../../../../../shared/dtcg/resolver/to/kotlin/token/name/create-kotlin-variable-name-generator.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
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

    const kotlinOptions: DesignTokensCollectionTokenToKotlinVariableDeclarationOptions = {
      generateKotlinVariableName: createKotlinVariableNameGenerator({
        prefix: 'esds',
      }),
    };

    const rawKotlinTokens: string = kotlinVariableDeclarationsToRawKotlinTokenFileContent(
      baseCollection
        .tokens()
        .map((token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
          return designTokensCollectionTokenToKotlinVariableDeclaration(
            {
              ...token,
              type: baseCollection.resolve(token).type,
            },
            kotlinOptions,
          );
        }),
    );

    await writeTextFileSafe(`${kotlinOutputDirectory}/tokens.kt`, rawKotlinTokens);

    for (const [modifier, contexts] of modifiers.entries()) {
      for (const [context, collection] of contexts.entries()) {
        const declarations: KotlinVariableDeclaration[] = Array.from(
          collection
            .tokens()
            .filter((token: GenericDesignTokensCollectionToken): boolean => {
              return token.files.some((path: string): boolean => {
                return path.includes(T2_DIRECTORY_NAME) || path.includes(T3_DIRECTORY_NAME);
              });
            })
            .map((token: GenericDesignTokensCollectionToken): KotlinVariableDeclaration => {
              return designTokensCollectionTokenToKotlinVariableDeclaration(
                {
                  ...token,
                  type: collection.resolve(token).type,
                },
                kotlinOptions,
              );
            }),
        );

        console.log(declarations);
      }
    }
  });
}
