import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../../../../../../../scripts/build-tokens/src/build/constants/auto-generated-file-header.ts';
import type { KotlinVariableDeclaration } from '../../kotlin-variable-declaration.ts';
import { SHARED_KOTLIN_TOKENS_FILE_IMPORTS } from '../shared/shared-kotlin-tokens-file-imports.ts';
import { kotlinVariableDeclarationsToKotlinValDeclarationsString } from '../val-declaration-string/kotlin-variable-declarations-to-kotlin-val-declarations-string.ts';

export interface KotlinVariableDeclarationsToFoundationKotlinTokenFileContentOptions {
  readonly packageName: string;
  readonly className: string;
  readonly declarations: Iterable<KotlinVariableDeclaration>;
}

export function kotlinVariableDeclarationsToFoundationKotlinTokenFileContent({
  packageName,
  className,
  declarations,
}: KotlinVariableDeclarationsToFoundationKotlinTokenFileContentOptions): string {
  return dedent`
    /*
      ${AUTO_GENERATED_FILE_HEADER}
    */
    
    package ${packageName}
    
    import androidx.compose.runtime.Immutable
    ${SHARED_KOTLIN_TOKENS_FILE_IMPORTS}
    
    @Immutable
    data class ${className}(
      ${kotlinVariableDeclarationsToKotlinValDeclarationsString(declarations, {
        context: 'data-class-member-not-initialized',
      })}
    )
  `;
}
