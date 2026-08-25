import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../../../../../../../scripts/build-tokens/src/build/constants/auto-generated-file-header.ts';
import type { KotlinVariableDeclaration } from '../../kotlin-variable-declaration.ts';
import { generateKotlinTokensFileImports } from '../shared/generate-kotlin-tokens-file-imports.ts';
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
  const content: string = kotlinVariableDeclarationsToKotlinValDeclarationsString(declarations, {
    context: 'data-class-member-not-initialized',
  });

  return dedent`
    /*
      ${AUTO_GENERATED_FILE_HEADER}
    */
    
    package ${packageName}
    
    import androidx.compose.runtime.Immutable
    ${generateKotlinTokensFileImports(content)}
    
    @Immutable
    data class ${className}(
      ${content}
    )
  `;
}
