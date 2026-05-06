import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../../../../../../../scripts/build-tokens/src/build/constants/auto-generated-file-header.ts';
import type { KotlinVariableDeclaration } from '../../kotlin-variable-declaration.ts';
import { SHARED_KOTLIN_TOKENS_FILE_IMPORTS } from '../shared/shared-kotlin-tokens-file-imports.ts';
import { kotlinVariableDeclarationsToKotlinValDeclarationsString } from '../val-declaration-string/kotlin-variable-declarations-to-kotlin-val-declarations-string.ts';

export function kotlinVariableDeclarationsToDataClassKotlinTokenFileContent(
  declarations: Iterable<KotlinVariableDeclaration>,
): string {
  return dedent`
    /*
      ${AUTO_GENERATED_FILE_HEADER}
    */
    
    package com.example.compose
    
    ${SHARED_KOTLIN_TOKENS_FILE_IMPORTS}
    
    data class EsdsTokens(
      ${kotlinVariableDeclarationsToKotlinValDeclarationsString(declarations, {
        context: 'data-class',
      })}
    )
  `;
}
