import type { ValueOrJsonReference } from '../../../../../../../../reference/types/json/value-or/value-or-json-reference.ts';
import type { ColorDesignTokenValueComponent } from './component/color-design-token-value-component.ts';

export type ColorDesignTokenValueComponents =
  readonly ValueOrJsonReference<ColorDesignTokenValueComponent>[];
