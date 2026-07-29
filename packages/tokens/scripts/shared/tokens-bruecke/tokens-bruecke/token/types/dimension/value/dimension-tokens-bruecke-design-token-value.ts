export type DimensionTokensBrueckeDesignTokenValueString = string;

export interface DimensionTokensBrueckeDesignTokenValueObject {
  readonly value: number;
  readonly unit: string;
}

export type DimensionTokensBrueckeDesignTokenValue =
  DimensionTokensBrueckeDesignTokenValueString | DimensionTokensBrueckeDesignTokenValueObject;
