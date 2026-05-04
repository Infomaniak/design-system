import type { KotlinVariableDeclarationBorderStrokeValue } from './built-in/border-stroke/kotlin-variable-declaration-border-stroke-value.ts';
import type { KotlinVariableDeclarationColorValue } from './built-in/color/kotlin-variable-declaration-color-value.ts';
import type { KotlinVariableDeclarationDpValue } from './built-in/dp/kotlin-variable-declaration-dp-value.ts';
import type { KotlinVariableDeclarationFloatValue } from './built-in/float/kotlin-variable-declaration-float-value.ts';
import type { KotlinVariableDeclarationFontFamilyValue } from './built-in/font-family/kotlin-variable-declaration-font-family-value.ts';
import type { KotlinVariableDeclarationFontWeightValue } from './built-in/font-weight/kotlin-variable-declaration-font-weight-value.ts';
import type { KotlinVariableDeclarationListOfFontFamilyValue } from './built-in/list-of-font-family/kotlin-variable-declaration-list-of-font-family-value.ts';
import type { KotlinVariableDeclarationReferenceValue } from './built-in/ref/kotlin-variable-declaration-reference-value.ts';
import type { KotlinVariableDeclarationShadowValue } from './built-in/shadow/kotlin-variable-declaration-shadow-value.ts';
import type { KotlinVariableDeclarationTextStyleValue } from './built-in/text-style/kotlin-variable-declaration-text-style-value.ts';
import type { KotlinVariableDeclarationTextUnitValue } from './built-in/text-unit/kotlin-variable-declaration-text-unit-value.ts';

export type KotlinVariableDeclarationValue =
  | KotlinVariableDeclarationColorValue
  | KotlinVariableDeclarationDpValue
  | KotlinVariableDeclarationTextUnitValue
  | KotlinVariableDeclarationFontFamilyValue
  | KotlinVariableDeclarationListOfFontFamilyValue
  | KotlinVariableDeclarationFontWeightValue
  | KotlinVariableDeclarationFloatValue
  | KotlinVariableDeclarationBorderStrokeValue
  | KotlinVariableDeclarationShadowValue
  | KotlinVariableDeclarationTextStyleValue
  | KotlinVariableDeclarationReferenceValue;
