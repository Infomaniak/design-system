import type { KotlinVariableDeclaration } from '../../kotlin-variable-declaration.ts';
import { isKotlinVariableDeclarationRefValue } from '../../value/built-in/ref/kotlin-variable-declaration-reference-value.ts';

export interface KotlinVariableDeclarationToKotlinValDeclarationStringOptions {
  readonly context?:
    | 'global'
    | 'data-class-member-not-initialized'
    | 'internal-object-member-initialized'
    | 'data-class-init'
    | 'fun-argument';
}

export function kotlinVariableDeclarationToKotlinValDeclarationString(
  declaration: KotlinVariableDeclaration,
  { context = 'global' }: KotlinVariableDeclarationToKotlinValDeclarationStringOptions = {},
): string {
  let output: string = '';

  if (
    context === 'global' ||
    context === 'data-class-member-not-initialized' ||
    context === 'internal-object-member-initialized'
  ) {
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

  const getOptionalValueType = (): string | undefined => {
    if (isKotlinVariableDeclarationRefValue(declaration.value)) {
      if (declaration.value.valueType === undefined) {
        return undefined;
      }
      return declaration.value.valueType;
    } else {
      return declaration.value.type;
    }
  };

  const getValueType = (): string => {
    const valueType: string | undefined = getOptionalValueType();
    if (valueType === undefined) {
      throw new Error(`Missing value type for variable: ${declaration.name}`);
    }
    return valueType;
  };

  switch (context) {
    case 'global': {
      const valueType: string | undefined = getOptionalValueType();

      output += `val ${declaration.name}${valueType === undefined ? '' : `: ${valueType}`} = ${declaration.value.value}`;
      break;
    }
    case 'data-class-member-not-initialized':
      output += `val ${declaration.name}: ${getValueType()},`;
      break;
    case 'internal-object-member-initialized':
      output += `val ${declaration.name}: ${getValueType()} = ${declaration.value.value},`;
      break;
    case 'data-class-init':
      output += `${declaration.name} = ${declaration.value.value},`;
      break;
    case 'fun-argument':
      output += `${declaration.name}: ${getValueType()} = ${declaration.value.value},`;
      break;
    default:
      throw new Error(`Unsupported context: ${context}`);
  }

  return output;
}
