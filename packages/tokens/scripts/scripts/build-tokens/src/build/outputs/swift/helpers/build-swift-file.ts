import { dedent } from '../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../../constants/auto-generated-file-header.ts';

export interface BuildSwiftFileOption {
  readonly imports: readonly string[];
  readonly type: string;
  readonly name: string;
  readonly protocols: readonly string[];
  readonly content: string;
}

export function buildSwiftFile({ imports, type, name, protocols, content }: BuildSwiftFileOption): string {
  const safeProtocols = protocols.length ? `: ${protocols.join(', ')}` : '';
  const safeContent = content.length ? `{
      ${content}
    }`: `{}`;

  return dedent`
    /*
      ${AUTO_GENERATED_FILE_HEADER}
    */
    
    ${imports.map((importName: string): string => `import ${importName}`).join('\n')}
    
    ${type} ${name}${safeProtocols} ${safeContent}
  `;
}
