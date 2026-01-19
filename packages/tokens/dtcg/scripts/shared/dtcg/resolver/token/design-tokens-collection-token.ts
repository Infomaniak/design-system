import type { CurlyReference } from '../../design-token/reference/types/curly/curly-reference.ts';
import type { ValueOrCurlyReference } from '../../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { ArrayDesignTokenName } from './name/array-design-token-name.ts';

/* COMMON */

export interface DesignTokensCollectionTokenCommonProperties {
  readonly files: readonly string[];
  readonly name: ArrayDesignTokenName;
  readonly description?: string;
  readonly deprecated?: boolean | string;
  readonly extensions?: object;
}

/* WITH TYPE */

export interface DesignTokensCollectionTokenWithType<
  GType extends string,
  GValue,
> extends DesignTokensCollectionTokenCommonProperties {
  readonly type: GType;
  readonly value: ValueOrCurlyReference<GValue>;
}

export function isDesignTokensCollectionTokenWithType<GType extends string, GValue>(
  input: GenericDesignTokensCollectionToken,
): input is DesignTokensCollectionTokenWithType<GType, GValue> {
  return input.type !== undefined;
}

export type GenericDesignTokensCollectionTokenWithType = DesignTokensCollectionTokenWithType<
  any,
  any
>;

/* WITHOUT TYPE */

export interface DesignTokensCollectionTokenWithoutType extends DesignTokensCollectionTokenCommonProperties {
  readonly type?: undefined;
  readonly value: CurlyReference;
}

export function isDesignTokensCollectionTokenWithoutType(
  input: GenericDesignTokensCollectionToken,
): input is DesignTokensCollectionTokenWithoutType {
  return input.type === undefined;
}

/* TOKEN */

export type DesignTokensCollectionToken<GType extends string, GValue> =
  | DesignTokensCollectionTokenWithType<GType, GValue>
  | DesignTokensCollectionTokenWithoutType;

export type GenericDesignTokensCollectionToken = DesignTokensCollectionToken<any, any>;

/* RESOLVED */

export interface ResolvedDesignTokensCollectionToken<
  GType extends string,
  GValue,
> extends DesignTokensCollectionTokenCommonProperties {
  readonly type: GType;
  readonly value: GValue;
  readonly trace: readonly ArrayDesignTokenName[];
}

export type GenericResolvedDesignTokensCollectionToken = ResolvedDesignTokensCollectionToken<
  any,
  any
>;
