import { glob, readFile } from 'node:fs/promises';
import { removeUndefinedProperties } from '../../../../../../../scripts/helpers/misc/remove-undefined-properties.ts';
import { isDesignTokenReference } from '../design-token/reference/is-design-token-reference.ts';
import { designTokenReferenceToCurlyReference } from '../design-token/reference/to/curly-reference/design-token-reference-to-curly-reference.ts';
import { designTokenReferenceToSegmentsReference } from '../design-token/reference/to/segments-reference/design-token-reference-to-segments-reference.ts';
import type { CurlyReference } from '../design-token/reference/types/curly/curly-reference.ts';
import type { ValueOrCurlyReference } from '../design-token/reference/types/curly/value-or/value-or-curly-reference.ts';
import { resolveValueOrJsonReference } from '../design-token/reference/types/json/value-or/resolve/resolve-value-or-json-reference.ts';
import type { ValueOrJsonReference } from '../design-token/reference/types/json/value-or/value-or-json-reference.ts';
import type { SegmentsReference } from '../design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import { segmentsReferenceToString } from '../design-token/reference/types/segments/to/string/segments-reference-to-string.ts';
import type { ValueOrDesignTokenReference } from '../design-token/reference/value-or/value-or-design-token-reference.ts';
import { isDesignToken } from '../design-token/token/is-design-token.ts';
import type { ColorDesignTokenValue } from '../design-token/token/types/base/types/color/value/color-design-token-value.ts';
import type { ColorDesignTokenValueComponent } from '../design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';
import type { CubicBezierDesignTokenValue } from '../design-token/token/types/base/types/cubic-bezier/value/cubic-bezier-design-token-value.ts';
import type { DimensionDesignTokenValue } from '../design-token/token/types/base/types/dimension/value/dimension-design-token-value.ts';
import type { DurationDesignTokenValue } from '../design-token/token/types/base/types/duration/value/duration-design-token-value.ts';
import type { FontFamilyDesignTokenValue } from '../design-token/token/types/base/types/font-family/value/font-family-design-token-value.ts';
import { isStringFontFamilyDesignTokenValue } from '../design-token/token/types/base/types/font-family/value/types/string/is-string-font-family-design-token-value.ts';
import type { FontWeightDesignTokenValue } from '../design-token/token/types/base/types/font-weight/value/font-weight-design-token-value.ts';
import type { NumberDesignTokenValue } from '../design-token/token/types/base/types/number/value/number-design-token-value.ts';
import type { BorderDesignTokenValue } from '../design-token/token/types/composite/types/border/value/border-design-token-value.ts';
import type { GradientDesignTokenValue } from '../design-token/token/types/composite/types/gradient/value/gradient-design-token-value.ts';
import type { ObjectGradientDesignTokenValue } from '../design-token/token/types/composite/types/gradient/value/members/object/object-gradient-design-token-value.ts';
import type { ShadowDesignTokenValue } from '../design-token/token/types/composite/types/shadow/value/shadow-design-token-value.ts';
import { isObjectShadowDesignTokenValue } from '../design-token/token/types/composite/types/shadow/value/types/object/is-object-shadow-design-token-value.ts';
import type { ObjectShadowDesignTokenValue } from '../design-token/token/types/composite/types/shadow/value/types/object/object-shadow-design-token-value.ts';
import type { StrokeStyleDesignTokenValue } from '../design-token/token/types/composite/types/stroke-style/value/stroke-style-design-token-value.ts';
import type { ObjectStrokeStyleDesignTokenValue } from '../design-token/token/types/composite/types/stroke-style/value/types/object/object-stroke-style-design-token-value.ts';
import { isPredefinedStrokeStyleDesignTokenValue } from '../design-token/token/types/composite/types/stroke-style/value/types/predefined/is-predefined-stroke-style-design-token-value.ts';
import type { TransitionDesignTokenValue } from '../design-token/token/types/composite/types/transition/value/transition-design-token-value.ts';
import type { TypographyDesignTokenValue } from '../design-token/token/types/composite/types/typography/value/typography-design-token-value.ts';
import { designTokensTreeSchema } from '../design-token/tree/design-tokens-tree.schema.ts';
import type { DesignTokensTree } from '../design-token/tree/design-tokens-tree.ts';

export interface DesignTokensCollectionToken {
  readonly file: string | undefined;
  readonly name: ArrayDesignTokenName;
  readonly type: string;
  readonly value: unknown | CurlyReference;
  readonly description: string | undefined;
  readonly deprecated: boolean | string | undefined;
  readonly extensions: object | undefined;
}

export interface DesignTokensCollectionTokensIteratorOptions {
  readonly merge?: boolean;
}

export type ArrayDesignTokenName = readonly string[];

export type StringDesignTokenName = string;

export type DesignTokenNameLike = StringDesignTokenName | ArrayDesignTokenName;

export type ArrayDesignTokenNameOrToken = ArrayDesignTokenName | DesignTokensCollectionToken;

export type DesignTokenNameLikeOrToken = DesignTokenNameLike | DesignTokensCollectionToken;

export class DesignTokensCollection {
  static isCurlyReference(input: unknown): input is CurlyReference {
    return typeof input === 'string' && input.startsWith('{') && input.endsWith('}');
  }

  static curlyReferenceToArrayDesignTokenName(input: CurlyReference): ArrayDesignTokenName {
    return input.slice(1, -1).split('.');
  }

  static arrayDesignTokenNameToCurlyReference(input: ArrayDesignTokenName): CurlyReference {
    return `{${input.join('.')}}`;
  }

  static #tokenNamesEqual(a: ArrayDesignTokenName, b: ArrayDesignTokenName): boolean {
    return (
      a.length === b.length &&
      a.every((token: string, index: number): boolean => token === b[index])
    );
  }

  static #stringDesignTokenNameToArray(input: string): ArrayDesignTokenName {
    return input.startsWith('{') && input.endsWith('}')
      ? input.slice(1, -1).split('.')
      : input.split('.');
  }

  static #designTokenNameLikeToArray(input: DesignTokenNameLike): ArrayDesignTokenName {
    return typeof input === 'string' ? this.#stringDesignTokenNameToArray(input) : input;
  }

  static #designTokenNameLikeOrTokenToArrayOrToken(
    input: DesignTokenNameLikeOrToken,
  ): ArrayDesignTokenNameOrToken {
    return typeof input === 'string' ? this.#stringDesignTokenNameToArray(input) : input;
  }

  readonly #tokens: DesignTokensCollectionToken[];

  constructor() {
    this.#tokens = [];
  }

  /* FROM */

  async fromFiles(sources: Iterable<string>): Promise<this> {
    for (const path of sources) {
      for await (const entry of glob(path)) {
        this.fromDesignTokensTree(
          designTokensTreeSchema.parse(
            JSON.parse(
              await readFile(entry, {
                encoding: 'utf-8',
              }),
            ),
          ) as DesignTokensTree,
          entry,
        );
      }
    }

    return this;
  }

  #resolveJsonReferencesOfDesignTokenValue($type: string, $value: unknown, root: unknown): unknown {
    switch ($type) {
      case 'color':
        return this.#resolveJsonReferencesOfColorDesignTokenValue(
          $value as ColorDesignTokenValue,
          root,
        );
      case 'cubicBezier':
        return this.#resolveJsonReferencesOfCubicBezierDesignTokenValue(
          $value as CubicBezierDesignTokenValue,
          root,
        );
      case 'dimension':
        return this.#resolveJsonReferencesOfDimensionDesignTokenValue(
          $value as DimensionDesignTokenValue,
          root,
        );
      case 'duration':
        return this.#resolveJsonReferencesOfDurationDesignTokenValue(
          $value as DurationDesignTokenValue,
          root,
        );
      case 'fontFamily':
        return this.#resolveJsonReferencesOfFontFamilyDesignTokenValue(
          $value as FontFamilyDesignTokenValue,
          root,
        );
      case 'fontWeight':
        return this.#resolveJsonReferencesOfFontWeightDesignTokenValue(
          $value as FontWeightDesignTokenValue,
          root,
        );
      case 'number':
        return this.#resolveJsonReferencesOfNumberDesignTokenValue(
          $value as NumberDesignTokenValue,
          root,
        );

      case 'border':
        return this.#resolveJsonReferencesOfBorderDesignTokenValue(
          $value as BorderDesignTokenValue,
          root,
        );
      case 'gradient':
        return this.#resolveJsonReferencesOfGradientDesignTokenValue(
          $value as GradientDesignTokenValue,
          root,
        );
      case 'shadow':
        return this.#resolveJsonReferencesOfShadowDesignTokenValue(
          $value as ShadowDesignTokenValue,
          root,
        );
      case 'strokeStyle':
        return this.#resolveJsonReferencesOfStrokeStyleDesignTokenValue(
          $value as StrokeStyleDesignTokenValue,
          root,
        );
      case 'transition':
        return this.#resolveJsonReferencesOfTransitionDesignTokenValue(
          $value as TransitionDesignTokenValue,
          root,
        );
      case 'typography':
        return this.#resolveJsonReferencesOfTypographyDesignTokenValue(
          $value as TypographyDesignTokenValue,
          root,
        );
      default:
        console.warn(`Unknown token type: ${$type}.`);
        return $value;
    }
  }

  #resolveJsonReferencesOfColorDesignTokenValue(
    $value: ColorDesignTokenValue,
    root: unknown,
  ): unknown {
    return {
      colorSpace: resolveValueOrJsonReference($value.colorSpace, root),
      components: resolveValueOrJsonReference($value.components, root).map(
        (
          component: ValueOrJsonReference<ColorDesignTokenValueComponent>,
        ): ColorDesignTokenValueComponent => {
          return resolveValueOrJsonReference(component, root);
        },
      ),
      alpha: resolveValueOrJsonReference($value.alpha, root),
    };
  }

  #resolveJsonReferencesOfCubicBezierDesignTokenValue(
    $value: CubicBezierDesignTokenValue,
    root: unknown,
  ): unknown {
    return $value.map((component: ValueOrJsonReference<number>): number => {
      return resolveValueOrJsonReference(component, root);
    });
  }

  #resolveJsonReferencesOfDimensionDesignTokenValue(
    $value: DimensionDesignTokenValue,
    root: unknown,
  ): unknown {
    return {
      value: resolveValueOrJsonReference($value.value, root),
      unit: resolveValueOrJsonReference($value.unit, root),
    };
  }

  #resolveJsonReferencesOfDurationDesignTokenValue(
    $value: DurationDesignTokenValue,
    root: unknown,
  ): unknown {
    return {
      value: resolveValueOrJsonReference($value.value, root),
      unit: resolveValueOrJsonReference($value.unit, root),
    };
  }

  #resolveJsonReferencesOfFontFamilyDesignTokenValue(
    $value: FontFamilyDesignTokenValue,
    root: unknown,
  ): unknown {
    return isStringFontFamilyDesignTokenValue($value)
      ? $value
      : $value.map((component: ValueOrJsonReference<string>): string => {
          return resolveValueOrJsonReference(component, root);
        });
  }

  #resolveJsonReferencesOfFontWeightDesignTokenValue(
    $value: FontWeightDesignTokenValue,
    _root: unknown,
  ): unknown {
    return $value;
  }

  #resolveJsonReferencesOfNumberDesignTokenValue(
    $value: NumberDesignTokenValue,
    _root: unknown,
  ): unknown {
    return $value;
  }

  #resolveJsonReferencesOfCompositeDesignTokenChildValue<GValue, GNewValue>(
    valueOrReference: ValueOrDesignTokenReference<GValue>,
    resolve: (value: GValue) => GNewValue,
  ): ValueOrCurlyReference<GNewValue> {
    return isDesignTokenReference(valueOrReference)
      ? designTokenReferenceToCurlyReference(valueOrReference)
      : resolve(valueOrReference);
  }

  #resolveJsonReferencesOfBorderDesignTokenValue(
    $value: BorderDesignTokenValue,
    root: unknown,
  ): unknown {
    return {
      color: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        $value.color,
        (value: ColorDesignTokenValue) =>
          this.#resolveJsonReferencesOfColorDesignTokenValue(value, root),
      ),
      width: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        $value.width,
        (value: DimensionDesignTokenValue) =>
          this.#resolveJsonReferencesOfDimensionDesignTokenValue(value, root),
      ),
      style: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        $value.style,
        (value: StrokeStyleDesignTokenValue) =>
          this.#resolveJsonReferencesOfStrokeStyleDesignTokenValue(value, root),
      ),
    };
  }

  #resolveJsonReferencesOfGradientDesignTokenValue(
    $value: GradientDesignTokenValue,
    root: unknown,
  ): unknown {
    return $value.map((component: ValueOrDesignTokenReference<ObjectGradientDesignTokenValue>) => {
      return this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        component,
        (value: ObjectGradientDesignTokenValue) => {
          return this.#resolveJsonReferencesOfObjectGradientDesignTokenValue(value, root);
        },
      );
    });
  }

  #resolveJsonReferencesOfObjectGradientDesignTokenValue(
    value: ObjectGradientDesignTokenValue,
    root: unknown,
  ): unknown {
    return {
      color: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        value.color,
        (value: ColorDesignTokenValue) =>
          this.#resolveJsonReferencesOfColorDesignTokenValue(value, root),
      ),
      position: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        value.position,
        (value: NumberDesignTokenValue) =>
          this.#resolveJsonReferencesOfNumberDesignTokenValue(value, root),
      ),
    };
  }

  #resolveJsonReferencesOfShadowDesignTokenValue(
    $value: ShadowDesignTokenValue,
    root: unknown,
  ): unknown {
    return isObjectShadowDesignTokenValue($value)
      ? this.#resolveJsonReferencesOfObjectShadowDesignTokenValue($value, root)
      : $value.map((component: ValueOrDesignTokenReference<ObjectShadowDesignTokenValue>) => {
          return this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
            component,
            (value: ObjectShadowDesignTokenValue) => {
              return this.#resolveJsonReferencesOfObjectShadowDesignTokenValue(value, root);
            },
          );
        });
  }

  #resolveJsonReferencesOfObjectShadowDesignTokenValue(
    value: ObjectShadowDesignTokenValue,
    root: unknown,
  ): unknown {
    return {
      color: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        value.color,
        (value: ColorDesignTokenValue) =>
          this.#resolveJsonReferencesOfColorDesignTokenValue(value, root),
      ),
      offsetX: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        value.offsetX,
        (value: DimensionDesignTokenValue) =>
          this.#resolveJsonReferencesOfDimensionDesignTokenValue(value, root),
      ),
      offsetY: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        value.offsetY,
        (value: DimensionDesignTokenValue) =>
          this.#resolveJsonReferencesOfDimensionDesignTokenValue(value, root),
      ),
      blur: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        value.blur,
        (value: DimensionDesignTokenValue) =>
          this.#resolveJsonReferencesOfDimensionDesignTokenValue(value, root),
      ),
      spread: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        value.spread,
        (value: DimensionDesignTokenValue) =>
          this.#resolveJsonReferencesOfDimensionDesignTokenValue(value, root),
      ),
      inset: value.inset,
    };
  }

  #resolveJsonReferencesOfStrokeStyleDesignTokenValue(
    $value: StrokeStyleDesignTokenValue,
    root: unknown,
  ): unknown {
    return isPredefinedStrokeStyleDesignTokenValue($value)
      ? $value
      : {
          dashArray: $value.dashArray.map(
            (component: ValueOrDesignTokenReference<DimensionDesignTokenValue>) => {
              return this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
                component,
                (value: DimensionDesignTokenValue) =>
                  this.#resolveJsonReferencesOfDimensionDesignTokenValue(value, root),
              );
            },
          ),
          lineCap: $value.lineCap,
        };
  }

  #resolveJsonReferencesOfTransitionDesignTokenValue(
    $value: TransitionDesignTokenValue,
    root: unknown,
  ): unknown {
    return {
      duration: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        $value.duration,
        (value: DurationDesignTokenValue) =>
          this.#resolveJsonReferencesOfDurationDesignTokenValue(value, root),
      ),
      delay: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        $value.delay,
        (value: DurationDesignTokenValue) =>
          this.#resolveJsonReferencesOfDurationDesignTokenValue(value, root),
      ),
      timingFunction: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        $value.timingFunction,
        (value: CubicBezierDesignTokenValue) =>
          this.#resolveJsonReferencesOfCubicBezierDesignTokenValue(value, root),
      ),
    };
  }

  #resolveJsonReferencesOfTypographyDesignTokenValue(
    $value: TypographyDesignTokenValue,
    root: unknown,
  ): unknown {
    return {
      fontFamily: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        $value.fontFamily,
        (value: FontFamilyDesignTokenValue) =>
          this.#resolveJsonReferencesOfFontFamilyDesignTokenValue(value, root),
      ),
      fontSize: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        $value.fontSize,
        (value: DimensionDesignTokenValue) =>
          this.#resolveJsonReferencesOfDimensionDesignTokenValue(value, root),
      ),
      fontWeight: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        $value.fontWeight,
        (value: FontWeightDesignTokenValue) =>
          this.#resolveJsonReferencesOfFontWeightDesignTokenValue(value, root),
      ),
      letterSpacing: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        $value.letterSpacing,
        (value: DimensionDesignTokenValue) =>
          this.#resolveJsonReferencesOfDimensionDesignTokenValue(value, root),
      ),
      lineHeight: this.#resolveJsonReferencesOfCompositeDesignTokenChildValue(
        $value.lineHeight,
        (value: NumberDesignTokenValue) =>
          this.#resolveJsonReferencesOfNumberDesignTokenValue(value, root),
      ),
    };
  }

  fromDesignTokensTree(root: DesignTokensTree, file?: string | undefined): this {
    // TODO extract explore ?
    const explore = (path: readonly string[], tree: DesignTokensTree): void => {
      if (isDesignToken(tree)) {
        const { $value, $type, $deprecated, $description, $extensions } = tree;

        if (isDesignTokenReference($value)) {
          const reference: SegmentsReference = designTokenReferenceToSegmentsReference($value);

          try {
            const token: DesignTokensCollectionToken = this.get(reference);

            this.append({
              file,
              name: path,
              type: $type ?? token.type,
              value: segmentsReferenceToCurlyReference(reference),
              deprecated: $deprecated ?? token.deprecated,
              description: $description ?? token.description,
              extensions: $extensions ?? token.extensions,
            });
          } catch (error) {
            throw new Error(
              `Unable to resolve reference: ${segmentsReferenceToString(reference)}.`,
              {
                cause: error,
              },
            );
          }
        } else {
          if ($type === undefined) {
            throw new Error('Unable to resolve $type.');
          }

          this.append({
            file,
            name: path,
            type: $type,
            value: this.#resolveJsonReferencesOfDesignTokenValue($type, $value, root),
            deprecated: $deprecated,
            description: $description,
            extensions: $extensions,
          });
        }
      } else {
        const { $description, $type, $extends, $ref, $deprecated, $extensions, ...children } = tree;

        if ($extends !== undefined || $ref !== undefined) {
          throw new Error('Missing $extends and $ref implementation on DesignTokensGroup.'); // TODO
        }

        for (const [name, child] of Object.entries(children)) {
          explore([...path, name], {
            ...removeUndefinedProperties({ $description, $type, $deprecated, $extensions }),
            ...child,
          });
        }
      }
    };

    explore([], root);

    return this;
  }

  /* OPERATIONS -> MAP */

  get size(): number {
    return this.#tokens.length;
  }

  append(token: DesignTokensCollectionToken): this {
    this.#tokens.push(token);

    return this;
  }

  delete(nameOrToken: DesignTokenNameLikeOrToken): number {
    nameOrToken = DesignTokensCollection.#designTokenNameLikeOrTokenToArrayOrToken(nameOrToken);

    const isArrayTokenName: boolean = Array.isArray(nameOrToken);
    let deleted: number = 0;

    for (let i: number = 0; i < this.#tokens.length; i++) {
      const token: DesignTokensCollectionToken = this.#tokens[i];

      if (
        isArrayTokenName
          ? DesignTokensCollection.#tokenNamesEqual(token.name, nameOrToken as readonly string[])
          : token === nameOrToken
      ) {
        this.#tokens.splice(i, 1);
        i--;
        deleted++;
      }
    }

    return deleted;
  }

  get(name: DesignTokenNameLike): DesignTokensCollectionToken {
    const token: DesignTokensCollectionToken | undefined = this.getOptional(name);

    if (token === undefined) {
      throw new Error(
        `Missing token: ${DesignTokensCollection.#designTokenNameLikeToArray(name).join('.')}`,
      );
    } else {
      return token;
    }
  }

  getAll(name: DesignTokenNameLike): DesignTokensCollectionToken[] {
    name = DesignTokensCollection.#designTokenNameLikeToArray(name);

    return this.#tokens.filter((token: DesignTokensCollectionToken): boolean => {
      return DesignTokensCollection.#tokenNamesEqual(token.name, name);
    });
  }

  getOptional(name: DesignTokenNameLike): DesignTokensCollectionToken | undefined {
    name = DesignTokensCollection.#designTokenNameLikeToArray(name);

    for (let i: number = this.#tokens.length - 1; i >= 0; i--) {
      const token: DesignTokensCollectionToken = this.#tokens[i];

      if (DesignTokensCollection.#tokenNamesEqual(token.name, name)) {
        return token;
      }
    }

    return undefined;
  }

  has(nameOrToken: DesignTokenNameLikeOrToken): boolean {
    nameOrToken = DesignTokensCollection.#designTokenNameLikeOrTokenToArrayOrToken(nameOrToken);

    const isArrayTokenName: boolean = Array.isArray(nameOrToken);

    for (let i: number = 0; i < this.#tokens.length; i++) {
      const token: DesignTokensCollectionToken = this.#tokens[i];

      if (
        isArrayTokenName
          ? DesignTokensCollection.#tokenNamesEqual(token.name, nameOrToken as readonly string[])
          : token === nameOrToken
      ) {
        return true;
      }
    }

    return false;
  }

  set(token: DesignTokensCollectionToken): void {
    this.delete(token.name);
    this.append(token);
  }

  clear(): void {
    this.#tokens.length = 0;
  }

  *tokens({
    merge = true,
  }: DesignTokensCollectionTokensIteratorOptions = {}): Generator<DesignTokensCollectionToken> {
    if (merge) {
      const processed: Set<string> = new Set();

      for (let i: number = 0; i < this.#tokens.length; i++) {
        let token: DesignTokensCollectionToken = this.#tokens[i];

        const key: string = JSON.stringify(token.name);

        if (processed.has(key)) {
          continue;
        }

        processed.add(key);

        for (let j: number = this.#tokens.length - 1; j > i; j--) {
          const lastToken: DesignTokensCollectionToken = this.#tokens[j];

          if (DesignTokensCollection.#tokenNamesEqual(token.name, lastToken.name)) {
            token = lastToken;
            break;
          }
        }

        yield token;
      }
    } else {
      yield* this.#tokens;
    }
  }

  /* OPERATIONS -> MUTATE */

  rename(from: DesignTokenNameLike, to: DesignTokenNameLike): void {
    from = DesignTokensCollection.#designTokenNameLikeToArray(from);
    to = DesignTokensCollection.#designTokenNameLikeToArray(to);

    if (DesignTokensCollection.#tokenNamesEqual(from, to)) {
      return;
    }

    const fromAsCurlyReference: CurlyReference =
      DesignTokensCollection.arrayDesignTokenNameToCurlyReference(from);
    const toAsCurlyReference: CurlyReference =
      DesignTokensCollection.arrayDesignTokenNameToCurlyReference(to);

    for (let i: number = 0; i < this.#tokens.length; i++) {
      const token: DesignTokensCollectionToken = this.#tokens[i];

      if (DesignTokensCollection.#tokenNamesEqual(token.name, from)) {
        this.#tokens[i] = {
          ...token,
          name: to,
        };
      } else {
        // const updateValueOrCurlyReference = (
        //   input: unknown | CurlyReference,
        // ): unknown | CurlyReference => {
        //   return DesignTokensCollection.isCurlyReference(input) && input === fromAsCurlyReference
        //     ? toAsCurlyReference
        //     : input;
        // };

        if (DesignTokensCollection.isCurlyReference(token.value)) {
          if (token.value === fromAsCurlyReference) {
            this.#tokens[i] = {
              ...token,
              value: toAsCurlyReference,
            };
          }
        } else {
          switch (token.type) {
            case 'border': {
              const { color, width, style } = token.value as BorderDesignTokenValue;

              if (
                color === fromAsCurlyReference ||
                width === fromAsCurlyReference ||
                style === fromAsCurlyReference
              ) {
                this.#tokens[i] = {
                  ...token,
                  value: {
                    color: color === fromAsCurlyReference ? toAsCurlyReference : color,
                    width: width === fromAsCurlyReference ? toAsCurlyReference : width,
                    style: style === fromAsCurlyReference ? toAsCurlyReference : style,
                  },
                };
              }
              break;
            }
            case 'gradient': {
              if (
                (token.value as (ObjectGradientDesignTokenValue | CurlyReference)[]).some(
                  (component: ObjectGradientDesignTokenValue | CurlyReference): boolean => {
                    return (
                      component === fromAsCurlyReference ||
                      (component as ObjectGradientDesignTokenValue).color ===
                        fromAsCurlyReference ||
                      (component as ObjectGradientDesignTokenValue).position ===
                        fromAsCurlyReference
                    );
                  },
                )
              ) {
                this.#tokens[i] = {
                  ...token,
                  value: (token.value as (ObjectGradientDesignTokenValue | CurlyReference)[]).map(
                    (component: ObjectGradientDesignTokenValue | CurlyReference): unknown => {
                      if (component === fromAsCurlyReference) {
                        return toAsCurlyReference;
                      } else {
                        const { color, position } = component as ObjectGradientDesignTokenValue;

                        return {
                          color: color === fromAsCurlyReference ? toAsCurlyReference : color,
                          position:
                            position === fromAsCurlyReference ? toAsCurlyReference : position,
                        };
                      }
                    },
                  ),
                };
              }
              break;
            }
            case 'shadow': {
              throw 'TODO';
            }
            case 'strokeStyle': {
              if (
                !isPredefinedStrokeStyleDesignTokenValue(token.value) &&
                (token.value as ObjectStrokeStyleDesignTokenValue).dashArray.some(
                  (component: ValueOrDesignTokenReference<DimensionDesignTokenValue>): boolean => {
                    return component === fromAsCurlyReference;
                  },
                )
              ) {
                this.#tokens[i] = {
                  ...token,
                  value: (token.value as ObjectStrokeStyleDesignTokenValue).dashArray.map(
                    (
                      component: ValueOrDesignTokenReference<DimensionDesignTokenValue>,
                    ): ValueOrDesignTokenReference<DimensionDesignTokenValue> => {
                      return component === fromAsCurlyReference ? toAsCurlyReference : component;
                    },
                  ),
                };
              }
              break;
            }
            case 'transition': {
              const { duration, delay, timingFunction } = token.value as TransitionDesignTokenValue;

              if (
                duration === fromAsCurlyReference ||
                delay === fromAsCurlyReference ||
                timingFunction === fromAsCurlyReference
              ) {
                this.#tokens[i] = {
                  ...token,
                  value: {
                    duration: duration === fromAsCurlyReference ? toAsCurlyReference : duration,
                    delay: delay === fromAsCurlyReference ? toAsCurlyReference : delay,
                    timingFunction:
                      timingFunction === fromAsCurlyReference ? toAsCurlyReference : timingFunction,
                  },
                };
              }
              break;
            }
            case 'typography': {
              const { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } =
                token.value as TypographyDesignTokenValue;

              if (
                fontFamily === fromAsCurlyReference ||
                fontSize === fromAsCurlyReference ||
                fontWeight === fromAsCurlyReference ||
                letterSpacing === fromAsCurlyReference ||
                lineHeight === fromAsCurlyReference
              ) {
                this.#tokens[i] = {
                  ...token,
                  value: {
                    fontFamily:
                      fontFamily === fromAsCurlyReference ? toAsCurlyReference : fontFamily,
                    fontSize: fontSize === fromAsCurlyReference ? toAsCurlyReference : fontSize,
                    fontWeight:
                      fontWeight === fromAsCurlyReference ? toAsCurlyReference : fontWeight,
                    letterSpacing:
                      letterSpacing === fromAsCurlyReference ? toAsCurlyReference : letterSpacing,
                    lineHeight:
                      lineHeight === fromAsCurlyReference ? toAsCurlyReference : lineHeight,
                  },
                };
              }
              break;
            }
          }
        }
      }
    }
  }
}

/*------------------*/

export async function debugDesignTokensCollection(sources: Iterable<string>): Promise<void> {
  const collection: DesignTokensCollection = new DesignTokensCollection();

  await collection.fromFiles(sources);

  console.log(collection.get('button.background.color'));
  collection.rename('color.brand.200', 't1.color.brand.200');
  console.log(collection.get('button.background.color'));
  // console.log(Array.from(collection.tokens()));
}
