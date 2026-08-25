import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../../../../../../../scripts/build-tokens/src/build/constants/auto-generated-file-header.ts';
import type { KotlinVariableDeclaration } from '../../kotlin-variable-declaration.ts';
import { generateKotlinTokensFileImports } from '../shared/generate-kotlin-tokens-file-imports.ts';
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
  const content: string = kotlinVariableDeclarationsToKotlinValDeclarationsString(declarations, {
    context: 'internal-object-member-initialized',
  });

  return dedent`
    /*
      ${AUTO_GENERATED_FILE_HEADER}
    */
    
    package ${packageName}
    
    ${generateKotlinTokensFileImports(content)}
    
    import ${primitiveTokensPackageName}.*
    
    internal object ${objectName} {
      ${content}
    }
  `;
}
