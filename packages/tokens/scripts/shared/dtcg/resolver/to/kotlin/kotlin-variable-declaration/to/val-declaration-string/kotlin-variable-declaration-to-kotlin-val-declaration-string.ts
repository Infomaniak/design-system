import type { KotlinVariableDeclaration } from '../../kotlin-variable-declaration.ts';
import { isKotlinVariableDeclarationRefValue } from '../../value/built-in/ref/kotlin-variable-declaration-reference-value.ts';

export interface KotlinVariableDeclarationToKotlinValDeclarationStringOptions {
  readonly context?: 'global' | 'data-class' | 'fun-argument' | 'data-class-init';
}

export function kotlinVariableDeclarationToKotlinValDeclarationString(
  declaration: KotlinVariableDeclaration,
  { context = 'global' }: KotlinVariableDeclarationToKotlinValDeclarationStringOptions = {},
): string {
  let output: string = '';

  if (context === 'global' || context === 'data-class') {
    if (declaration.description !== undefined || declaration.deprecated) {
      output += '/*\n';
      const prefix: string = '  ';

      if (declaration.description) {
        for (const line of declaration.description.split('\n')) {
          output += `${prefix}${line}\n`;
        }
      }

      if (declaration.deprecated) {
        output += `${prefix}@deprecated${typeof declaration.deprecated === 'string' ? ` ${declaration.deprecated}` : ''}\n`;
      }

      output += ' */\n';
    }

    if (declaration.deprecated !== undefined) {
      output += `@Deprecated(${typeof declaration.deprecated === 'string' ? JSON.stringify(declaration.deprecated) : ''})`;
    }
  }

  const getValueType = () => {
    if (isKotlinVariableDeclarationRefValue(declaration.value)) {
      if (declaration.value.valueType === undefined) {
        throw new Error(`Missing value type for variable: ${declaration.name}`);
      }
      return declaration.value.valueType;
    } else {
      return declaration.value.type;
    }
  };

  switch (context) {
    case 'global':
      output += `val ${declaration.name} = ${declaration.value.value}`;
      break;
    case 'data-class':
      output += `val ${declaration.name}: ${getValueType()},`;
      break;
    case 'fun-argument':
      output += `${declaration.name}: ${getValueType()} = ${declaration.value.value},`;
      break;
    case 'data-class-init':
      output += `${declaration.name} = ${declaration.name},`;
      break;
    default:
      throw new Error(`Unsupported context: ${context}`);
  }

  return output;
}
