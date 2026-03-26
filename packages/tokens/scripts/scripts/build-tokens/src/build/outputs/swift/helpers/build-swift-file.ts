import { dedent } from '../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../../constants/auto-generated-file-header.ts';

export interface BuildSwiftFileOption {
  readonly imports: readonly string[];
  readonly type: string;
  readonly name: string;
  readonly content: string;
}

export function buildSwiftFile({ imports, type, name, content }: BuildSwiftFileOption): string {
  return dedent`
    /*
      ${AUTO_GENERATED_FILE_HEADER}
    */
    
    ${imports.map((importName: string): string => `import ${importName}`).join('\n')}
    
    ${type} ${name} {
      ${content}
    }
  `;
}
