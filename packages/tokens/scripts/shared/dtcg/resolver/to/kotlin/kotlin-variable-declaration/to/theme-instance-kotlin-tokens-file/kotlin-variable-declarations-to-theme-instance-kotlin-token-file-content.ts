import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../../../../../../../scripts/build-tokens/src/build/constants/auto-generated-file-header.ts';
import type { KotlinVariableDeclaration } from '../../kotlin-variable-declaration.ts';
import { kotlinVariableDeclarationsToKotlinValDeclarationsString } from '../val-declaration-string/kotlin-variable-declarations-to-kotlin-val-declarations-string.ts';

export interface KotlinVariableDeclarationsToThemeInstanceKotlinTokenFileContentOptions {
  readonly packageName: string;
  readonly foundationTokensPackageName: string;
  readonly internalTokensPackageName: string;
  readonly instanceName: string;
  readonly className: string;
  readonly declarations: Iterable<KotlinVariableDeclaration>;
}

export function kotlinVariableDeclarationsToThemeInstanceKotlinTokenFileContent({
  packageName,
  foundationTokensPackageName,
  internalTokensPackageName,
  instanceName,
  className,
  declarations,
}: KotlinVariableDeclarationsToThemeInstanceKotlinTokenFileContentOptions): string {
  return dedent`
    /*
      ${AUTO_GENERATED_FILE_HEADER}
    */
    
    package ${packageName}

    import ${foundationTokensPackageName}.*
    import ${internalTokensPackageName}
    
    internal val ${instanceName} = ${className}(
      ${kotlinVariableDeclarationsToKotlinValDeclarationsString(declarations, {
        context: 'data-class-init',
      })}
    )
  `;
}
