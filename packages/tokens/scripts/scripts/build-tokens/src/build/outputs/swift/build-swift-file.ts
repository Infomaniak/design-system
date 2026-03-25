import { dedent } from "../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts"
import { AUTO_GENERATED_FILE_HEADER } from "../../constants/auto-generated-file-header.ts";

interface BuildSwiftFileOption {
    readonly imports: string[],
    readonly type: string,
    readonly name: string,
    readonly content: string
}

export function buildSwiftFile({
    imports,
    type,
    name,
    content
}: BuildSwiftFileOption): string {
    return dedent`
            /*
              ${AUTO_GENERATED_FILE_HEADER}
            */
            
            ${imports.map(i => `import ${i}`).join("\n")}
            
            ${type} ${name} {
              ${content}
            }
          `;
}