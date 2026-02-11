export interface TokensBrueckeRootExtensions {
  readonly 'tokens-bruecke-meta': {
    readonly useDTCGKeys: true;
    readonly colorMode: 'hex' | string;
    readonly variableCollections: readonly string[];
    readonly createdAt: string; // date in ISO format
  };
}
