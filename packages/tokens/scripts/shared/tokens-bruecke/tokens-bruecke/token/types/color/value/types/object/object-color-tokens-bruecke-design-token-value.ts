import type { ValueOrCurlyReference } from '../../../../../../../../dtcg/design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import type { StringColorTokensBrueckeDesignTokenValue } from '../string/string-color-tokens-bruecke-design-token-value.ts';

export interface ObjectColorTokensBrueckeDesignTokenValue {
  readonly components: ValueOrCurlyReference<StringColorTokensBrueckeDesignTokenValue>;
  readonly alpha: ValueOrCurlyReference<number>;
}
