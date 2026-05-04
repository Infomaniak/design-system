import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { indent } from '../../../../../../../../../scripts/helpers/misc/string/indent/indent.ts';
import { removeTrailingSlash } from '../../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { KotlinVariableDeclaration } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/kotlin-variable-declaration.ts';
import { kotlinVariableDeclarationsToString } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/kotlin-variable-declarations-to-string.ts';
import { wrapKotlinVariableDeclarationsWithImports } from '../../../../../../shared/dtcg/resolver/to/kotlin/kotlin-variable-declaration/to/wrap-kotlin-variable-declarations-with-imports.ts';
import {
  designTokensCollectionTokenToKotlinVariableDeclaration,
  type DesignTokensCollectionTokenToKotlinVariableDeclarationOptions,
} from '../../../../../../shared/dtcg/resolver/to/kotlin/token/design-tokens-collection-token-to-kotlin-variable-declaration.ts';
import { createKotlinVariableNameGenerator } from '../../../../../../shared/dtcg/resolver/to/kotlin/token/name/create-kotlin-variable-name-generator.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { T2_DIRECTORY_NAME, T3_DIRECTORY_NAME } from '../../../constants/design-token-tiers.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../constants/auto-generated-file-header.ts';

const KOTLIN_AUTO_GENERATED_FILE_HEADER = `/*
  ${indent(AUTO_GENERATED_FILE_HEADER)}
*/

`;

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

    const kotlinVariables: string = kotlinVariableDeclarationsToString(
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

    await writeTextFileSafe(
      `${kotlinOutputDirectory}/tokens.kt`,
      wrapKotlinVariableDeclarationsWithImports(
        kotlinVariables,
        [
          'package com.example.compose\n',
          'import androidx.compose.ui.graphics.Color',
          'import androidx.compose.ui.text.font.FontFamily',
          'import androidx.compose.ui.unit.Dp',
          'import androidx.compose.ui.unit.TextUnit',
          'import androidx.compose.ui.unit.dp',
          'import androidx.compose.ui.unit.sp',
          'import androidx.compose.ui.text.font.FontWeight',
          // composite
          'import androidx.compose.foundation.BorderStroke',
          'import androidx.compose.ui.graphics.shadow.Shadow',
          'import androidx.compose.ui.text.TextStyle',
        ],
        KOTLIN_AUTO_GENERATED_FILE_HEADER,
      ),
    );

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
