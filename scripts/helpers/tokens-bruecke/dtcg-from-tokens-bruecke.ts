import type { FontFamilyToken, FontWeightToken, Group, Token } from '@terrazzo/token-tools';
import type { AlphaNumeric } from '../types/template-types/alpha-numeric.ts';

export type DesignTokenName = `${AlphaNumeric}${string}`;

export interface TokensBrueckeGroupNode {
  readonly $description?: string;
  readonly $extensions?: Record<string, unknown>;
  readonly $deprecated?: string | boolean;
  readonly [key: `${DesignTokenName}`]: TokensBrueckeGroupOrTokenNode;
}

export interface TokensBrueckeTokenNode<GType extends string = any, GValue = any> {
  readonly $type: GType;
  readonly $value: GValue;
  readonly $description?: string;
  readonly $extensions?: Record<string, unknown>;
  readonly $deprecated?: string | boolean;
}

/*--*/

export type TokensBrueckeGroupOrTokenNode = TokensBrueckeGroupNode | TokensBrueckeTokenNode;

/*--*/

export interface TokensBrueckeExtensions {
  readonly 'tokens-bruecke-meta': {
    readonly useDTCGKeys: true;
    readonly colorMode: 'hex' | string;
    readonly variableCollections: readonly string[];
    readonly createdAt: string; // date in ISO format
  };
}

/*--*/
/*--*/

export function tokensBrueckeToDtcg(input: TokensBrueckeGroupOrTokenNode): Group {
  return tokensBrueckeGroupOrTokenNodeToDtcg(input, { root: input, path: [] });
}

interface TokensBrueckeToDtcgContext {
  readonly root: TokensBrueckeGroupOrTokenNode;
  readonly path: readonly string[];
}

function tokensBrueckeGroupNodeToDtcg(
  input: TokensBrueckeGroupNode,
  ctx: TokensBrueckeToDtcgContext,
): Group {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]: [string, any]): [string, any] => {
      return [
        key,
        key.startsWith('$')
          ? value
          : tokensBrueckeGroupOrTokenNodeToDtcg(value, { ...ctx, path: [...ctx.path, key] }),
      ];
    }),
  );
}

function tokensBrueckeGroupOrTokenNodeToDtcg(
  input: TokensBrueckeGroupOrTokenNode,
  ctx: TokensBrueckeToDtcgContext,
): Group {
  if ('$value' in input) {
    return tokensBrueckeTokenNodeToDtcg(input, ctx);
  } else {
    return tokensBrueckeGroupNodeToDtcg(input, ctx);
  }
}

function tokensBrueckeTokenNodeToDtcg(
  input: TokensBrueckeTokenNode,
  ctx: TokensBrueckeToDtcgContext,
): Token {
  switch (input.$type) {
    case 'string':
      return tokensBrueckeStringTokenNodeToDtcg(input, ctx);
    case 'color':
    case 'dimension':
    case 'fontFamily':
    case 'fontWeight':
    case 'duration':
    case 'cubicBezier':
    case 'number':
    case 'strokeStyle':
    case 'border':
    case 'transition':
    case 'shadow':
    case 'gradient':
    case 'typography':
    // unofficial
    case 'grid':
    case 'blur':
      return input as Token;
    default:
      throw new Error(`[${ctx.path.join('.')}] - Unable to transform "${input.$type}" type`);
  }
}

function tokensBrueckeStringTokenNodeToDtcg(
  input: TokensBrueckeTokenNode,
  ctx: TokensBrueckeToDtcgContext,
): Token {
  if (ctx.path.includes('font')) {
    if (ctx.path.includes('family')) {
      return {
        ...input,
        $type: 'fontFamily',
      } satisfies FontFamilyToken;
    } else if (ctx.path.includes('style')) {
      console.warn('fontStyle are not supported yet.');
      return {
        ...input,
        $type: 'fontStyle',
      } as any;
    } else if (ctx.path.includes('weight')) {
      const weight: number = parseInt(input.$value, 10);
      return {
        ...input,
        $type: 'fontWeight',
        $value: Number.isNaN(weight) ? input.$value : weight,
      } as FontWeightToken;
    }
  }

  throw new Error(`[${ctx.path.join('.')}] - Unable to transform "string" type`);
}
