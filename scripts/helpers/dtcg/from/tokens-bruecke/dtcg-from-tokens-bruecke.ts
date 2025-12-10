export type TokensBrueckeRootNode = TokensBrueckeGroupNode &
  TokensBrueckeNodeWithExtensions<{
    'tokens-bruecke-meta': {
      readonly useDTCGKeys: true;
      readonly colorMode: 'hex';
      readonly variableCollections: readonly string[];
      readonly createdAt: string; // date in ISO format
    };
  }>;

export interface TokensBrueckeGroupNode {
  readonly [key: string]: TokensBrueckeGroupNode | TokensBrueckeValueNode;
}

export interface TokensBrueckeNodeWithExtensions<GExtension> {
  readonly $extensions: GExtension;
}

export interface TokensBrueckeValueNode<GType extends string = any, GValue = any> {
  readonly $type: GType;
  readonly $value: GValue;
  readonly $description?: string;
  readonly $extensions?: {
    readonly mode?: {};
    readonly styleId?: string;
  };
}

export function dtcgFromTokensBruecke() {
  const a: TokensBrueckeRootNode = null as any;
}
