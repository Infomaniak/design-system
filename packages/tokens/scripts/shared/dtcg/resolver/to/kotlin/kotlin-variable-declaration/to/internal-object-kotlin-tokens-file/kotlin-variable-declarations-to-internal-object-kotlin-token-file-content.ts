import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../../../../../../../scripts/build-tokens/src/build/constants/auto-generated-file-header.ts';
import type { KotlinVariableDeclaration } from '../../kotlin-variable-declaration.ts';
import { SHARED_KOTLIN_TOKENS_FILE_IMPORTS } from '../shared/shared-kotlin-tokens-file-imports.ts';
import { kotlinVariableDeclarationsToKotlinValDeclarationsString } from '../val-declaration-string/kotlin-variable-declarations-to-kotlin-val-declarations-string.ts';

export interface KotlinVariableDeclarationsToInternalObjectKotlinTokenFileContentOptions {
  readonly packageName: string;
  readonly primitiveTokensPackageName: string;
  readonly objectName: string;
  readonly declarations: Iterable<KotlinVariableDeclaration>;
}

export function kotlinVariableDeclarationsToInternalObjectKotlinTokenFileContent({
  packageName,
  primitiveTokensPackageName,
  objectName,
  declarations,
}: KotlinVariableDeclarationsToInternalObjectKotlinTokenFileContentOptions): string {
  return dedent`
    /*
      ${AUTO_GENERATED_FILE_HEADER}
    */
    
    package ${packageName}
    
    ${SHARED_KOTLIN_TOKENS_FILE_IMPORTS}
    
    import ${primitiveTokensPackageName}.*
    
    internal object ${objectName}(
      ${kotlinVariableDeclarationsToKotlinValDeclarationsString(declarations, {
        context: 'internal-object-member-initialized',
      })}
    )
  `;
}
